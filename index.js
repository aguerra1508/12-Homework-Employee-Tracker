//dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');
require("dotenv").config();

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.MYSQLPW,
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
        "Add Employee",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employee Role",
        "Exit"
      ]
    })
    .then(function (answer) {
      // based on their answer, decide function
      if (answer.task === "Add Department") {
        addDepartment();
      } else if (answer.task === "Add Role") {
        addRole();
      } else if (answer.task === "Add Employee") {
        addEmployee();
      } else if (answer.task === "View Departments") {
        viewDepartments();
      } else if (answer.task === "View Roles") {
        viewRoles();
      } else if (answer.task === "View Employees") {
        viewEmployees();
      } else if (answer.task === "Update Employee Role") {
        updateEmployee();
      } else {
        console.log("Goodbye");
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
      connection.query('INSERT INTO department (name) VALUES (?)',
        (answer.department),
        function (err) {
          if (err) throw err;
          console.log(`Added ${answer.department} sucessfully`);
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
      {
        name: "departmentID",
        type: "number",
        message: "What will be the department ID?",
      }
    ])
    .then(function (answer) {
      // insert a new role into the db with that info
      connection.query("INSERT INTO role SET ?", {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentID
        },
        function (err) {
          if (err) throw err;
          console.log(`Added ${answer.title} successfully`)
        })
      // re-prompt the user
      start();
    })
};

// function to handle adding employee
function addEmployee() {
  // prompt for info
  inquirer.prompt([{
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "roleID",
        type: "number",
        message: "What is the employee's role ID?",
      },
      {
        name: "managerID",
        type: "number",
        message: "What is the employee's manager ID?",
      },
    ])
    .then(function (answer) {
      // insert a new employee into the db with that info
      connection.query(
        "INSERT INTO employee SET ?", {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleID,
          manager_id: answer.managerID
        },
        function (err) {
          if (err) throw err;
          console.table(`${answer.firstName} ${answer.lastName} added successfully`);
          start();
        }
      );
    });
}
// function to handle viewing of all depts
function viewDepartments() {
  connection.query("SELECT * FROM department",
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      start();
    });
}
// function to handle viewing of all roles
function viewRoles() {
  connection.query("SELECT * FROM role",
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      start();
    });
}
// function to handle viewing of all employees
function viewEmployees() {
  cconnection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept_name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles ON role_id = roles.id LEFT JOIN departments on roles.dept_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    start();
  });
}
// function to handle updating employee
function updateEmployee() {
  // empty array to hold list
  var employeeList = [];
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name FROM employee",
    function (err, res) {
      // for list to pull up employees in db  
      for (let i = 0; i < res.length; i++) {
        employeeList.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name);
      }
      // prompt for info
      inquirer.prompt([{
          name: "employeeList",
          type: "list",
          message: "Please select an employee to update:",
          choices: employeeList
        },
        {
          name: "newRole",
          type: "input",
          message: "What is the employee's new role?",

        }
      ]).then(function (res) {
        connection.query(`UPDATE employee SET role_id = ${res.newRole} WHERE id = ${res.employeeList}`,
          function (err, res) {
            if (err) throw err;
            console.log(res);
            start();
          });
      });
    });
};

start();