import { useState, useEffect } from 'react';
import './App.css';

// Đọc URL Backend từ biến môi trường (mặc định trỏ về Render Backend)
const BASE_URL = import.meta.env.VITE_API_URL || 'https://mern-backend-235646.onrender.com';
const API_URL = `${BASE_URL}/api/students`;

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  const [editId, setEditId] = useState(null);

  // Lấy danh sách sinh viên từ Backend API (GET)
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý khi nhập vào ô input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Xử lý gửi Form (Thêm mới POST hoặc Cập nhật PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setEditId(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setFormData({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi thao tác:', err);
    }
  };

  // Đổ dữ liệu lên form để sửa
  const handleEdit = (sv) => {
    setEditId(sv._id);
    setFormData({
      studentId: sv.studentId,
      name: sv.name,
      email: sv.email
    });
  };

  // Xử lý xóa sinh viên qua API DELETE
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (err) {
        console.error('Lỗi xóa sinh viên:', err);
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Quản lý sinh viên - Phiên bản 2.0</h1>

      {/* Form Nhập / Sửa sinh viên */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
        <input
          type="text"
          name="studentId"
          placeholder="MSSV"
          value={formData.studentId}
          onChange={handleChange}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
        />
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: editId ? '#28a745' : '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {editId ? 'Cập nhật' : 'Thêm'}
        </button>
      </form>

      {/* Bảng danh sách sinh viên */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#444' }}>
        <thead>
          <tr style={{ backgroundColor: '#222' }}>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((sv) => (
              <tr key={sv._id}>
                <td>{sv.studentId}</td>
                <td>{sv.name}</td>
                <td>{sv.email}</td>
                <td>
                  <button onClick={() => handleEdit(sv)} style={{ marginRight: '8px', padding: '4px 10px', cursor: 'pointer' }}>
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(sv._id)} style={{ padding: '4px 10px', backgroundColor: '#e11d48', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Chưa có dữ liệu sinh viên</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;