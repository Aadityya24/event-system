const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    registrationId TEXT UNIQUE,
    status TEXT DEFAULT 'Registered',
    timestamp DATETIME
)`);

app.post('/register', (req, res) => {
    const { name, email } = req.body;
    const registrationId = `EVT-${Date.now()}`;

    const sql = `INSERT INTO participants (name, email, registrationId) VALUES (?, ?, ?)`;
    db.run(sql, [name, email, registrationId], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: 'This email is already registered.' });
            }
            return res.status(500).json({ message: 'Database error.', error: err.message });
        }
        res.status(201).json({ message: 'Registration successful', registrationId: registrationId });
    });
});

app.post('/mark-attendance', (req, res) => {
    const { registrationId } = req.body;

    const findSql = `SELECT * FROM participants WHERE registrationId = ?`;
    db.get(findSql, [registrationId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Database error.", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Participant not found." });
        }
        if (row.status === 'Attended') {
            return res.status(409).json({ message: `${row.name} has already been marked as attended.` });
        }

        const updateSql = `UPDATE participants SET status = 'Attended', timestamp = datetime('now', 'localtime') WHERE registrationId = ?`;
        db.run(updateSql, [registrationId], function(err) {
            if (err) {
                return res.status(500).json({ message: "Failed to update attendance.", error: err.message });
            }
            res.status(200).json({ message: `Welcome, ${row.name}! Attendance marked successfully.` });
        });
    });
});

app.get('/attendees', (req, res) => {
    const sql = `SELECT name, email, status, timestamp FROM participants ORDER BY timestamp DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error.", error: err.message });
        }
        res.status(200).json(rows);
    });
});

app.get('/export', (req, res) => {
    const sql = `SELECT name, email, registrationId, status, timestamp FROM participants`;
    db.all(sql, [], async (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error.", error: err.message });
        }

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Registration ID', key: 'registrationId', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Timestamp', key: 'timestamp', width: 25 }
        ];

        worksheet.addRows(rows);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'attendance.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    });
});

app.post('/mark-attendance', (req, res) => {
    const { registrationId } = req.body;

    const findSql = `SELECT * FROM participants WHERE registrationId = ?`;
    db.get(findSql, [registrationId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Database error.", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Participant not found." });
        }
        if (row.status === 'Attended') {
            return res.status(409).json({ message: `${row.name} has already been marked as attended.` });
        }

        const updateSql = `UPDATE participants SET status = 'Attended', timestamp = datetime('now') WHERE registrationId = ?`;
        db.run(updateSql, [registrationId], function(err) {
            if (err) {
                return res.status(500).json({ message: "Failed to update attendance.", error: err.message });
            }
            res.status(200).json({ message: `Welcome, ${row.name}! Attendance marked successfully.` });
        });
    });
});

const excel = require('exceljs');

app.get('/export', (req, res) => {
    const sql = `SELECT name, email, registrationId, status, timestamp FROM participants`;
    db.all(sql, [], async (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error.", error: err.message });
        }

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Registration ID', key: 'registrationId', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Timestamp', key: 'timestamp', width: 25 }
        ];

        rows.forEach(row => {
            worksheet.addRow(row);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'attendance.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    });
});

app.get('/attendees', (req, res) => {
    const sql = `SELECT name, email, status, timestamp FROM participants ORDER BY timestamp DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error.", error: err.message });
        }
        res.status(200).json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});