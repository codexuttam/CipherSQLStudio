import React, { useEffect, useState } from 'react';
import { fetchAssignments } from '../services/api';
import AssignmentCard from '../components/AssignmentCard';

export default function AssignmentList() {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments().then(setAssignments).catch(console.error);
    }, []);

    return (
        <div>
            <h2>Assignments</h2>
            <div className="cards-grid">
                {assignments.map(a => (
                    <AssignmentCard a={a} key={a._id} />
                ))}
            </div>
        </div>
    );
}
