/* Seeds for SQL table */
USE employeeDB;

INSERT INTO department (name)
VALUES 
("Sales"),
("Engineering"),
("Legal"),
("Finance");


INSERT INTO role (title, salary, department_id)
VALUES 
("Sales Lead","60000",1),
("Salesperson","50000",1),
("Lead Engineer","100000",2),
("Sofware Engineer","80000",2),
("Lawyer","90000",3),
("Legal Assistant", "40000",3),
("Accountant","70000",4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("John","Doe", 1, null),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 3, null),
("Kevin", "Tupik", 4, 3),
("Malia", "Brown", 5, null),
("Sarah", "Lourd", 6, 5),
("Tom", "Allen", 7, null);