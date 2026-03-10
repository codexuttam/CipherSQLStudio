import React from 'react';

export default function SampleDataViewer({ tables = [] }) {
    return (
        <div className="sample-data">
            <h4>Sample Tables</h4>
            {tables.length === 0 && <div>No sample data provided</div>}
            {tables.map((t, idx) => (
                <div key={idx} className="sample-table">
                    <strong>{t}</strong>
                    <div className="sample-placeholder">(use the database's {t} table)</div>
                </div>
            ))}
        </div>
    );
}
