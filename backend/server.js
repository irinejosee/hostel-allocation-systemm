const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlmaggie@1234',  // <-- CHANGE THIS
    database: 'hostel_allocation'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// =======================
// GET ALL STUDENTS
// =======================
app.get('/students', (req, res) => {
    db.query('SELECT * FROM student', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// =======================
// ADD STUDENT
// =======================
 
app.post('/students', (req, res) => {
    const { name, email, phone, gender, course, year_of_study, guardian_name } = req.body;

    const query = `
        INSERT INTO student 
        (name, email, phone, gender, course, year_of_study, guardian_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query,
        [name, email, phone, gender, course, year_of_study || null, guardian_name || null],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Student added successfully" });
        });
});


// =======================
// DELETE STUDENT
// =======================
app.delete('/students/:id', (req, res) => {
    db.query(
        'DELETE FROM student WHERE student_id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err });

            res.json({ message: "Student deleted successfully" });
        }
    );
});

// =======================
// UPDATE STUDENT
// =======================
// UPDATE STUDENT
app.put('/students/:id', (req, res) => {
    const { name, email, phone, gender, course, year_of_study, guardian_name } = req.body;

    const query = `
        UPDATE student
        SET name=?, email=?, phone=?, gender=?, course=?, year_of_study=?, guardian_name=?
        WHERE student_id=?
    `;

    db.query(query,
        [name, email, phone, gender, course, year_of_study || null, guardian_name || null, req.params.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Student updated successfully" });
        });
});


// =======================

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
