/**
 * font-end javascript code
 */

// check to see if jwt_exist=true,meaning user is logged in so hide login and registeer button
if (document.cookie.indexOf("jwt_exist") > -1) {
  const classList = [".login", ".register", ".logout", ".dashbord"];
  classList.forEach((val) => {
    if (val === ".login" || val === ".register") {
      document.querySelector(val).classList.add("hidden");
    } else {
      document.querySelector(val).classList.remove("hidden");
    }
  });
}

//redirect user to dashbord when the are logged in
if (document.cookie.indexOf("jwt_exist") > -1) {
  location.assign("/dashbord");
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
      console.log(data.errors.unauthorized);
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
