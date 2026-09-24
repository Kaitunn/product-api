require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép Express đọc dữ liệu JSON từ request
app.use(express.json());

// API kiểm tra server
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Product API đang hoạt động",
  });
});

// Đăng ký các API Product
app.use("/api/products", productRoutes);

// Xử lý URL không tồn tại
app.use((req, res) => {
  res.status(404).json({
    message: "Không tìm thấy API",
  });
});

// Kết nối MongoDB rồi khởi động server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Kết nối MongoDB thành công");

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Kết nối MongoDB thất bại:", error.message);
    process.exit(1);
  }
}

startServer();