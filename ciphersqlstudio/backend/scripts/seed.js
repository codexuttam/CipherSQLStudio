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
    },
    {
        title: "Sort employees by salary",
        description: "Medium",
        question: "Select all employees and order them by salary from highest to lowest.",
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
                    { id: 2, name: "Bob", salary: 120000 },
                    { id: 3, name: "Charlie", salary: 90000 },
                    { id: 4, name: "Diana", salary: 75000 }
                ]
            }
        ],
        expectedOutput: {
            type: "table",
            value: [
                { id: 2, name: "Bob", salary: 120000 },
                { id: 3, name: "Charlie", salary: 90000 },
                { id: 4, name: "Diana", salary: 75000 },
                { id: 1, name: "Alice", salary: 60000 }
            ]
        }
    },
    {
        title: "Total Payroll Aggregation",
        description: "Medium",
        question: "Calculate the total sum of all employee salaries. Alias the result column as 'total_payroll'.",
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
                    { id: 2, name: "Bob", salary: 120000 },
                    { id: 3, name: "Charlie", salary: 90000 }
                ]
            }
        ],
        expectedOutput: {
            type: "table",
            value: [
                { total_payroll: 270000 }
            ]
        }
    },
    {
        title: "Join users and orders",
        description: "Hard",
        question: "Write a query to join 'users' and 'orders' tables. Select the user's name and the amount of their order where the order amount is greater than 100.",
        sampleTables: [
            {
                tableName: "users",
                columns: [
                    { columnName: "id", dataType: "INTEGER PRIMARY KEY" },
                    { columnName: "name", dataType: "TEXT" }
                ],
                rows: [
                    { id: 1, name: "Alice" },
                    { id: 2, name: "Bob" },
                    { id: 3, name: "Charlie" }
                ]
            },
            {
                tableName: "orders",
                columns: [
                    { columnName: "id", dataType: "INTEGER PRIMARY KEY" },
                    { columnName: "user_id", dataType: "INTEGER" },
                    { columnName: "amount", dataType: "INTEGER" }
                ],
                rows: [
                    { id: 101, user_id: 1, amount: 50 },
                    { id: 102, user_id: 1, amount: 150 },
                    { id: 103, user_id: 2, amount: 200 }
                ]
            }
        ],
        expectedOutput: {
            type: "table",
            value: [
                { name: "Alice", amount: 150 },
                { name: "Bob", amount: 200 }
            ]
        }
    },
    {
        title: "Find the IT Department",
        description: "Medium",
        question: "Select all employees who work in the 'IT' department. You only need to return their names.",
        sampleTables: [
            {
                tableName: "employees",
                columns: [
                    { columnName: "id", dataType: "INTEGER PRIMARY KEY" },
                    { columnName: "name", dataType: "TEXT" },
                    { columnName: "department", dataType: "TEXT" }
                ],
                rows: [
                    { id: 1, name: "Alice", department: "HR" },
                    { id: 2, name: "Bob", department: "IT" },
                    { id: 3, name: "Charlie", department: "IT" },
                    { id: 4, name: "Diana", department: "Sales" }
                ]
            }
        ],
        expectedOutput: {
            type: "table",
            value: [
                { name: "Bob" },
                { name: "Charlie" }
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
