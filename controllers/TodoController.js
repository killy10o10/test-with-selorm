/**
 * base file to Todo Controller
 */

// dependencies

module.exports.dashbord = function (req, res) {
  var data = {};
  data.title = "Todo App - Dashbord";
  data.username =req.session.user.username;
  data.head = `Welcome  - (${data.username}) - My Todo List`
  res.render("dashbord", { data });
};


module.exports.post = async function (req, res) {
  console.log()
  var todoObject = ({ description, deadline, priority, notes } = req.body.Todo);
  console.log(todoObject)
  //validate todo fields
  todoObject.description =
    typeof todoObject.description == "string" &&
    todoObject.description.trim().length <= 255
      ? todoObject.description.trim()
      : {
          error:
            "description fileed is required and should not exceed 255 characteers",
        };

  todoObject.deadline =
    typeof todoObject.deadline == "string"
      ? todoObject.deadline.trim()
      : { error: "deadline is required" };

  (todoObject.priority == typeof todoObject.priority) == "string" &&
  ["high", "medium", "low"].indexOf(todoObject.priority) > -1
    ? todoObject.priority.trim()
    : { error: "priority is required" };

  todoObject.notes =
    typeof todoObject.notes == "string" ? todoObject.notes : "";

  // check for errors
  var errors = {};
  Object.keys((val) => {
    if (typeof todoObject.val == "object") {
      errors[val] = todoObject["error"];
    }
  });
  if (errors == null) {
    res.status(403).json({ data: { errors } });
  } else {
    //proceed  to persist data to db
    todoObject.user_id = req.session.user.id
    console.log(todoObject)
  }
};