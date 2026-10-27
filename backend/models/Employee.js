const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { 
      type: String, 
      required: [true, 'Mã nhân viên là bắt buộc'], 
      unique: true,
      trim: true 
    },
    fullName: { 
      type: String, 
      required: [true, 'Họ và tên nhân viên là bắt buộc'],
      trim: true 
    },
    gender: { type: String, default: 'Nam' },
    dateOfBirth: { type: String },
    department: { type: String, default: 'Chưa phân công' },
    position: { type: String, default: 'Nhân viên' },
    email: { 
      type: String, 
      required: [true, 'Email là bắt buộc'],
      trim: true,
      lowercase: true 
    },
    phone: { type: String },
    hireDate: { type: String },
    status: { type: String, default: 'Chính thức' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema, 'employees');
