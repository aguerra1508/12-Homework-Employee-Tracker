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
        viewDepartments();
      } else if (answer.task === "View Roles") {
        viewRoles();
      } else if (answer.task === "View Employees") {
        viewEmployees();
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
// function to handle viewing of all depts
function viewDepartments() {
  connection.query("SELECT department_name FROM department", 
  function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    start();
  });
}
//function to handle viewing of all roles
function viewRoles() {
  connection.query("SELECT title FROM role", 
  function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    start();
  });
}
//function to handle viewing of all employees
function viewEmployees() {
  connection.query("SELECT first_name, last_name FROM employee", 
  function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    start();
  });
}

start();