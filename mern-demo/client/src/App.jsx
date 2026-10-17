// client/src/App.jsx
import React, { useState, useEffect } from 'react';

function App() {
  // 1. Quản lý trạng thái (State) của ứng dụng
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Địa chỉ Backend lấy từ biến môi trường của Vite, nếu không có sẽ dùng cổng mặc định 5000
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 2. Hàm gọi API lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/students`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách sinh viên từ máy chủ.');
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi fetchStudents:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Tự động tải dữ liệu khi trang vừa mở
  useEffect(() => {
    fetchStudents();
  }, []);

  // 3. Hàm xử lý khi người dùng nhập dữ liệu vào ô input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 4. Hàm xử lý gửi form thêm sinh viên mới (Phục vụ Câu 55)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Thêm sinh viên ${result.name} thành công!` });
        // Xóa trắng form nhập
        setFormData({ studentId: '', name: '', email: '' });
        // Tải lại danh sách mới nhất
        fetchStudents();
      } else {
        setMessage({ type: 'error', text: result.message || 'Thao tác thêm thất bại.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Mất kết nối tới máy chủ Backend.' });
    }
  };

  // 5. Hàm xóa sinh viên
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;

    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Đã xóa sinh viên thành công!' });
        fetchStudents();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi khi xóa sinh viên.' });
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '30px auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', padding: '0 20px' }}>
      
      {/* HEADER HIỂN THỊ PHIÊN BẢN v2.0 (CÂU 45) */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '2px solid #007bff', 
        paddingBottom: '16px' 
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Quản Lý Sinh Viên</h2>
        
        {/* Huy hiệu phiên bản v2.0 */}
        <span style={{ 
          backgroundColor: '#28a745', 
          color: '#ffffff', 
          padding: '6px 14px', 
          borderRadius: '20px', 
          fontWeight: 'bold', 
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Phiên bản: v2.0
        </span>
      </header>

      {/* THÔNG BÁO TRẠNG THÁI */}
      {message.text && (
        <div style={{
          marginTop: '15px',
          padding: '10px 14px',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      {/* BIỂU MẪU THÊM MỚI SINH VIÊN */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3 style={{ marginTop: 0, fontSize: '18px', color: '#495057' }}>Thêm sinh viên mới</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) gap 15px', gap: '12px' }}>
          <input
            type="text"
            name="studentId"
            placeholder="Mã số SV (VD: B210001)"
            value={formData.studentId}
            onChange={handleInputChange}
            required
            style={{ padding: '8px 12px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ padding: '8px 12px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Địa chỉ Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ padding: '8px 12px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <button 
            type="submit" 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            + Lưu sinh viên
          </button>
        </form>
      </section>

      {/* DANH SÁCH SINH VIÊN */}
      <section style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#495057' }}>Danh sách sinh viên trong cơ sở dữ liệu</h3>
        
        {loading ? (
          <p style={{ color: '#6c757d' }}>Đang tải dữ liệu từ máy chủ...</p>
        ) : students.length === 0 ? (
          <p style={{ color: '#6c757d' }}>Chưa có sinh viên nào. Vui lòng thêm sinh viên ở biểu mẫu trên.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>MSSV</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Họ và tên</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st._id}>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}><strong>{st.studentId}</strong></td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{st.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{st.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(st._id)}
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;