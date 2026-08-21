const mongoose = require('mongoose');

// Định nghĩa cấu trúc Schema cho sinh viên
const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: [true, 'Vui lòng nhập mã sinh viên'],
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Vui lòng nhập họ tên sinh viên'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Vui lòng nhập địa chỉ email'],
            trim: true
        }
    },
    {
        timestamps: true // Tự động thêm createdAt và updatedAt
    }
);

// Khởi tạo Model Student liên kết với collection 'students'
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;