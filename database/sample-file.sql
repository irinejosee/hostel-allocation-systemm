-- =========================
-- INSERT STUDENTS
-- =========================
INSERT INTO Student (name, email, phone, gender, course, year_of_study, guardian_name)
VALUES 
('Ananya Sharma', 'ananya@gmail.com', '9876543210', 'Female', 'CSE', 2, 'Raj Sharma'),
('Rahul Verma', 'rahul@gmail.com', '9123456780', 'Male', 'ECE', 3, 'Suresh Verma'),
('Meera Nair', 'meera@gmail.com', '9988776655', 'Female', 'IT', 1, 'Krishna Nair');

-- =========================
-- INSERT ROOMS
-- =========================
INSERT INTO Room (room_number, block, capacity, current_occupancy, room_type)
VALUES
('A101', 'A', 2, 0, 'Double'),
('B201', 'B', 1, 0, 'Single'),
('C301', 'C', 3, 0, 'Triple');

-- =========================
-- INSERT ALLOCATIONS
-- =========================
INSERT INTO Allocation (student_id, room_id, allocation_date, status)
VALUES
(1, 1, CURDATE(), 'Active'),
(2, 2, CURDATE(), 'Active');

-- =========================
-- INSERT PAYMENTS
-- =========================
INSERT INTO Payment (student_id, amount, payment_date, payment_status)
VALUES
(1, 50000, CURDATE(), 'Paid'),
(2, 50000, CURDATE(), 'Pending');
