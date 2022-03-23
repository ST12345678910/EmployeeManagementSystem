const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }


  loadAllEmployees() {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  loadEmployeesbyDepartment(searchDepartmentID) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
      searchDepartmentID
    );
  }

  addEmployeetoDB(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee);
  }

  deleteEmployee(employeeId) {
    return this.connection.promise().query(
      "DELETE FROM employee WHERE id = ?",
      employeeId
    );
  }

  addDepartmentDB(department) {
    return this.connection.promise().query("INSERT INTO department SET ?", department);
  }

  deleteDepartmentDB(delDepartmentId) {
    return this.connection.promise().query(
      "DELETE FROM department WHERE id = ?",
      delDepartmentId
    );
  }

  addRoleDB(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
  }

  deleteRoleDB(roleId) {
    return this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
  }

  updateRole(employeeId, roleId) {
    return this.connection.promise().query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }





}

  




module.exports = new DB(connection);