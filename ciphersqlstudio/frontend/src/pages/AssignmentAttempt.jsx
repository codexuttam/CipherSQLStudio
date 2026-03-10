import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAssignment, executeQuery, getHint } from '../services/api';
import SQLeditor from '../components/SQLeditor';
import ResultsTable from '../components/ResultsTable';
import SampleDataViewer from '../components/SampleDataViewer';

export default function AssignmentAttempt() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('SELECT * FROM employees;');
    const [result, setResult] = useState({ rows: [], fields: [] });
    const [hint, setHint] = useState('');

    useEffect(() => {
        fetchAssignment(id).then(setAssignment).catch(console.error);
    }, [id]);

    const run = async () => {
        try {
            const r = await executeQuery(query);
            setResult(r);
        } catch (err) {
            setResult({ rows: [], fields: [] });
            console.error(err);
        }
    };

    const askHint = async () => {
        const h = await getHint(assignment?.question || '', query);
        setHint(h.hint || 'No hint');
    };

    return (
        <div>
            {assignment && (
                <>
                    <section className="panel question-panel">
                        <h2>{assignment.title}</h2>
                        <p>{assignment.description}</p>
                        <p><strong>Question:</strong> {assignment.question}</p>
                    </section>

                    <section className="panel sample-panel">
                        <SampleDataViewer tables={assignment.tables} />
                    </section>

                    <section className="panel editor-panel">
                        <SQLeditor value={query} onChange={(val) => setQuery(val)} />
                        <div className="actions">
                            <button className="btn primary" onClick={run}>Run Query</button>
                            <button className="btn" onClick={askHint}>Get Hint</button>
                        </div>
                        {hint && <div className="hint-box"><strong>Hint:</strong> {hint}</div>}
                    </section>

                    <section className="panel results-panel">
                        <h3>Results</h3>
                        <ResultsTable fields={result.fields || []} rows={result.rows || []} />
                    </section>
                </>
            )}
        </div>
    );
}
