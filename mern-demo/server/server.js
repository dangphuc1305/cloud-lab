// ====================================================================
// TỆP: server/server.js
// DỰ ÁN: MERN Web API Quản Lý Sinh Viên (Phiên bản v2.0)
// ====================================================================

// 1. KHAI BÁO CÁC THƯ VIỆN CẦN THIẾT
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Khởi tạo ứng dụng Express
const app = express();

// Render tự động cấp phát cổng qua process.env.PORT. Nếu chạy ở local sẽ dùng cổng 5000.
const PORT = process.env.PORT || 5000;

// ====================================================================
// HEALTH CHECK ENDPOINT (Đặt trước CORS để Render kiểm tra không bị chặn)
// ====================================================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} giây`
  });
});

// ====================================================================
// 2. CẤU HÌNH MIDDLEWARE
// ====================================================================

// Danh sách các địa chỉ Frontend được phép gửi yêu cầu tới server
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Chặn bởi cấu hình CORS: Nguồn truy cập không hợp lệ'));
    }
  },
  credentials: true
}));

// Cho phép server đọc và phân tích dữ liệu dạng JSON gửi lên trong body của request
app.use(express.json());

// ====================================================================
// 3. KẾT NỐI CƠ SỞ DỮ LIỆU MONGODB ATLAS
// ====================================================================
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Lỗi: Biến môi trường MONGODB_URI chưa được thiết lập trong tệp .env!');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('=> Kết nối MongoDB Atlas thành công!'))
    .catch((err) => console.error('Lỗi kết nối MongoDB:', err.message));
}

// ====================================================================
// 4. ĐỊNH NGHĨA SCHEMA & MODEL CHO SINH VIÊN
// ====================================================================
const StudentSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: [true, 'Mã số sinh viên là bắt buộc'], 
    unique: true,
    trim: true 
  },
  name: { 
    type: String, 
    required: [true, 'Họ và tên là bắt buộc'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true 
  }
}, { 
  timestamps: true 
});

const Student = mongoose.model('Student', StudentSchema);

// ====================================================================
// 5. CÁC ĐỊNH TUYẾN API (ROUTES)
// ====================================================================

/**
 * @route   GET /api/students
 * @desc    Lấy toàn bộ danh sách sinh viên hiện có
 */
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải danh sách sinh viên', error: error.message });
  }
});

/**
 * @route   POST /api/students
 * @desc    Thêm mới một sinh viên
 */
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ: studentId, name, email' });
    }

    const newStudent = new Student({ studentId, name, email });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mã số sinh viên đã tồn tại trên hệ thống!' });
    }
    res.status(400).json({ message: 'Lỗi khi thêm sinh viên', error: error.message });
  }
});

/**
 * @route   PUT /api/students/:id
 * @desc    Cập nhật thông tin sinh viên theo ID của MongoDB
 */
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên để cập nhật' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật sinh viên', error: error.message });
  }
});

/**
 * @route   DELETE /api/students/:id
 * @desc    Xóa sinh viên khỏi cơ sở dữ liệu theo ID
 */
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên để xóa' });
    }

    res.status(200).json({ message: 'Xóa sinh viên thành công', id });
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi xóa sinh viên', error: error.message });
  }
});

// ====================================================================
// 6. KHỞI CHẠY MÁY CHỦ (SERVER LISTENER)
// ====================================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server đang chạy trên cổng ${PORT} - Phiên bản v2.0`);
});