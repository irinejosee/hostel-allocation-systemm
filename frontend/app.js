function loadStudents() {
    fetch('http://localhost:5000/students')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('studentList');
            const select = document.getElementById('studentSelect');
            list.innerHTML = '';
            select.innerHTML = '';

            data.forEach(student => {
                const li = document.createElement('li');
                li.textContent = student.name;
                list.appendChild(li);

                const option = document.createElement('option');
                option.value = student.student_id;
                option.textContent = student.name;
                select.appendChild(option);
            });
        });
}

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
    .then(() => loadStudents());
}

function loadRooms() {
    fetch('http://localhost:5000/rooms')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('roomList');
            const select = document.getElementById('roomSelect');
            list.innerHTML = '';
            select.innerHTML = '';

            data.forEach(room => {
                const li = document.createElement('li');
                li.textContent = room.room_number + " (" + room.current_occupancy + "/" + room.capacity + ")";
                list.appendChild(li);

                const option = document.createElement('option');
                option.value = room.room_id;
                option.textContent = room.room_number + " (" + room.current_occupancy + "/" + room.capacity + ")";
                select.appendChild(option);
            });
        });
}

function addRoom() {
    const room = {
        room_number: document.getElementById('roomNumber').value,
        block: document.getElementById('block').value,
        capacity: document.getElementById('capacity').value,
        room_type: document.getElementById('roomType').value
    };

    fetch('http://localhost:5000/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room)
    })
    .then(res => res.json())
    .then(() => loadRooms());
}

function allocateRoom() {
    const allocation = {
        student_id: document.getElementById('studentSelect').value,
        room_id: document.getElementById('roomSelect').value
    };

    fetch('http://localhost:5000/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocation)
    })
    .then(res => res.json())
    .then(() => {
        loadAllocations();
        loadRooms();
    });
}

function loadAllocations() {
    fetch('http://localhost:5000/allocations')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('allocationList');
            list.innerHTML = '';

            data.forEach(allocation => {
                const li = document.createElement('li');
                li.textContent = allocation.name + " → Room " + allocation.room_number;
                list.appendChild(li);
            });
        });
}

window.onload = function () {
    loadStudents();
    loadRooms();
    loadAllocations();
};
