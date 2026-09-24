const test = require("node:test");
const assert = require("node:assert/strict");

const API_URL = process.env.API_URL || "http://127.0.0.1:3000";
const testPid = `CI-${Date.now()}`;

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await response.json();

  return {
    status: response.status,
    body,
  };
}

test("Product API thực hiện đầy đủ quy trình CRUD", async () => {
  // CREATE
  const createResult = await request("/api/products", {
    method: "POST",
    body: JSON.stringify({
      pid: testPid,
      pname: "San pham CI",
      price: 100000,
      quantity: 10,
    }),
  });

  assert.equal(createResult.status, 201);
  assert.equal(createResult.body.data.pid, testPid);
  assert.equal(createResult.body.data.pname, "San pham CI");
  assert.equal(createResult.body.data.price, 100000);
  assert.equal(createResult.body.data.quantity, 10);

  // READ ONE
  const getOneResult = await request(`/api/products/${testPid}`);

  assert.equal(getOneResult.status, 200);
  assert.equal(getOneResult.body.data.pid, testPid);

  // READ ALL
  const getAllResult = await request("/api/products");

  assert.equal(getAllResult.status, 200);
  assert.equal(Array.isArray(getAllResult.body.data), true);
  assert.equal(
    getAllResult.body.data.some((product) => product.pid === testPid),
    true
  );

  // UPDATE
  const updateResult = await request(`/api/products/${testPid}`, {
    method: "PUT",
    body: JSON.stringify({
      pname: "San pham CI da cap nhat",
      price: 150000,
      quantity: 5,
    }),
  });

  assert.equal(updateResult.status, 200);
  assert.equal(updateResult.body.data.pid, testPid);
  assert.equal(updateResult.body.data.pname, "San pham CI da cap nhat");
  assert.equal(updateResult.body.data.price, 150000);
  assert.equal(updateResult.body.data.quantity, 5);

  // DELETE
  const deleteResult = await request(`/api/products/${testPid}`, {
    method: "DELETE",
  });

  assert.equal(deleteResult.status, 200);
  assert.equal(deleteResult.body.data.pid, testPid);

  // Kiểm tra sản phẩm đã bị xóa
  const getDeletedResult = await request(`/api/products/${testPid}`);

  assert.equal(getDeletedResult.status, 404);
  assert.equal(getDeletedResult.body.message, "Không tìm thấy sản phẩm");
});