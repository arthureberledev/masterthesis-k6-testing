import http from "k6/http";
import { sleep, check, group } from "k6";

const tresholds = {
  http_req_failed: ["rate<0.01"], // http errors should be less than 1%
  http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
};

const smokeTest = {
  vus: 2,
  duration: "30s",
  thresholds: tresholds,
};

const loadTest = {
  stages: [
    { duration: "5m", target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "30m", target: 100 }, // stay at 100 users for 30 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
  thresholds: tresholds,
};

const spikeTest = {
  stages: [
    { duration: "2m", target: 2000 }, // fast ramp-up to a high point
    { duration: "1m", target: 0 }, // quick ramp-down to 0 users
  ],
  thresholds: tresholds,
};

export const options = spikeTest;

function createRandomString(length, charset = "") {
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";
  let res = "";
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

export default () => {
  let url = "azurewebsites.net/api/users";
  let email = `${createRandomString(10)}@mail.com`;

  group("1. Create new user", () => {
    const payload = JSON.stringify({
      name: "Test User",
      email: email,
    });

    const response = http.post(
      `https://mt-serverless-create-user.${url}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        tags: { name: "Create" },
      }
    );

    const isSuccess = check(response, {
      "User created successfully": (r) => r.status === 201,
    });

    if (!isSuccess) {
      console.log(`Unable to create user: ${response.status} ${response.body}`);
      return;
    }

    url = `${url}/${response.json("id")}`;
  });

  group("2. Get user", () => {
    const response = http.get(`https://mt-serverless-get-user.${url}`, {
      tags: { name: "Read" },
    });

    const isSuccess = check(response, {
      "User retrieved successfully": () => response.status === 200,
      "User email is correct": () => response.json("email") === email,
    });

    if (!isSuccess) {
      console.log(`Unable to get user: ${response.status} ${response.body}`);
      return;
    }
  });

  group("3. Update user", () => {
    const payload = JSON.stringify({ name: "Updated User" });

    const response = http.patch(
      `https://mt-serverless-update-user.${url}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        tags: { name: "Update" },
      }
    );

    const isSuccess = check(response, {
      "User updated successfully": () => response.status === 200,
      "User name is updated": () => response.json("name") === "Updated User",
    });

    if (!isSuccess) {
      console.log(`Unable to update user: ${response.status} ${response.body}`);
      return;
    }
  });

  group("4. Delete user", () => {
    const response = http.del(
      `https://mt-serverless-delete-user.${url}`,
      null,
      {
        tags: { name: "Delete" },
      }
    );

    const isSuccess = check(response, {
      "User deleted successfully": () => response.status === 204,
    });

    if (!isSuccess) {
      console.log(`Unable to delete user: ${response.status}`);
      return;
    }
  });

  sleep(1);
};
