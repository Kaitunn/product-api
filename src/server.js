require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép Express đọc dữ liệu JSON
app.use(express.json());

// Kiểm tra API
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Product API đang hoạt động",
  });
});

// Healthcheck API và MongoDB
app.get("/health", (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;

  if (!isMongoConnected) {
    return res.status(503).json({
      status: "unhealthy",
      api: "running",
      mongodb: "disconnected",
    });
  }

  return res.status(200).json({
    status: "healthy",
    api: "running",
    mongodb: "connected",
  });
});

// Đăng ký Product API
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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server đang chạy trên cổng ${PORT}`);
    });
  } catch (error) {
    console.error("Kết nối MongoDB thất bại:", error.message);
    process.exit(1);
  }
}

startServer();