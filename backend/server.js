const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlmaggie@1234', // 🔴 REPLACE THIS
    database: 'hostel_allocation'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// ================= BASIC ROUTE =================
app.get('/', (req, res) => {
    res.send('Hostel Allocation API Running');
});

// ================= STUDENTS =================
app.get('/students', (req, res) => {
    db.query('SELECT * FROM student', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/students', (req, res) => {
    const { name, email, phone, gender, course, year_of_study, guardian_name } = req.body;

    const sql = `
        INSERT INTO student 
        (name, email, phone, gender, course, year_of_study, guardian_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, phone, gender, course, year_of_study, guardian_name], 
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Student added successfully' });
        }
    );
});

// ================= ROOMS =================
app.get('/rooms', (req, res) => {
    db.query('SELECT * FROM room', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/rooms', (req, res) => {
    const { room_number, block, capacity, room_type } = req.body;

    const sql = `
        INSERT INTO room 
        (room_number, block, capacity, room_type)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [room_number, block, capacity, room_type],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Room added successfully' });
        }
    );
});

// ================= ALLOCATIONS =================
app.post('/allocate', (req, res) => {
    const { student_id, room_id } = req.body;

    const checkRoom = `
        SELECT capacity, current_occupancy 
        FROM room 
        WHERE room_id = ?
    `;

    db.query(checkRoom, [room_id], (err, roomResult) => {
        if (err) return res.status(500).send(err);

        const room = roomResult[0];

        if (!room) return res.status(400).json({ message: 'Room not found' });

        if (room.current_occupancy >= room.capacity) {
            return res.status(400).json({ message: 'Room is full' });
        }

        const insertAllocation = `
            INSERT INTO allocation 
            (student_id, room_id, allocation_date)
            VALUES (?, ?, CURDATE())
        `;

        db.query(insertAllocation, [student_id, room_id], (err, result) => {
            if (err) return res.status(500).send(err);

            const updateRoom = `
                UPDATE room 
                SET current_occupancy = current_occupancy + 1
                WHERE room_id = ?
            `;

            db.query(updateRoom, [room_id]);

            res.json({ message: 'Room allocated successfully' });
        });
    });
});

app.get('/allocations', (req, res) => {
    const sql = `
        SELECT s.name, r.room_number, r.block, a.allocation_date
        FROM allocation a
        JOIN student s ON a.student_id = s.student_id
        JOIN room r ON a.room_id = r.room_id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ================= START SERVER =================
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
