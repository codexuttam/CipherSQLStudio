import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAssignment, executeQuery, getHint } from '../services/api';
import SQLeditor from '../components/SQLeditor';
import ResultsTable from '../components/ResultsTable';
import SampleDataViewer from '../components/SampleDataViewer';
import Flashcard from '../components/Flashcard';

export default function AssignmentAttempt() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('SELECT * FROM employees;');
    const [result, setResult] = useState({ rows: [], fields: [] });
    const [hint, setHint] = useState('');

    useEffect(() => {
        fetchAssignment(id).then(setAssignment).catch(console.error);
    }, [id]);

    const [queryError, setQueryError] = useState(null);

    const run = async () => {
        try {
            setQueryError(null);
            const r = await executeQuery(query, id);
            setResult(r);
        } catch (err) {
            setResult({ rows: [], fields: [] });
            setQueryError(err.response?.data?.error || err.message || 'An error occurred during execution');
            console.error(err);
        }
    };

    const askHint = async () => {
        try {
            setHint('Loading hint...');
            const h = await getHint(assignment?.question || '', query);
            setHint(h.hint || 'No hint');
        } catch (err) {
            setHint('Error getting hint: ' + (err.response?.data?.error || err.message));
        }
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

                    <section className="panel study-panel">
                        <h3>Study Flashcard</h3>
                        <p className="muted small">Click the card to flip and reveal the hint/answer.</p>
                        <Flashcard front={assignment.question || assignment.title} back={assignment.description || 'No back content'} />
                    </section>

                    <section className="panel results-panel">
                        <h3>Results</h3>
                        {queryError && <div className="error-box" style={{ color: '#ef4444', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}><strong>Error:</strong> {queryError}</div>}
                        {!queryError && <ResultsTable fields={result.fields || []} rows={result.rows || []} />}
                    </section>
                </>
            )}
        </div>
    );
}
