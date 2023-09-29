import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  insecureSkipTLSVerify: true,
  scenarios: {
    getProducts: {
      exec: "getProducts",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    createProduct: {
      exec: "getProducts",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    updateProduct: {
      exec: "updateProduct",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    deleteProduct: {
      exec: "deleteProduct",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    getOrders: {
      exec: "getOrders",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    createOrder: {
      exec: "createOrder",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    updateOrder: {
      exec: "updateOrder",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    deleteOrder: {
      exec: "deleteOrder",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    getUsers: {
      exec: "getUsers",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    createUser: {
      exec: "createUser",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    updateUser: {
      exec: "updateUser",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
    deleteUser: {
      exec: "deleteUser",
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 1000,
      startTime: "0s",
      duration: "1m",
    },
  },
};

const BASE_URL = "https://192.168.0.91:3000";
const PRODUCTS_ENDPOINT = "/products";
const ORDERS_ENDPOINT = "/orders";
const USERS_ENDPOINT = "/users";

const headers = { "Content-Type": "application/json" };

export function getProducts() {
  const res = http.get(BASE_URL + PRODUCTS_ENDPOINT);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}

export function createProduct() {
  const url = BASE_URL + PRODUCTS_ENDPOINT;
  const payload = JSON.stringify({ name: "Test Product", price: "19.99" });
  const res = http.post(url, payload, { headers });
  check(res, { "status was 201": (r) => r.status == 201 });
  sleep(1);
}

export function updateProduct() {
  const url = BASE_URL + PRODUCTS_ENDPOINT + "/1";
  const payload = JSON.stringify({ name: "Updated Product", price: "29.99" });
  const res = http.put(url, payload, { headers });
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}

export function deleteProduct() {
  const res = http.del(BASE_URL + PRODUCTS_ENDPOINT + "/1");
  check(res, { "status was 204": (r) => r.status == 204 });
  sleep(1);
}

export function getOrders() {
  const res = http.get(BASE_URL + ORDERS_ENDPOINT);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}

export function createOrder() {
  const url = BASE_URL + ORDERS_ENDPOINT;
  const payload = JSON.stringify({ user_id: 1, product_id: 1, quantity: 2 });
  const res = http.post(url, payload, { headers });
  check(res, { "status was 201": (r) => r.status == 201 });
  sleep(1);
}

export function updateOrder() {
  const url = BASE_URL + ORDERS_ENDPOINT + "/1";
  const payload = JSON.stringify({ product_id: 2, quantity: 3 });
  const res = http.put(url, payload, { headers });
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}

export function deleteOrder() {
  const res = http.del(BASE_URL + ORDERS_ENDPOINT + "/1");
  check(res, { "status was 204": (r) => r.status == 204 });
  sleep(1);
}

export function getUsers() {
  const res = http.get(BASE_URL + USERS_ENDPOINT);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}

export function createUser() {
  const url = BASE_URL + USERS_ENDPOINT;
  const payload = JSON.stringify({ name: "Test User" });
  const res = http.post(url, payload, { headers });
  check(res, { "status was 201": (r) => r.status == 201 });
  sleep(1);
}

export function updateUser() {
  const url = BASE_URL + USERS_ENDPOINT + "/1";
  const payload = JSON.stringify({ name: "Updated User" });
  const res = http.put(url, payload, { headers });
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}

export function deleteUser() {
  const res = http.del(BASE_URL + USERS_ENDPOINT + "/1");
  check(res, { "status was 204": (r) => r.status == 204 });
  sleep(1);
}
