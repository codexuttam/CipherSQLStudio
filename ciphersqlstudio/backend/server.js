const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const assignmentsRouter = require('./routes/assignments');
const queryRouter = require('./routes/query');
const hintRouter = require('./routes/hint');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/assignments', assignmentsRouter);
app.use('/api/execute-query', queryRouter);
app.use('/api/get-hint', hintRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`CipherSQL backend running on port ${PORT}`);
});
