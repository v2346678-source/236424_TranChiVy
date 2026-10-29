import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Trash2, Edit, RefreshCw } from "lucide-react";

const API_URL = "http://localhost:5000/api/foods";

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    foodId: "",
    name: "",
    category: "",
    cuisine: "",
    ingredients: "",
    price: "",
    quantity: "",
    description: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchFoods = async () => {
    try {
      const res = await axios.get(`${API_URL}?search=${search}`);
      setFoods(res.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...form,
      ingredients:
        typeof form.ingredients === "string"
          ? form.ingredients.split(",").map((i) => i.trim())
          : form.ingredients,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formattedData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formattedData);
      }
      setForm({
        foodId: "",
        name: "",
        category: "",
        cuisine: "",
        ingredients: "",
        price: "",
        quantity: "",
        description: "",
        imageUrl: "",
      });
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setForm({
      ...food,
      ingredients: Array.isArray(food.ingredients)
        ? food.ingredients.join(", ")
        : food.ingredients,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa món ăn này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchFoods();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Quản Lý Món Ăn - MSSV: 236424
        </h1>

        {/* Thanh tìm kiếm */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, danh mục, ẩm thực..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={fetchFoods}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            <RefreshCw size={18} /> Làm mới
          </button>
        </div>

        {/* Form Nhập dữ liệu */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 border"
        >
          <input
            type="text"
            placeholder="Mã món (foodId)"
            value={form.foodId}
            onChange={(e) => setForm({ ...form, foodId: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Tên món ăn"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Danh mục"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Ẩm thực"
            value={form.cuisine}
            onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Nguyên liệu (phân cách bằng dấu phẩy)"
            value={form.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Giá (VND)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Số lượng"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="URL hình ảnh"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="p-2 border rounded"
          />

          <div className="md:col-span-3 flex justify-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    foodId: "",
                    name: "",
                    category: "",
                    cuisine: "",
                    ingredients: "",
                    price: "",
                    quantity: "",
                    description: "",
                    imageUrl: "",
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              <Plus size={18} /> {editingId ? "Cập nhật món ăn" : "Thêm món ăn"}
            </button>
          </div>
        </form>

        {/* Bảng hiển thị danh sách */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">Mã</th>
                <th className="p-3">Tên món</th>
                <th className="p-3">Danh mục</th>
                <th className="p-3">Ẩm thực</th>
                <th className="p-3">Giá</th>
                <th className="p-3">Số lượng</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {foods.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    Không tìm thấy món ăn nào
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{food.foodId}</td>
                    <td className="p-3 text-gray-900 font-semibold">
                      {food.name}
                    </td>
                    <td className="p-3">{food.category}</td>
                    <td className="p-3">{food.cuisine}</td>
                    <td className="p-3">{food.price?.toLocaleString()} đ</td>
                    <td className="p-3">{food.quantity}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(food)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
