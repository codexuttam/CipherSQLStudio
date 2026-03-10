require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';

const seedData = [
    {
        title: "List all employees",
        description: "Easy",
        question: "Select every column from the employees table",
        sampleTables: [
            {
                tableName: "employees",
                columns: [
                    { columnName: "id", dataType: "INTEGER PRIMARY KEY" },
                    { columnName: "name", dataType: "TEXT" },
                    { columnName: "salary", dataType: "INTEGER" }
                ],
                rows: [
                    { id: 1, name: "Alice", salary: 60000 },
                    { id: 2, name: "Bob", salary: 80000 },
                    { id: 3, name: "Charlie", salary: 90000 }
                ]
            }
        ],
        expectedOutput: {
            type: "table",
            value: [
                { id: 1, name: "Alice", salary: 60000 },
                { id: 2, name: "Bob", salary: 80000 },
                { id: 3, name: "Charlie", salary: 90000 }
            ]
        }
    },
    {
        title: "Employees with high salary",
        description: "Easy",
        question: "Find employees earning more than 70000",
        sampleTables: [
            {
                tableName: "employees",
                columns: [
                    { columnName: "id", dataType: "INTEGER PRIMARY KEY" },
                    { columnName: "name", dataType: "TEXT" },
                    { columnName: "salary", dataType: "INTEGER" }
                ],
                rows: [
                    { id: 1, name: "Alice", salary: 60000 },
                    { id: 2, name: "Bob", salary: 80000 },
                    { id: 3, name: "Charlie", salary: 90000 }
                ]
            }
        ],
        expectedOutput: {
            type: "table",
            value: [
                { id: 2, name: "Bob", salary: 80000 },
                { id: 3, name: "Charlie", salary: 90000 }
            ]
        }
    }
];

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB. Dropping old assignments...');
        await Assignment.deleteMany({});
        console.log('Inserting seed data...');
        await Assignment.insertMany(seedData);
        console.log('Database seeded successfully.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error seeding DB:', err);
        process.exit(1);
    });
