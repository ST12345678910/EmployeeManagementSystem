const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const localDB = require("./db");
require("console.table");
const horizontalLine = '-'.repeat(process.stdout.columns)

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
      message: "---Main Menu---",
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
          value: "ROLE_UPDATE"
        },
        {
          name: "<---QUIT--->",
          value: "QUIT_APP"
        }
      ]
    }
  ]).then(function (res) {
      let choice = res.choice;
      switch (choice) {
        case "QUIT_APP":
          exit();
          break;
        case "ALL_EMPLOYEES":
          displayAllEmployee();
          break;
        case "ALL_EMPLOYEES_BY_DEPARTMENT":
          displayEmployeesbyDepartment();
          break;
        case "EMPLOYEE_ADD":
          newEmployee();
          break;
        case "EMPLOYEE_DELETE":
          deleteEmployee();
          break;
        case "DEPARTMENT_ADD":
          addDepartmentDB();
          break;
        case "DEPARTMENT_DELETE":
          deleteDepartmentDB();
          break;
        case "ROLE_ADD":
          addRoleDB();
          break;
        case "ROLE_DELETE":
          deleteRole();
          break;
        case "ROLE_UPDATE":
          updateRole();
          break;
        default:
          exit();
      }
    })
}

function displayAllEmployee() {
  localDB.loadAllEmployees()
    .then(function ([rows]) {
        let employees = rows;
        console.log("\n");
        console.log(horizontalLine);
        console.table(employees);
        console.log(horizontalLine);
        console.log("\n");
      })
    .then(function () {
        return startPrompts();
      });
}

function displayEmployeesbyDepartment() {
  localDB.loadAllEmployees()
    .then(function ([rows]) {
        let departments = rows;
        const departmentOptions = departments.map(function ({ id, name }) {
            return ({
              name: name,
              value: id
            });
          });

        prompt([
          {
            type: "list",
            name: "searchDepartmentID",
            message: "Select a department to view:",
            choices: departmentOptions
          }
        ])
          .then(function (res) {
            return localDB.loadEmployeesbyDepartment(res.searchDepartmentID);
          })
          .then(function ([rows]) {
            let employees = rows;
            console.log(horizontalLine);
            console.table(employees);
            console.log(horizontalLine);
          })
          .then(function () {
            return startPrompts();
          });
      });
}

function newEmployee() {
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ])
    .then(function (res) {
        let firstName = res.first_name;
        let lastName = res.last_name;

        localDB.loadAllEmployees()
          .then(function ([rows]) {
              let roles = rows;
              const roleChoices = roles.map(function ({ id, title }) {
                return ({
                  name: title,
                  value: id
                });
              });

              prompt({
                type: "list",
                name: "employeeRoleID",
                message: "What is the employee's role?",
                choices: roleChoices
              })
                .then(function (res) {
                    let employeeRoleID = res.employeeRoleID;

                    localDB.loadAllEmployees()
                      .then(function ([rows]) {
                          let employees = rows;
                          const managerOptions = employees.map(function ({ id, first_name, last_name }) {
                            return ({
                              name: `${first_name} ${last_name}`,
                              value: id
                            });
                          });

                          managerOptions.unshift({ name: "None", value: null });

                          prompt({
                            type: "list",
                            name: "managerId",
                            message: "Who is the employee's manager?",
                            choices: managerOptions
                          })
                            .then(function (res) {
                              let employee = {
                                manager_id: res.managerId,
                                role_id: employeeRoleID,
                                first_name: firstName,
                                last_name: lastName
                              };

                              localDB.addEmployeetoDB(employee);
                            })
                            .then(function () {
                              return console.log('\033[4;33mEmployee Added!\033[0m\n');
                            })
                            .then(function () {
                              return startPrompts();
                            });
                        });
                  });
            });
      })
}

