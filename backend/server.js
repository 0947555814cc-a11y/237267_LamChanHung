const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Yêu cầu 13: Endpoint kiểm tra trạng thái hoạt động (Health check)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Backend API đang hoạt động bình thường',
    timestamp: new Date()
  });
});

app.get('/', (req, res) => {
  res.status(200).send('API Quản lý Nhân sự (HR Management System) đang chạy');
});

// Các tuyến đường API chính
app.use('/api/employees', employeeRoutes);

// Kết nối MongoDB Cloud
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Đã kết nối thành công tới MongoDB Atlas!');
    app.listen(PORT, () => console.log(`Backend Server đang chạy ở cổng ${PORT}`));
  })
  .catch((err) => console.error('Lỗi kết nối MongoDB Atlas:', err));
