const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// 1. GET /api/employees & GET /api/employees?search=... (Lấy danh sách & Tìm kiếm theo mã hoặc tên)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error: error.message });
  }
});

// 2. GET /api/employees/:id (Lấy thông tin nhân viên theo ID hoặc mã nhân viên)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let employee = null;
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }

    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin nhân viên' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error: error.message });
  }
});

// 3. POST /api/employees (Thêm nhân viên mới - Kiểm tra bắt buộc & kiểm tra trùng mã)
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;

    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ: Thiếu các trường bắt buộc (employeeId, fullName, email)' 
      });
    }

    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: `Mã nhân viên '${employeeId}' đã tồn tại trong hệ thống` });
    }

    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi thêm nhân viên', error: error.message });
  }
});

// 4. PUT /api/employees/:id (Cập nhật thông tin nhân viên)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let updatedEmployee = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }
    if (!updatedEmployee) {
      updatedEmployee = await Employee.findOneAndUpdate({ employeeId: id }, req.body, { new: true, runValidators: true });
    }

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật' });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật nhân viên', error: error.message });
  }
});

// 5. DELETE /api/employees/:id (Xóa nhân viên)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deletedEmployee = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deletedEmployee = await Employee.findByIdAndDelete(id);
    }
    if (!deletedEmployee) {
      deletedEmployee = await Employee.findOneAndDelete({ employeeId: id });
    }

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên để xóa' });
    }
    res.status(200).json({ message: 'Xóa hồ sơ nhân viên thành công', deletedId: deletedEmployee.employeeId });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa nhân viên', error: error.message });
  }
});

module.exports = router;
