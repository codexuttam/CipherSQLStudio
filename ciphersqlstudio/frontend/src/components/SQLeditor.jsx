import React from 'react';
import Editor from '@monaco-editor/react';

export default function SQLeditor({ value, onChange }) {
    return (
        <div className="sql-editor">
            <Editor
                height="300px"
                defaultLanguage="sql"
                theme="vs-dark"
                value={value}
                onChange={onChange}
                options={{ minimap: { enabled: false } }}
            />
        </div>
    );
}
