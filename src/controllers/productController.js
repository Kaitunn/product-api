const Product = require("../models/Product");

// CREATE: Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "pid đã tồn tại",
      });
    }

    res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      error: error.message,
    });
  }
};

// READ: Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

// READ: Lấy một sản phẩm theo pid
exports.getProductByPid = async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: req.params.pid,
    });

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể lấy thông tin sản phẩm",
      error: error.message,
    });
  }
};

// UPDATE: Cập nhật sản phẩm theo pid
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "pid mới đã tồn tại",
      });
    }

    res.status(400).json({
      message: "Dữ liệu cập nhật không hợp lệ",
      error: error.message,
    });
  }
};

// DELETE: Xóa sản phẩm theo pid
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid,
    });

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      message: "Xóa sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể xóa sản phẩm",
      error: error.message,
    });
  }
};