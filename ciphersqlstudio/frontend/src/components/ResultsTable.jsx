import React from 'react';

export default function ResultsTable({ fields = [], rows = [] }) {
    if (!rows.length) return <div className="results-empty">No results</div>;
    return (
        <div className="results-table">
            <table>
                <thead>
                    <tr>
                        {fields.map(f => (
                            <th key={f}>{f}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, idx) => (
                        <tr key={idx}>
                            {fields.map(f => (
                                <td key={f}>{r[f] != null ? String(r[f]) : ''}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
