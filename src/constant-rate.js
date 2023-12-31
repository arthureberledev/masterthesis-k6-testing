import { check, sleep } from "k6";
import http from "k6/http";

// const name = "AWS-SERVERLESS_STRESS-TEST";
const name = "AWS-MONOLITHIC-LIGHTSAIL_STRESS-TEST";

// const BASE_URL = "https://192.168.0.91:3000";
// const BASE_URL =
//   "https://ec2-3-122-107-158.eu-central-1.compute.amazonaws.com:3000";
// const BASE_URL = "https://aij2qt7277.execute-api.eu-central-1.amazonaws.com";
const BASE_URL =
  "https://ec2-18-184-157-162.eu-central-1.compute.amazonaws.com:3000";

const PRODUCTS_ENDPOINT = "/products";
const ORDERS_ENDPOINT = "/orders";
const USERS_ENDPOINT = "/users";

const headers = { "Content-Type": "application/json" };

const CONSTANT_ARRIVAL_RATE = {
  executor: "constant-arrival-rate",
  rate: 1000, // Number of iterations to start during each timeUnit period.
  timeUnit: "10m", // Period of time to apply the rate value.
  preAllocatedVUs: 10,
  maxVUs: 10, // Maximum number of VUs to allow during the test run.
  startTime: "0s",
  duration: "10m", // Total scenario duration (excluding gracefulStop).
};

// const stages = [
//   // Start 100 iterations per `timeUnit` for the first minute.
//   { target: 100, duration: "1m" },
//   // Linearly ramp-up to starting 200 iterations per `timeUnit` over the following two minutes.
//   { target: 200, duration: "2m" },
//   // Continue starting 200 iterations per `timeUnit` for the following four minutes.
//   { target: 200, duration: "4m" },
//   // Linearly ramp-down to starting 20 iterations per `timeUnit` over the last two minutes.
//   { target: 20, duration: "2m" },
// ];

// const executor = "ramping-arrival-rate";
// const startRate = 0;
// const timeUnit = "1s";
// const preAllocatedVUs = 100;
// const stages = [
//   { target: 5, duration: "30s" }, // Warm-Up Phase
//   { target: 20, duration: "4m" }, // Ramping-Up Phase
//   { target: 50, duration: "5m" }, // Peak Load Phase
//   { target: 20, duration: "2m" }, // Ramping-Down Phase
//   { target: 5, duration: "1m" }, // Cool-Down Phase
// ];

export const options = {
  insecureSkipTLSVerify: true,
  ext: {
    loadimpact: {
      name,
      projectID: 3662254,
      distribution: {
        frankfurt: { loadZone: "amazon:de:frankfurt", percent: 100 },
      },
    },
  },
  scenarios: {
    // getProducts: {
    //   exec: "getProducts",
    //   executor,
    //   startVUs,
    //   stages,
    //   gracefulRampDown,
    // },
    // createProduct: {
    //   exec: "getProducts",
    //   executor,
    //   startVUs,
    //   stages,
    //   gracefulRampDown,
    // },
    // updateProduct: {
    //   exec: "updateProduct",
    //   executor,
    //   startVUs,
    //   stages,
    //   gracefulRampDown,
    // },
    // deleteProduct: {
    //   exec: "deleteProduct",
    //   executor,
    //   startVUs,
    //   stages,
    //   gracefulRampDown,
    // },
    getUsers: {
      exec: "getUsers",
      executor,
      startRate,
      timeUnit,
      preAllocatedVUs,
      stages,
    },
    createUser: {
      exec: "createUser",
      executor,
      startRate,
      timeUnit,
      preAllocatedVUs,
      stages,
    },
    updateUser: {
      exec: "updateUser",
      executor,
      startRate,
      timeUnit,
      preAllocatedVUs,
      stages,
    },
    deleteUser: {
      exec: "deleteUser",
      executor,
      startRate,
      timeUnit,
      preAllocatedVUs,
      stages,
    },
  },
};

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
  // sleep(1);
}

export function createUser() {
  const url = BASE_URL + USERS_ENDPOINT;
  const payload = JSON.stringify({ name: "Test User" });
  const res = http.post(url, payload, { headers });
  check(res, { "status was 201": (r) => r.status == 201 });
  // sleep(1);
}

export function updateUser() {
  const url = BASE_URL + USERS_ENDPOINT + "/1";
  const payload = JSON.stringify({ name: "Updated User" });
  const res = http.put(url, payload, { headers });
  check(res, { "status was 200": (r) => r.status == 200 });
  // sleep(1);
}

export function deleteUser() {
  const res = http.del(BASE_URL + USERS_ENDPOINT + "/1");
  check(res, { "status was 204": (r) => r.status == 204 });
  // sleep(1);
}
