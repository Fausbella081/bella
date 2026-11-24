
// ======================================
// 1. VARIABLES AND ARRAY
// ======================================

const studentForm = document.getElementById("studentForm");

const studentTable = document.getElementById("studentTable");

const searchInput = document.getElementById("searchInput");

let students = JSON.parse(
    localStorage.getItem("students") || "[]"
);


// ======================================
// 2. FUNCTION TO SAVE STUDENT RECORDS
// ======================================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


// ======================================
// 3. FUNCTION TO DISPLAY STUDENTS
// ======================================

function displayStudents(data = students) {

    studentTable.innerHTML = "";

    // Loop through the student array
    for (let i = 0; i < data.length; i++) {

        const student = data[i];

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${i + 1}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <button class="edit-btn" data-action="edit">
                    Edit
                </button>

                <button class="delete-btn" data-action="delete">
                    Delete
                </button>

                <button class="share-btn" data-action="share">
                    Share
                </button>
            </td>
        `;

        // Safely display student information
        const cells = row.querySelectorAll("td");

        const values = [
            student.name,
            student.regNo,
            student.email,
            student.phone,
            student.gender,
            student.department,
            student.level
        ];

        for (let j = 0; j < values.length; j++) {
            cells[j + 1].textContent = values[j];
        }

        // Store student ID in the row
        row.dataset.id = student.id;

        studentTable.appendChild(row);

    }

    // Update total number of students
    document.getElementById("totalStudents").textContent =
        "Total Students: " + students.length;

}


// ======================================
// 4. REGISTER AND UPDATE STUDENT
// ======================================

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get user input
    const editId = document.getElementById("editId").value;

    const name = document.getElementById("studentName").value.trim();

    const regNo = document.getElementById("regNumber").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const gender = document.getElementById("gender").value;

    const department = document.getElementById("department").value.trim();

    const level = document.getElementById("level").value;


    // Check whether registration number already exists
    const duplicate = students.some(function(student) {

        return student.regNo.toLowerCase() === regNo.toLowerCase()
            && student.id !== editId;

    });

    if (duplicate) {

        alert("This registration number already exists!");

        return;

    }


    // Create student object
    const student = {

        id: editId || createStudentId(),

        name: name,

        regNo: regNo,

        email: email,

        phone: phone,

        gender: gender,

        department: department,

        level: level

    };


    // Conditional statement
    if (editId !== "") {

        // Update existing student
        students = students.map(function(oldStudent) {

            if (oldStudent.id === editId) {
                return student;
            }

            return oldStudent;

        });

        alert("Student information updated successfully!");

    } else {

        // Register new student
        students.push(student);

        alert("Student registered successfully!");

    }


    // Save and display records
    saveStudents();

    studentForm.reset();

    resetForm();

    displayStudents();

});


// ======================================
// 5. GENERATE STUDENT ID
// ======================================

function createStudentId() {

    if (crypto.randomUUID) {

        return crypto.randomUUID();

    }

    return "STU-" + Math.floor(Math.random() * 1000000);

}


// ======================================
// 6. UPDATE STUDENT INFORMATION
// ======================================

function editStudent(id) {

    const student = students.find(function(item) {

        return item.id === id;

    });

    if (!student) return;


    // Put existing information into the form
    document.getElementById("editId").value = student.id;

    document.getElementById("studentName").value = student.name;

    document.getElementById("regNumber").value = student.regNo;

    document.getElementById("email").value = student.email;

    document.getElementById("phone").value = student.phone;

    document.getElementById("gender").value = student.gender;

    document.getElementById("department").value = student.department;

    document.getElementById("level").value = student.level;


    // Change form heading and button
    document.getElementById("formTitle").textContent =
        "Update Student Information";

    document.getElementById("submitBtn").textContent =
        "Update Student";

    document.getElementById("cancelBtn").hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================
// 7. DELETE STUDENT
// ======================================

function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {

        students = students.filter(function(student) {

            return student.id !== id;

        });

        saveStudents();

        displayStudents();

        alert("Student deleted successfully!");

    }

}


// ======================================
// 8. SHARE STUDENT INFORMATION
// ======================================

async function shareStudent(id) {

    const student = students.find(function(item) {

        return item.id === id;

    });

    if (!student) return;


    // Prepare information to share
    const studentInfo = `
STUDENT INFORMATION

Name: ${student.name}
Registration Number: ${student.regNo}
Email: ${student.email}
Phone: ${student.phone}
Gender: ${student.gender}
Department: ${student.department}
Level: ${student.level}
faculty:${student.faculty}
`;


    try {

        if (navigator.share) {

            await navigator.share({

                title: "Student Information",

                text: studentInfo

            });

        } else if (navigator.clipboard?.writeText) {

            await navigator.clipboard.writeText(studentInfo);

            alert("Student information copied successfully!");

        } else {

            prompt("Copy student information:", studentInfo);

        }

    } catch (error) {

        if (error.name !== "AbortError") {

            alert("Unable to share student information.");

        }

    }

}


// ======================================
// 9. SEARCH STUDENT
// ======================================

searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase().trim();

    const filteredStudents = students.filter(function(student) {

        return student.name.toLowerCase().includes(searchValue)

            || student.regNo.toLowerCase().includes(searchValue);

    });

    displayStudents(filteredStudents);

});


// ======================================
// 10. DOM TRAVERSAL AND EVENT HANDLING
// ======================================

studentTable.addEventListener("click", function(event) {

    // Find the clicked action button
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    // Move from button to its parent row
    const row = button.parentElement.parentElement;

    // Get student ID from the row
    const id = row.dataset.id;

    // Determine the action
    const action = button.dataset.action;

    if (action === "edit") {

        editStudent(id);

    } else if (action === "delete") {

        deleteStudent(id);

    } else if (action === "share") {

        shareStudent(id);

    }

});


// ======================================
// 11. RESET FORM
// ======================================

function resetForm() {

    document.getElementById("editId").value = "";

    document.getElementById("formTitle").textContent =
        "Register Student";

    document.getElementById("submitBtn").textContent =
        "Register Student";

    document.getElementById("cancelBtn").hidden = true;

}


// Cancel update
document.getElementById("cancelBtn").addEventListener("click", function() {

    studentForm.reset();

    resetForm();

});


// ======================================
// 12. DISPLAY SAVED STUDENTS
// ======================================

displayStudents();
