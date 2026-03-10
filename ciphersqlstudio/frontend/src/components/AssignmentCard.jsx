import React from 'react';
import { Link } from 'react-router-dom';

export default function AssignmentCard({ a }) {
    return (
        <div className="assignment-card">
            <h3>{a.title}</h3>
            <p>Difficulty: {a.difficulty}</p>
            <p>{a.description}</p>
            <Link to={`/assignments/${a._id}`} className="btn">Start</Link>
        </div>
    );
}
