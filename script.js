let students = [];
let mentors = [];
let selectionList = [];
let selectedMentor;
let assignThisStudent;
document.getElementById('studentForm').style.display = 'none';
document.getElementById('mentorForm').style.display = 'none';


async function addStudent() {
    let data = {
        name: document.getElementById("studentName").value,
        id: document.getElementById("studentId").value,
        contact: document.getElementById("studentContact").value,
        email: document.getElementById("studentEmail").value,
        batch: document.getElementById("studentBatch").value,
        mentorAssigned: false,
        mentorName: "Not Assigned"
    };
    await fetch("https://student-mentor-assign-backend.herokuapp.com/student", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    alert("Student Added Successfully!");
    document.getElementById('studentForm').reset();
    
}

async function addMentor() {
    let data = {
        name: document.getElementById("mentorName").value,
        id: document.getElementById("mentorId").value,
        contact: document.getElementById("mentorContact").value,
        email: document.getElementById("mentorEmail").value,
        students: []
    }
    await fetch("https://student-mentor-assign-backend.herokuapp.com/mentor", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    alert("Mentor Added Successfully!");
}


async function assignStudents() {
    let data = {
        mentor: selectedMentor,
        studentName: assignThisStudent
    }
    await fetch('https://student-mentor-assign-backend.herokuapp.com/mentor/addStudent', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function fetchMentors() {
    let response = await fetch("https://student-mentor-assign-backend.herokuapp.com/mentor");
    let list = await response.json();
    list.forEach(element => {
        mentors.push(element)
    })
}

async function fetchStudents() {
    let response = await fetch("https://student-mentor-assign-backend.herokuapp.com/student");
    let list = await response.json();
    list.forEach(element => {
        students.push(element);
    });
}

let field = document.getElementById('chooseField');
let ul = document.createElement('ul');

async function selectStudents() {
    document.getElementById('chooseField').style.display = 'grid';
    let counter = 1;
    await fetchStudents();
    selectionList = students;
    students = [];
    ul.id = `${selectedMentor}`;
    field.appendChild(ul);
    let info = document.getElementById('info');
    info.innerHTML = ``;
    info.innerHTML = `Assigining Students under ${selectedMentor}`
    selectionList.forEach(element => {
        if (element.mentorAssigned === false) {
            console.log(element.name)
            if (counter === 1) {
                ul.innerHTML = ``
            }
            counter = 0;
            let li = document.createElement('li');
            let b = document.createElement('button');
            b.classList.add('btn', 'btn-dark')
            //write what happens if clicked 
            b.innerHTML = element.name;

            li.appendChild(b);
            ul.appendChild(li);

            b.addEventListener('click', async function(){
              let confirmation =   confirm("This action cannot be reverted..!");
              if(confirmation)
              {
                  assignThisStudent = element.name;
                  b.disabled = 'true';
                  b.innerHTML = b.innerHTML + ` __Assigned`;
                 await assignStudents();
                 alert('Student Assigned Succesfully !');
              }
              else{
                  alert('Action aborted');
              }
            })
        }
    });
}

async function displaystudentsList() {
    await fetchStudents();

    if (students.length !== 0) {

        document.getElementById('mentorForm').style.display = 'none';
        document.getElementById('studentForm').style.display = 'none';
        document.getElementById('chooseField').style.display = 'none';
        let display = document.querySelector(".listArea");
        display.innerHTML = "";
        students.forEach(element => {
            let card = document.createElement('div');
            card.classList.add('card', 'bg-transparent', "col");
            card.innerHTML = `Student Name : ${element.name} <br> Id : ${element.id} <br> Contact Number : ${element.contact} <br> Email : ${element.email} <br> Batch : ${element.batch}`;
            display.appendChild(card);
        });
        document.querySelector(".listArea").style.display = 'grid'
        students = [];
    }
    else {
        alert("Collection is Empty.. No student found");
    }
}



let display = document.querySelector(".listArea");
async function displayMentorsList() {
    await fetchMentors();
    display.innerHTML = "";
    if (mentors.length !== 0) {
        document.getElementById('mentorForm').style.display = 'none';
        document.getElementById('studentForm').style.display = 'none';
        document.getElementById('chooseField').style.display = 'none';
        mentors.forEach(element => {
            let card = document.createElement('div');
            card.classList.add('card', 'bg-transparent', "col");
            card.innerHTML = `Mentor Name : ${element.name} <br> Id : ${element.id} <br> Contact Number : ${element.contact} <br> Email : ${element.email}`;

            let button = document.createElement('button');
            button.classList.add('btn', 'btn-primary' /* 'assign-button' */);
            button.innerHTML = `Assign new students`;
            button.id = `${element.name}`;
            button.addEventListener('click', () => {
                selectedMentor = `${element.name}`;
                selectStudents();
            })

            card.appendChild(button);
            display.appendChild(card);
            mentors = [];
        });
        document.querySelector(".listArea").style.display = 'grid'
        students = [];
    }
    else {
        alert("Collection is Empty.. No Mentor found ");
    }
}

async function displayMentorsListWithStudents(){
    await fetchMentors();
    display.innerHTML = "";
  

    if (mentors.length !== 0) {
        document.getElementById('mentorForm').style.display = 'none';
        document.getElementById('studentForm').style.display = 'none';
        document.getElementById('chooseField').style.display = 'none';
        mentors.forEach(element => {
            let card = document.createElement('div');
            card.classList.add('card', 'bg-transparent', "col");
            card.innerHTML = ` <h1> <u> ${element.name} </u> </h1> <br>`;

            let ol = document.createElement('ol');
            (element.studentList).forEach(item => {
                let li = document.createElement('li');
                li.innerHTML = `${item}`;
                ol.appendChild(li);
            });

            card.appendChild(ol);
            display.appendChild(card);
            mentors = [];
        });
        document.querySelector(".listArea").style.display = 'grid'
        students = [];
    }
    else {
        alert("Collection is Empty.. No Mentor found ");
    }
  
  
    
    mentors = [];
}

function displayStudentForm() {
    document.querySelector(".listArea").style.display = 'none'
    document.getElementById('mentorForm').style.display = 'none';
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('chooseField').style.display = 'none';
}

function displayMentorForm() {
    document.querySelector(".listArea").style.display = 'none'
    document.getElementById('mentorForm').style.display = 'block';
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('chooseField').style.display = 'none';
}
