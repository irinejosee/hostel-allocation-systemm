-- =====================================================
-- HOSTEL ALLOCATION SYSTEM - COMPLETE DATABASE SCHEMA
-- =====================================================

-- Drop tables if they already exist (for clean re-run)
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Allocation;
DROP TABLE IF EXISTS Room;
DROP TABLE IF EXISTS Student;

-- =========================
-- 1. STUDENT TABLE
-- =========================
CREATE TABLE Student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    course VARCHAR(100),
    year_of_study INT,
    guardian_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. ROOM TABLE
-- =========================
CREATE TABLE Room (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    block VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    room_type ENUM('Single', 'Double', 'Triple') NOT NULL
);

-- =========================
-- 3. ALLOCATION TABLE
-- =========================
CREATE TABLE Allocation (
    allocation_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    room_id INT NOT NULL,
    allocation_date DATE NOT NULL,
    status ENUM('Active', 'Completed') DEFAULT 'Active',

    CONSTRAINT fk_student
        FOREIGN KEY (student_id)
        REFERENCES Student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_room
        FOREIGN KEY (room_id)
        REFERENCES Room(room_id)
        ON DELETE CASCADE
);

-- =========================
-- 4. PAYMENT TABLE
-- =========================
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',

    CONSTRAINT fk_payment_student
        FOREIGN KEY (student_id)
        REFERENCES Student(student_id)
        ON DELETE CASCADE
);

-- =========================
-- 5. INDEXES (Performance)
-- =========================
CREATE INDEX idx_student_name ON Student(name);
CREATE INDEX idx_room_number ON Room(room_number);
CREATE INDEX idx_payment_status ON Payment(payment_status);

-- =========================
-- 6. VIEW (DDL Object)
-- =========================
CREATE OR REPLACE VIEW Active_Allocations AS
SELECT 
    s.name AS student_name,
    r.room_number,
    r.block,
    a.allocation_date
FROM Allocation a
JOIN Student s ON a.student_id = s.student_id
JOIN Room r ON a.room_id = r.room_id
WHERE a.status = 'Active';
