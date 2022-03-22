const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
// const db = require("db");
require("console.table");

start();

function start() {

  console.log(
    logo({
      name: 'Employee Management System',
      font: 'ANSI Shadow',
      lineChars: 1,
      borderColor: 'magenta',
      logoColor: 'bold-green',
      textColor: 'green',
    })
      .emptyLine()
      .right('version 1.0')
      .emptyLine()
      .render()
  );

  startPrompts();
}

function startPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "--Main Menu--",
      choices: [
        {
          name: "View all employees",
          value: "ALL_EMPLOYEES"
        },
        {
          name: "View employees by department",
          value: "ALL_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View employees by role",
          value: "EMPLOYEES_BY_ROLE"
        },
        {
          name: "Add employee",
          value: "EMPLOYEE_ADD"
        },
        {
          name: "Delete employee",
          value: "EMPLOYEE_DELETE"
        },
        {
          name: "Add department",
          value: "DEPARTMENT_ADD"
        },
        {
          name: "Delete department",
          value: "DEPARTMENT_DELETE"
        },
        {
          name: "Add role",
          value: "ROLE_ADD"
        },
        {
          name: "Delete role",
          value: "ROLE_DELETE"
        },
        {
          name: "Update employee role",
          value: "ROLE_DELETE"
        },
      ]
    }
  ]).then(res => {
    let choice = res.choice;
    // Call the appropriate function depending on what the user chose
    switch (choice) {
      case "ALL_EMPLOYEES":
        displayAllEmployee();
        break;
      case "ALL_EMPLOYEES_BY_DEPARTMENT":
        displayEmployeesbyDepartment();
        break;
      default:
        exit();
    }
  }
  )
}


function exit() {
  console.log("Thank you for using Employee Management System");
  process.exit();
}

  