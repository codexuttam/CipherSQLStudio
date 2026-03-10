import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssignmentCard({ a }) {
    const navigate = useNavigate();

    return (
        <div
            className="assignment-card card-3d"
            onClick={() => navigate(`/assignments/${a._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/assignments/${a._id}`)}
        >
            <div className="card-face card-front">
                <h3>{a.title}</h3>
                <p className="muted">Difficulty: {a.difficulty}</p>
                <p className="desc">{a.description}</p>
            </div>
            <div className="card-face card-back">
                <p className="muted">Ready to test your SQL skills?</p>
                <button className="btn primary" style={{ pointerEvents: 'none' }}>Start</button>
            </div>
        </div>
    );
}
