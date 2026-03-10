import React, { useState } from 'react';

export default function Flashcard({ front, back }) {
    const [flipped, setFlipped] = useState(false);
    return (
        <div
            className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFlipped(!flipped)}
        >
            <div className="flashcard-face flashcard-front">
                <div className="flashcard-content">{front}</div>
            </div>
            <div className="flashcard-face flashcard-back">
                <div className="flashcard-content">{back}</div>
            </div>
        </div>
    );
}
