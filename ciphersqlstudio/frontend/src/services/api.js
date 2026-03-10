import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export async function fetchAssignments() {
    const res = await axios.get(`${API_BASE}/assignments`);
    return res.data;
}

export async function fetchAssignment(id) {
    const res = await axios.get(`${API_BASE}/assignments/${id}`);
    return res.data;
}

export async function executeQuery(query, assignmentId) {
    const res = await axios.post(`${API_BASE}/execute-query`, { query, assignmentId });
    return res.data;
}

export async function getHint(question, query) {
    const res = await axios.post(`${API_BASE}/get-hint`, { question, query });
    return res.data;
}
