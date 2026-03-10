import React from 'react';

export default function SampleDataViewer({ tables = [] }) {
    return (
        <div className="sample-data">
            <h4>Sample Tables</h4>
            {tables.length === 0 && <div>No sample data provided</div>}
            {tables.map((t, idx) => {
                if (typeof t === 'string') {
                    return (
                        <div key={idx} className="sample-table">
                            <strong>{t}</strong>
                            <div className="sample-placeholder">(use the database's {t} table)</div>
                        </div>
                    );
                }

                return (
                    <div key={idx} className="sample-table" style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{t.tableName}</strong>
                        {t.columns && t.rows && t.rows.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        {t.columns.map((col, cIdx) => (
                                            <th key={cIdx} style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-color)' }}>
                                                {col.columnName} <span style={{ fontSize: '0.8em', color: 'var(--muted-color)', fontWeight: 'normal' }}>({col.dataType})</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {t.rows.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                            {t.columns.map((col, cIdx) => (
                                                <td key={cIdx} style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--muted-color)' }}>
                                                    {row[col.columnName]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="sample-placeholder">(No sample data provided for this table)</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
