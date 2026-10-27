import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/employees';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Chính thức'
  });

  // 1. Lấy danh sách nhân viên
  const fetchEmployees = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : API_URL;
      const res = await axios.get(url);
      setEmployees(res.data);
    } catch (err) {
      showMessage('Lỗi khi tải danh sách nhân viên: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Tìm kiếm nhân viên
  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchQuery);
  };

  // 3. Reset form
  const resetForm = () => {
    setFormData({
      employeeId: '',
      fullName: '',
      gender: 'Nam',
      dateOfBirth: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      hireDate: '',
      status: 'Chính thức'
    });
    setEditingId(null);
  };

  // 4. Submit form (Thêm hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        showMessage('Cập nhật thông tin nhân viên thành công!');
      } else {
        await axios.post(API_URL, formData);
        showMessage('Thêm nhân viên mới thành công!');
      }
      resetForm();
      fetchEmployees(searchQuery);
    } catch (err) {
      showMessage(err.response?.data?.message || 'Có lỗi xảy ra khi lưu nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 5. Chọn nhân viên để sửa
  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData({
      employeeId: emp.employeeId || '',
      fullName: emp.fullName || '',
      gender: emp.gender || 'Nam',
      dateOfBirth: emp.dateOfBirth || '',
      department: emp.department || '',
      position: emp.position || '',
      email: emp.email || '',
      phone: emp.phone || '',
      hireDate: emp.hireDate || '',
      status: emp.status || 'Chính thức'
    });
  };

  // 6. Xóa nhân viên (Có xác nhận)
  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}"?`)) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/${id}`);
        showMessage('Xóa nhân viên thành công!');
        fetchEmployees(searchQuery);
      } catch (err) {
        showMessage('Lỗi khi xóa: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-blue-700 text-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold">HỆ THỐNG QUẢN LÝ NHÂN SỰ (HR MANAGEMENT SYSTEM)</h1>
          <p className="text-blue-100 text-sm mt-1">Mã SV / Họ tên: 237267 - Lâm Chân Hùng</p>
        </header>

        {/* Thông báo Alert */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-md shadow-sm font-medium ${
            message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Thêm/Sửa */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              {editingId ? 'Cập nhật thông tin nhân viên' : 'Thêm nhân viên mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mã nhân viên *</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                  disabled={!!editingId}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="NV001"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phòng ban *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="IT"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Chức vụ *</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="Lập trình viên"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="example@gmail.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="Chính thức">Chính thức</option>
                    <option value="Thử việc">Thử việc</option>
                    <option value="Nghỉ việc">Nghỉ việc</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold text-sm hover:bg-blue-700 transition"
                >
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-400 text-white px-3 py-2 rounded font-semibold text-sm hover:bg-gray-500"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Danh sách nhân viên */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {/* Thanh tìm kiếm */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã nhân viên hoặc họ tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-900"
              >
                Tìm kiếm
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); fetchEmployees(''); }}
                  className="bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-400"
                >
                  Đặt lại
                </button>
              )}
            </form>

            {/* Bảng danh sách */}
            {loading ? (
              <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Không tìm thấy dữ liệu nhân viên nào</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 border-b">
                      <th className="p-2">Mã NV</th>
                      <th className="p-2">Họ tên</th>
                      <th className="p-2">Phòng ban</th>
                      <th className="p-2">Chức vụ</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">SĐT</th>
                      <th className="p-2">Trạng thái</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp._id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-bold text-blue-600">{emp.employeeId}</td>
                        <td className="p-2 font-medium">{emp.fullName}</td>
                        <td className="p-2">{emp.department}</td>
                        <td className="p-2">{emp.position}</td>
                        <td className="p-2">{emp.email}</td>
                        <td className="p-2">{emp.phone}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            emp.status === 'Chính thức' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-2 text-center space-x-1">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id, emp.fullName)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
