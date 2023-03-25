/**
 * font-end javascript code
 */

// check to see if jwt_exist=true,meaning user is logged in so hide login and registeer button
if (document.cookie.indexOf("jwt_exist") > -1) {
  document.addEventListener("DOMContentLoaded", async function () {
    const classList = [".login", ".register", ".logout", ".dashbord"];
    classList.forEach((val) => {
      if (val === ".login" || val === ".register") {
        document.querySelector(val).classList.add("hidden");
      } else {
        document.querySelector(val).classList.replace("hidden", "show");
      }
    });
    //get todo list
    var res = await fetch("/todo-list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    var { list, noRecord } = await res.json();
    if (list) {
      await createTable();
      tableBody(list);
    } else if (noRecord) {
      var tablediv = document.querySelector(".table.todo");
      var h1 = document.createElement("span");
      h1.textContent =
        "You've not added any todos yet, its time to seta new one";
      tablediv.appendChild(h1);
    }
  });
}

//sign-in javacript logic
const signIn = function () {
  var form = document.querySelector("form");

  //error fields
  var usernameError = document.querySelector(".error.username");
  var passwordeError = document.querySelector(".error.password");
  var unauthorizedeError = document.querySelector(".error.unauthorized");

  //listen to submit event
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    //get input
    var username = form.username.value;
    var password = form.password.value;
    console.log(username);

    //submit form
    var res = await fetch("/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    var data = await res.json();
    console.log(data);

    if (data.errors) {
      usernameError.textContent = data.errors.username;
      passwordeError.textContent = data.errors.password;

      unauthorizedeError.textContent = data.errors.unauthorized;
    }
    if (data.user) {
      location.assign("/dashbord");
    }
  });
};

//signup javascript logic
const signUp = function () {
  var form = document.querySelector("form");

  //error fields
  var usernameError = document.querySelector(".error.username");
  var passwordeError = document.querySelector(".error.password");
  var tosAgreementError = document.querySelector(".error.tosAgreement");

  //listen to submit event
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    //get input
    var username = form.username.value;
    var password = form.password.value;
    var tosAgreement = form.tosAgreement.checked;

    //submit form
    var res = await fetch("/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, tosAgreement }),
    });
    var data = await res.json();

    if (data.errors) {
      usernameError.textContent = data.errors.username;
      passwordeError.textContent = data.errors.password;
      tosAgreementError.textContent = data.errors.tosAgreement;
    }
    if (data.user) {
      location.assign("/dashbord");
    }
  });
};

// todo -POST
function addTodo() {
  const todoForm = document.querySelector("form");

  // reset error fields
  const fields = ["description", "deadline", "priority", "notes"];
  fields.forEach((field) => {
    document.querySelector(`.error.${field}`).value = "";
  });

  //listen to submit event
  todoForm.addEventListener("submit", async function (e) {
    // prevent form  submit
    e.preventDefault();

    //grab form values
    var todoObject = {};
    fields.forEach((field) => {
      todoObject[field] = todoForm[field].value;
    });

    //submit form
    var res = await fetch("/todo", {
      method: "POST",
      body: JSON.stringify(todoObject),
      headers: { "Content-Type": "application/json" },
    });
    var { errors, duplicate, todo } = await res.json();
    if (errors) {
      console.log(errors);
      fields.forEach((field) => {
        document.querySelector(`.error.${field}`).textContent = errors[field];
      });
    }
    if (duplicate != null) {
      alert(duplicate);
    }
    if (todo) {
      //reset form
      todoForm.reset();
      //close form
      document.querySelector(".btn-close").click();

      var table = document.querySelector(".table.todo>.table");
      console.log(table.childNodes[1]);
      table.removeChild(table.childNodes[1]);
      tableBody(todo);
    }
  });
}

//create todoTable
async function createTable() {
  //get table aread
  const tableDiv = document.querySelector(".table.todo");
  //create table components
  var tableConmponents = ["table", "thead", "tbody", "tr"];
  var tableObject = {};
  tableConmponents.forEach((component) => {
    tableObject[component] = document.createElement(component);
  });
  //append table to table div
  var { table, thead, tbody, tr } = tableObject;
  table.classList.add("table");
  table.appendChild(thead);
  table.appendChild(tbody);
  tbody.classList.add("tbody");
  thead.appendChild(tr);

  //tr columns
  //tr columns
  var columns = ["Description", "Deadline", "Priority", "Notes"];
  columns.forEach((value, index) => {
    if (index >= 0) {
      var col = document.createElement("th");
      col.textContent = value;
      tr.appendChild(col);
    }
  });
  //body colums

  tableDiv.appendChild(table);
}

const tableBody = async function (data) {
  var tbody = document.createElement("tbody");
  data.forEach((todo) => {
    var tr = document.createElement("tr");
    var child = `<td>${todo.description}</td><td>${todo.deadline}</td><td>${todo.priority}</td><td>${todo.notes}</td`;
    tr.innerHTML = child;

    var table = document.querySelector(".table");
    tbody.appendChild(tr);
    table.appendChild(tbody);
  });
};
