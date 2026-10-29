const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas sử dụng biến môi trường từ tệp .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Endpoint kiểm tra hệ thống (/health)
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "UP", message: "Backend is running smoothly" });
});

// Schema & Model cho Món Ăn (Khớp với collection 'foods')
const foodSchema = new mongoose.Schema(
  {
    foodId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    cuisine: { type: String, required: true },
    ingredients: { type: [String], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

const Food = mongoose.model("Food", foodSchema, "foods");

// 1. Lấy danh sách món ăn & Tìm kiếm theo từ khóa (?search=...)
app.get("/api/foods", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { cuisine: { $regex: search, $options: "i" } },
        ],
      };
    }
    const foods = await Food.find(query);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Xem chi tiết món ăn theo ID
app.get("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food)
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    res.json(food);
  } catch (error) {
    res.status(400).json({ error: "ID không hợp lệ" });
  }
});

// 3. Thêm món ăn mới (Kiểm tra trùng foodId)
app.post("/api/foods", async (req, res) => {
  try {
    const { foodId, name, price } = req.body;
    if (!foodId || !name || !price) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }
    const existing = await Food.findOne({ foodId });
    if (existing) {
      return res.status(400).json({ message: "Mã món ăn foodId đã tồn tại" });
    }
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Cập nhật thông tin món ăn
app.put("/api/foods/:id", async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedFood)
      return res
        .status(404)
        .json({ message: "Không tìm thấy món ăn để cập nhật" });
    res.json(updatedFood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Xóa món ăn
app.delete("/api/foods/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood)
      return res.status(404).json({ message: "Không tìm thấy món ăn để xóa" });
    res.json({ message: "Xóa món ăn thành công" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
