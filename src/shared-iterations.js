/**
 * The shared-iterations executor shares iterations between the number of VUs. The test ends once k6 executes all iterations.
 *
 * Wann zu verwenden
 * Dieser Executor ist geeignet, wenn eine bestimmte Anzahl von VUs eine feste Anzahl von Iterationen durchführen soll und die Anzahl der Iterationen pro VU unwichtig ist.
 * Wenn die Zeit für die Durchführung einer bestimmten Anzahl von Testiterationen wichtig ist (time to complete), ist dieser Executor am besten geeignet.
 *
 * Ein Beispiel für einen Anwendungsfall sind schnelle Leistungstests im Build-Zyklus der Entwicklung.
 * Wenn Entwickler Änderungen vornehmen, können sie den Test gegen den lokalen Code laufen lassen, um auf Leistungsrückschritte zu testen.
 * Der Executor eignet sich daher gut für eine Shift-Links-Politik, bei der der Schwerpunkt auf Leistungstests zu Beginn des Entwicklungszyklus liegt, wenn die Kosten für eine Korrektur am geringsten sind.
 */

import { check, sleep } from "k6";
import http from "k6/http";

const lambda = {
  BASE_URL: "https://09jx46779a.execute-api.eu-central-1.amazonaws.com",
  name: "AWS-SERVERLESS_SHARED_ITERATIONS",
};

const ec2 = {
  BASE_URL:
    "https://ec2-18-184-157-162.eu-central-1.compute.amazonaws.com:3000",
  name: "AWS-MONOLITHIC-M3m_SHARED_ITERATIONS",
};

const { BASE_URL, name } = ec2;

const PRODUCTS_ENDPOINT = "/products";
const ORDERS_ENDPOINT = "/orders";
const USERS_ENDPOINT = "/users";

const executor = "shared-iterations";

// 1K Requests
const vus = 10;
const iterations = 250;
const maxDuration = "1m";

// const vus = 100;
// const iterations = 2500;
// const maxDuration = "10m";

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
    getUsers: {
      exec: "getUsers",
      executor,
      vus,
      iterations,
      maxDuration,
    },
    createUser: {
      exec: "createUser",
      executor,
      vus,
      iterations,
      maxDuration,
    },
    updateUser: {
      exec: "updateUser",
      executor,
      vus,
      iterations,
      maxDuration,
    },
    deleteUser: {
      exec: "deleteUser",
      executor,
      vus,
      iterations,
      maxDuration,
    },
  },
};

const headers = { "Content-Type": "application/json" };

export function getProducts() {
  const res = http.get(BASE_URL + PRODUCTS_ENDPOINT);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(0.5);
}

export function createProduct() {
  const url = BASE_URL + PRODUCTS_ENDPOINT;
  const payload = JSON.stringify({ name: "Test Product", price: "19.99" });
  const res = http.post(url, payload, { headers });
  check(res, { "status was 201": (r) => r.status == 201 });
  sleep(0.5);
}

export function updateProduct() {
  const url = BASE_URL + PRODUCTS_ENDPOINT + "/1";
  const payload = JSON.stringify({ name: "Updated Product", price: "29.99" });
  const res = http.put(url, payload, { headers });
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(0.5);
}

export function deleteProduct() {
  const res = http.del(BASE_URL + PRODUCTS_ENDPOINT + "/1");
  check(res, { "status was 204": (r) => r.status == 204 });
  sleep(0.5);
}

export function getOrders() {
  const res = http.get(BASE_URL + ORDERS_ENDPOINT);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(0.5);
}

export function createOrder() {
  const url = BASE_URL + ORDERS_ENDPOINT;
  const payload = JSON.stringify({ user_id: 1, product_id: 1, quantity: 2 });
  const res = http.post(url, payload, { headers });
  check(res, { "status was 201": (r) => r.status == 201 });
  sleep(0.5);
}

export function updateOrder() {
  const url = BASE_URL + ORDERS_ENDPOINT + "/1";
  const payload = JSON.stringify({ product_id: 2, quantity: 3 });
  const res = http.put(url, payload, { headers });
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(0.5);
}

export function deleteOrder() {
  const res = http.del(BASE_URL + ORDERS_ENDPOINT + "/1");
  check(res, { "status was 204": (r) => r.status == 204 });
  sleep(0.5);
}

export function getUsers() {
  const res = http.get(BASE_URL + USERS_ENDPOINT);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(0.5);
}

export function createUser() {
  const url = BASE_URL + USERS_ENDPOINT;
  const payload = JSON.stringify({ name: "Test User" });
  const res = http.post(url, payload, { headers });
  check(res, { "status was 201": (r) => r.status == 201 });
  sleep(0.5);
}

export function updateUser() {
  const url = BASE_URL + USERS_ENDPOINT + "/1";
  const payload = JSON.stringify({ name: "Updated User" });
  const res = http.put(url, payload, { headers });
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(0.5);
}

export function deleteUser() {
  const res = http.del(BASE_URL + USERS_ENDPOINT + "/1");
  check(res, { "status was 204": (r) => r.status == 204 });
  sleep(0.5);
}
