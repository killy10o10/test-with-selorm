/**
 * base file to Todo Controller
 */

// dependencies

const Todo = require("../models/Todo");

module.exports.dashbord = async function (req, res) {
  var data = {};
  data.title = "Todo App - Dashbord";
  if (!req.session) {
    res.redirect("/logout");
  }
  data.head = `Welcome  - (${req.session.user.username}) - My Todo List`;
  data.todo = await Todo.findAll({where:{UserId:req.session.user.id},
    attributes: ["description", "deadline", "priority", "notes"],
  });
  res.render("dashbord", { data });
};

module.exports.post = async function (req, res) {
  var todoObject = ({ description, deadline, priority, notes } = req.body);

  //validate todo fields
  todoObject.description =
    typeof todoObject.description == "string" &&
    todoObject.description.trim().length > 0
      ? todoObject.description.trim()
      : {
          error:
            "description filed is required and should not exceed 255 characters",
        };

  todoObject.deadline =
    typeof todoObject.deadline == "string" &&
    todoObject.deadline.trim().length > 0
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
  var errorCount = 0;
  Object.keys(todoObject).forEach((val) => {
    if (typeof todoObject[val] == "object") {
      errors[val] = todoObject[val]["error"];
      errorCount = errorCount + 1;
    }
  });
  if (errorCount > 0) {
    console.log(errors);
    res.status(403).json({ errors: errors });
  } else {
    //proceed  to persist data to db
    todoObject.UserId = req.session.user.id;
    //persist data to db
    try {
      await Todo.create(todoObject);
      res.status(201).json({ todo: "todo added" });
    } catch (err) {
      res.status(500).json({
        duplicate: "You have existing todo with same description",
      });
    }
  }
};

module.exports.todo_list = async function (req, res) {
  var todoList = await Todo.findAll({
    attributes: ["description", "deadline", "priority", "notes"],
  });
  res.status(200).json(todoList);
};
