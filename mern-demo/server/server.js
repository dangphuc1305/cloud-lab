const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Nhập Model Student từ thư mục models (Câu 35)
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas (Câu 33)
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => {
        console.log("=> Kết nối MongoDB Atlas thành công!");
    })
    .catch((error) => {
        console.error("Lỗi kết nối MongoDB Atlas:", error.message);
    });

// API kiểm tra Backend hoạt động
app.get('/api/hello', (req, res) => {
    res.json({ message: "Backend Node.js đang hoạt động tốt!" });
});

// Câu 36: Lấy danh sách tất cả sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Câu 37: Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Câu 38: Cập nhật thông tin sinh viên theo ID
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStudent = await Student.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên để cập nhật" });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Câu 39: Xóa sinh viên theo ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên để xóa" });
        }
        res.status(200).json({ message: "Xóa sinh viên thành công!", student: deletedStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Khởi chạy server lắng nghe kết nối
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
