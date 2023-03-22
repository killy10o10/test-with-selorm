/**
 * base file to Todo Controller
 */

// dependencies

module.exports.dashbord = function (req, res) {
  var data = {};
  data.title = "Todo App - Dashbord";
  

  res.render("dashbord", { data });
};