function deleteEmployee() {
  localDB.loadAllEmployees()
    .then(function ([rows]) {
        let employees = rows;
        const employeeChoices = employees.map(function ({ id, first_name, last_name }) {
            return ({
              name: `${first_name} ${last_name}`,
              value: id
            });
          });

        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to remove?",
            choices: employeeChoices
          }
        ])
          .then(function (res) {
            return localDB.deleteEmployee(res.employeeId);
          })
          .then(function () {
            return console.log("\033[4;33mEmployee Removed\033[0m\n");
          })
          .then(function () {
            return startPrompts();
          });
      })
}

function addDepartmentDB() {
  prompt([
    {
      name: "name",
      message: "Name the new department:"
    }
  ])
    .then(function (res) {
        let name = res;
        localDB.addDepartmentDB(name)
          .then(function () {
            return console.log(`${name.name} has been added`);
          })
          .then(function () {
            return startPrompts();
          });
      })
}


function deleteDepartmentDB() {
  localDB.loadAllEmployees()
    .then(function ([rows]) {
        let departments = rows;
        const departmentOptions = departments.map(function ({ id, name }) {
            return ({
              name: name,
              value: id
            });
          });

        prompt({
          type: "list",
          name: "delDepartmentID",
          message: "Choose a department to remove:",
          choices: departmentOptions
        })
          .then(function (res) {
              return localDB.deleteDepartmentDB(res.delDepartmentID);
            })
          .then(function () {
            return console.log("\033[4;33mDepartment Removed\033[0m\n");
            })
          .then(function () {
            return startPrompts();
            });
      })
}

function addRoleDB() {
  localDB.loadAllEmployees()
    .then(function ([rows]) {
        let departments = rows;
        const departmentOptions = departments.map(function ({ id, name }) {
            return ({
              name: name,
              value: id
            });
          });

        prompt([
          {
            name: "title",
            message: "Name the role:"
          },
          {
            name: "salary",
            message: "Set a salary for the role:"
          },
          {
            type: "list",
            name: "department_id",
            message: "Select a department for the new role:",
            choices: departmentOptions
          }
        ])
          .then(function (role) {
              localDB.addRoleDB(role)
                .then(function () {
                    return console.log(`${role.title} has been added!`);
                })
                .then(function () {
                    return startPrompts();
                  });
            });
      })}

function deleteRole() {
  localDB.loadAllEmployees()
    .then(function ([rows]) {
        let roles = rows;
        const roleDelOptions = roles.map(function ({ id, title }) {
            return ({
              name: title,
              value: id
            });
          });

        prompt([
          {
            type: "list",
            name: "roleId",
            message: "Choose a role to remove:",
            choices: roleDelOptions
          }
        ])
          .then(function (res) {
              return localDB.deleteRole(res.roleId);
            })
          .then(function () {
            return console.log("\033[4;33mRole Removed\033[0m\n");
            })
          .then(function () {
              return startPrompts();
            });
      })
}

function updateRole() {
  localDB.loadAllEmployees()
    .then(function ([rows]) {
        let employees = rows;
        const employeeOptions = employees.map(function ({ id, first_name, last_name }) {
            return ({
              name: `${first_name} ${last_name}`,
              value: id
            });
          });

        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Choose an employee to update their role:",
            choices: employeeOptions
          }
        ])
          .then(function (res) {
              let employeeId = res.employeeId;
              localDB.loadAllEmployees()
                .then(function ([rows]) {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => {
                      return ({
                        name: title,
                        value: id
                      });
                    });

                    prompt([
                      {
                        type: "list",
                        name: "roleId",
                        message: "Choose a new role for the employee",
                        choices: roleChoices
                      }
                    ])
                      .then(function (res) {
                          return localDB.updateRole(employeeId, res.roleId);
                        })
                      .then(function () {
                        return console.log("\033[4;33mUpdated Employee Role\033[0m\n");
                        })
                      .then(function () {
                          return startPrompts();
                        });});});})
}





function exit() {
  console.log("\n");
  console.log("\033[1;31mThank you for using Employee Management System\033[0m\n");
  console.log("\n");
  process.exit();
}

  
