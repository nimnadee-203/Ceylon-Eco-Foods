const Employee = require("../Model/EmployeeModel");

// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json({ employees });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add new employee
exports.addEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body); // password සමඟ save වෙනවා
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        res.json(employee); // password සමඟ return වෙයි
    } catch (err) {
        res.status(404).json({ message: "Employee not found" });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        // Check if email is being changed and if it already exists for another employee
        if (req.body.email && req.body.email !== employee.email) {
            const existingEmployee = await Employee.findOne({ email: req.body.email });
            if (existingEmployee) {
                return res.status(400).json({ message: "Email already exists for another employee" });
            }
        }

        // Update fields only if they are provided
        if (req.body.name) employee.name = req.body.name;
        if (req.body.email) employee.email = req.body.email;
        if (req.body.phone) employee.phone = req.body.phone;
        if (req.body.position) employee.position = req.body.position;
        if (req.body.department) employee.department = req.body.department;
        if (req.body.password) employee.password = req.body.password;

        const updatedEmployee = await employee.save();
        res.json({ message: "Employee updated successfully", employee: updatedEmployee });
    } catch (err) {
        console.error("Update error:", err);
        res.status(400).json({ message: err.message });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Employee not found" });
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Employee Login
exports.loginEmployee = async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(400).json({ message: "Employee not found" });
        }

        // Compare plain text password (⚠️ better use bcrypt in production)
        if (employee.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Login success → return employee details
        res.json({ 
            message: "Login successful", 
            employee 
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
