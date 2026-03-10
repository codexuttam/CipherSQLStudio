#!/usr/bin/env node
// Small helper to detect a process listening on port 4000 and kill it
// ONLY kills processes named 'node' owned by the current user to avoid harming system services.

const { execSync } = require('child_process');
const os = require('os');

const PORT = process.env.PORT || '4000';
const user = process.env.USER || os.userInfo().username;

function findListenerPids(port) {
    const results = [];
    try {
        // Use ss to find listeners; format includes users:("process",pid,fd)
        const out = execSync(`ss -ltnp '( sport = :${port} )'`, { encoding: 'utf8' });
        const lines = out.split('\n').slice(1).map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
            const m = line.match(/users:\(([^)]+)\)/);
            if (m) {
                const users = m[1];
                // users may contain multiple entries; find all occurrences of "name",pid,
                const entryRegex = /"([^"\\]+)",(\d+),/g;
                let em;
                while ((em = entryRegex.exec(users))) {
                    const procName = em[1];
                    const pid = Number(em[2]);
                    results.push({ procName, pid });
                }
            }
        }
    } catch (err) {
        // ss might not return anything or command could fail; we'll fallback to lsof below
    }

    // Fallback: use lsof to get PIDs listening on the port
    if (results.length === 0) {
        try {
            const out = execSync(`lsof -i :${port} -sTCP:LISTEN -Pn -t`, { encoding: 'utf8' }).trim();
            if (out) {
                const pids = out.split('\n').map(s => Number(s.trim())).filter(Boolean);
                for (const pid of pids) {
                    // try to get process name
                    try {
                        const cmd = execSync(`ps -p ${pid} -o comm=`, { encoding: 'utf8' }).trim();
                        results.push({ procName: cmd, pid });
                    } catch (_) {
                        results.push({ procName: 'unknown', pid });
                    }
                }
            }
        } catch (_) {
            // ignore
        }
    }

    return results;
}

function whoOwnsPid(pid) {
    try {
        const out = execSync(`ps -o user= -p ${pid}`, { encoding: 'utf8' }).trim();
        return out;
    } catch (err) {
        return null;
    }
}

async function killPid(pid) {
    try {
        process.kill(pid, 'SIGTERM');
    } catch (err) {
        return false;
    }
    // wait up to 2s for process to exit
    for (let i = 0; i < 20; i++) {
        try {
            process.kill(pid, 0);
            // still exists
            await new Promise(r => setTimeout(r, 100));
        } catch (err) {
            // process gone
            return true;
        }
    }
    // still alive, force kill
    try {
        process.kill(pid, 'SIGKILL');
        return true;
    } catch (_) {
        return false;
    }
}

(async () => {
    const infos = findListenerPids(PORT);
    if (!infos || infos.length === 0) {
        process.exit(0); // nothing to do
    }

    let handledAny = false;
    for (const { procName, pid } of infos) {
        if (!pid) continue;
        const owner = whoOwnsPid(pid) || 'unknown';
        if (procName.toLowerCase().includes('node') && owner === user) {
            handledAny = true;
            try {
                console.log(`Found node process (pid=${pid}) listening on port ${PORT}. Killing it so dev server can start.`);
                const ok = await killPid(pid);
                if (ok) console.log(`Killed pid ${pid}.`);
                else console.log(`Failed to kill pid ${pid}.`);
            } catch (err) {
                console.error(`Failed to kill pid ${pid}:`, err.message || err);
            }
        } else {
            console.log(`Port ${PORT} is in use by process '${procName}' (pid=${pid}, owner=${owner}). Not killing it.`);
        }
    }

    // If we attempted to kill a node pid, wait a short moment to ensure port is free
    if (handledAny) await new Promise(r => setTimeout(r, 300));
    process.exit(0);
})();
