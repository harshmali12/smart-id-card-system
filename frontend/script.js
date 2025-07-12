// ✅ Base API URL
const API_BASE_URL = "http://localhost:5002/api";

// ✅ Ensure the script runs only after the page loads
document.addEventListener("DOMContentLoaded", function () {
    loadStudents(); // Fetch and display students after the page loads
    loadAttendanceLogs(); // Fetch and display attendance logs
});

// ✅ Admin Login Function
window.adminLogin = async function () {
    let email = document.getElementById("admin-email").value;
    let password = document.getElementById("admin-password").value;
    let loginMessage = document.getElementById("login-message");

    if (!email || !password) {
        loginMessage.textContent = "Please enter email and password.";
        loginMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            loginMessage.textContent = "Login Successful!";
            loginMessage.style.color = "green";
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
        } else {
            loginMessage.textContent = result.error || "Invalid email or password.";
            loginMessage.style.color = "red";
        }
    } catch (error) {
        console.error("Login Error:", error);
        loginMessage.textContent = "Error logging in.";
        loginMessage.style.color = "red";
    }
};

// ✅ Logout Function
window.logout = function () {
    localStorage.removeItem("authToken"); // Remove stored session token
    window.location.href = "index.html"; // Redirect to login page
};

// ✅ Fetch and Display Student List
async function loadStudents() {
    let studentsTableBody = document.getElementById("students-table-body");

    if (!studentsTableBody) {
        console.error("Error: Student table not found in DOM.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            console.error("Server returned an error:", response.status);
            return;
        }

        const students = await response.json();
        studentsTableBody.innerHTML = ""; // Clear previous entries

        if (students.length === 0) {
            studentsTableBody.innerHTML = `<tr><td colspan="5">No students found.</td></tr>`;
            return;
        }

        students.forEach((student) => {
            let row = `<tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.rfidUID}</td>
                <td>${student.fingerprintID}</td>
                <td><button onclick="deleteStudent(${student.id})">Delete</button></td>
            </tr>`;
            studentsTableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading students:", error);
    }
}

// ✅ Add New Student
window.addStudent = async function () {
    let studentName = document.getElementById("student-name").value;
    let rfidId = document.getElementById("rfid-id").value;
    let fingerprintId = document.getElementById("fingerprint-id").value;
    let formMessage = document.getElementById("form-message");

    if (!studentName || !rfidId || !fingerprintId) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: studentName, rfidUID: rfidId, fingerprintHash: fingerprintId })
        });

        const result = await response.json();
        if (response.ok) {
            formMessage.textContent = "Student added successfully!";
            formMessage.style.color = "green";
            document.getElementById("student-name").value = "";
            document.getElementById("rfid-id").value = "";
            document.getElementById("fingerprint-id").value = "";
            
            setTimeout(loadStudents, 500); // Reload student list after adding
        } else {
            formMessage.textContent = result.error || "Failed to add student.";
            formMessage.style.color = "red";
        }
    } catch (error) {
        console.error("Error adding student:", error);
        formMessage.textContent = "Server error.";
        formMessage.style.color = "red";
    }
};

// ✅ Delete Student
window.deleteStudent = async function (studentId) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, { method: "DELETE" });

        if (response.ok) {
            alert("Student deleted successfully!");
            loadStudents(); // Refresh the list
        } else {
            alert("Failed to delete student.");
        }
    } catch (error) {
        console.error("Error deleting student:", error);
    }
};

// ✅ Fetch and Display Attendance Data
async function loadAttendanceLogs() {
    let attendanceTableBody = document.getElementById("attendance-table-body");

    if (!attendanceTableBody) {
        console.error("Error: Attendance table not found in DOM.");
        return; // Prevent script from crashing
    }

    try {
        const response = await fetch(`${API_BASE_URL}/attendance`);
        if (!response.ok) {
            console.error("Server returned an error:", response.status);
            return;
        }

        const attendanceData = await response.json();
        attendanceTableBody.innerHTML = ""; // Clear previous records

        if (attendanceData.length === 0) {
            attendanceTableBody.innerHTML = `<tr><td colspan="4">No attendance records found.</td></tr>`;
            return;
        }

        attendanceData.forEach((log) => {
            let row = `<tr>
                <td>${log.id}</td>
                <td>${log.userID}</td>
                <td>${log.rfidUID}</td>
                <td>${log.timestamp}</td>
            </tr>`;
            attendanceTableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading attendance records:", error);
    }
}
app.get("/api/students", async (req, res) => {
    try {
        const [students] = await db.promise().query("SELECT * FROM users"); // Ensure the correct table name
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// ✅ Run functions when the page loads
document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
    loadAttendanceLogs();
});
