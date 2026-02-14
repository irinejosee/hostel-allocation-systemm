let studentsData = [];

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');

    if (sectionId === 'studentListSection') {
        loadStudents();
    }
}

// =======================
// LOAD STUDENTS
// =======================
function loadStudents() {
    fetch('http://localhost:5000/students')
        .then(res => res.json())
        .then(data => {
            studentsData = data;

            const table = document.getElementById('studentTableBody');
            table.innerHTML = '';

            document.getElementById('studentCount').textContent = data.length;

            data.forEach(student => {
                table.innerHTML += `
                    <tr>
                        <td>${student.student_id}</td>
                        <td>${student.name || ''}</td>
                        <td>${student.email || ''}</td>
                        <td>${student.phone || ''}</td>
                        <td>${student.gender || ''}</td>
                        <td>${student.course || ''}</td>
                        <td>${student.year_of_study || ''}</td>
                        <td>${student.guardian_name || ''}</td>
                        <td>
                            <button onclick="editStudent(${student.student_id})">Edit</button>
                            <button onclick="deleteStudent(${student.student_id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}
function filterStudents() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('studentTableBody');
    table.innerHTML = '';

    const filtered = studentsData.filter(student =>
        student.name.toLowerCase().includes(keyword)
    );

    filtered.forEach(student => {
        table.innerHTML += `
            <tr>
                <td>${student.student_id}</td>
                <td>${student.name || ''}</td>
                <td>${student.email || ''}</td>
                <td>${student.phone || ''}</td>
                <td>${student.gender || ''}</td>
                <td>${student.course || ''}</td>
                <td>${student.year_of_study || ''}</td>
                <td>${student.guardian_name || ''}</td>
                <td>
                    <button onclick="editStudent(${student.student_id})">Edit</button>
                    <button onclick="deleteStudent(${student.student_id})">Delete</button>
                </td>
            </tr>
        `;
    });
}


// =======================
// ADD STUDENT
// =======================
function addStudent() {
    const student = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        course: document.getElementById('course').value,
        year_of_study: document.getElementById('year').value,
        guardian_name: document.getElementById('guardian').value
    };

    fetch('http://localhost:5000/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error || "Unexpected response");
        loadStudents();
    })
    .catch(err => {
        console.error(err);
        alert("Failed to add student.");
    });
}

// =======================
// DELETE STUDENT
// =======================
function deleteStudent(id) {
    fetch(`http://localhost:5000/students/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error || "Unexpected response");
        loadStudents();
    })
    .catch(err => {
        console.error(err);
        alert("Failed to delete student.");
    });
}

// =======================
// EDIT STUDENT
// =======================
function editStudent(id) {
    fetch('http://localhost:5000/students')
        .then(res => res.json())
        .then(data => {
            const student = data.find(s => s.student_id === id);

            document.getElementById('name').value = student.name || '';
            document.getElementById('email').value = student.email || '';
            document.getElementById('phone').value = student.phone || '';
            document.getElementById('gender').value = student.gender || '';
            document.getElementById('course').value = student.course || '';
            document.getElementById('year').value = student.year_of_study || '';
            document.getElementById('guardian').value = student.guardian_name || '';

            const btn = document.getElementById('addStudentBtn');
            btn.textContent = "Update Student";
            btn.onclick = function () {
                updateStudent(id);
            };

            showSection('studentsSection');
        });
}

// =======================
// UPDATE STUDENT
// =======================
function updateStudent(id) {
    const student = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        course: document.getElementById('course').value,
        year_of_study: document.getElementById('year').value,
        guardian_name: document.getElementById('guardian').value
    };

    fetch(`http://localhost:5000/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error || "Unexpected response");

        const btn = document.getElementById('addStudentBtn');
        btn.textContent = "Add Student";
        btn.onclick = addStudent;

        loadStudents();
    })
    .catch(err => {
        console.error(err);
        alert("Failed to update student.");
    });
}
