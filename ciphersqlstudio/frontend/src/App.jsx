import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AssignmentList from './pages/AssignmentList';
import AssignmentAttempt from './pages/AssignmentAttempt';

export default function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <header className="app-header">
                    <h1><Link to="/">CipherSQLStudio</Link></h1>
                </header>
                <Routes>
                    <Route path="/" element={<AssignmentList />} />
                    <Route path="/assignments/:id" element={<AssignmentAttempt />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
