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

connection.connect(function(err) {
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
      choices: 
      [
        "Add Department", 
        "Add Role",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employees",
        "Exit"
      ]
    })
    .then(function(answer) {
      // based on their answer, decide function
      if (answer.task === "Add Department") {
        addDepartment();
      }
      else if(answer.task === "Add Role") {
        console.log("Add Role")
      } 
      else if(answer.task === "View Departments") {
        console.log("View Departments")
      }      
      else if(answer.task === "View Roles") {
        console.log("View Roles")
      }
      else if(answer.task === "View Employees") {
        console.log("View Employees")
      }
      else if(answer.task === "Update Employees") {
        console.log("Update Employees")
      }
      else{
        connection.end();
      }
    });
}

// function to handle adding department
function addDepartment() {
  // prompt for info
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the name of the department?"
      }
    ])
    .then(function(answer) {
      // insert a new department into the db with that info
      connection.query('INSERT INTO department (name) VALUES ?', 
      [answer.department], 
      function(err){
          if (err) throw err;
          console.log("Added department sucessfully");
          // re-prompt the user
          start();
        }
      );
    });
  }

/*function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}*/
start();