//dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "DexterBoo1!",
  database: "employeeDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "task",
      type: "list",
      message: "Would you like to do?",
      choices: [
        "Add Department",
        "Add Role",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employees",
        "Exit"
      ]
    })
    .then(function (answer) {
      // based on their answer, decide function
      if (answer.task === "Add Department") {
        addDepartment();
      } else if (answer.task === "Add Role") {
        addRole();
      } else if (answer.task === "View Departments") {
        console.log("View Departments")
      } else if (answer.task === "View Roles") {
        console.log("View Roles")
      } else if (answer.task === "View Employees") {
        console.log("View Employees")
      } else if (answer.task === "Update Employees") {
        console.log("Update Employees")
      } else {
        connection.end();
      }
    });
}

// function to handle adding department
function addDepartment() {
  // prompt for info
  inquirer
    .prompt([{
      name: "department",
      type: "input",
      message: "What is the name of the department?"
    }])
    .then(function (answer) {
      // insert a new department into the db with that info
      connection.query('INSERT INTO department (department_name) VALUES ?',
        (answer.department),
        function (err) {
          if (err) throw err;
          console.log("Added department sucessfully");
          // re-prompt the user
          start();
        }
      );
    });
}
// function to handle adding role
function addRole() {
  // prompt for info
  inquirer.prompt([{
      name: "title",
      type: "input",
      message: "What title would you like to add?"
    },
    {
      name: "salary",
      type: "number",
      message: "What will be the salary for this title?",
    },
  ]).then(function (answer) {
    connection.query("INSERT INTO role (title, salary) values (?, ?)", 
    (answer.title, answer.salary), 
    function (err) {
      if (err) throw err;
      console.log("Added role successfully")
    })
    start();
  })
};

start();