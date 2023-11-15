import http from "k6/http";
import { sleep } from "k6";

/**
 * Test configuration e.g. which test to run, which runtime/identifier and url.
 */
const settings = {
  local: {
    identifier: "LOCAL-TEST",
    url: "http://localhost:3000/users",
  },
  monolithic: {
    aws: {
      nodejs: {
        identifier: "AWS-NODEJS-MONOLITHIC",
        url: "https://masterthesis.arthureberle.com/nodejs-test",
      },
    },
  },
  serverless: {
    aws: {
      python: {
        identifier: "AWS-PYTHON-SERVERLESS", // Defines the name of the test in the dashboard, e.g. AWS-NODEJS_LOAD-TEST
        url: "https://qb4paiyhaccrrppzfdni3wbstm0pbwwq.lambda-url.eu-central-1.on.aws/",
      },
      nodejs: {
        identifier: "AWS-NODEJS-SERVERLESS",
        url: "https://e2mbt7zewbb6bk5ty4eawwhgli0lxhis.lambda-url.eu-central-1.on.aws/",
      },
      golang: {
        identifier: "AWS-GOLANG-SERVERLESS",
        url: "https://a6e33vvhm6yv3dj2pwb6fr4c6u0nqsmg.lambda-url.eu-central-1.on.aws/",
      },
    },
    azure: {
      python: {
        identifier: "AZURE-PYTHON-SERVERLESS",
        url: "https://masterthesis-python.azurewebsites.net/api/load-test",
      },
      nodejs: {
        identifier: "AZURE-NODEJS-SERVERLESS",
        url: "https://masterthesis-nodejs.azurewebsites.net/api/load-test",
      },
      dotnet: {
        identifier: "AZURE-DOTNET-SERVERLESS",
        url: "https://masterthesis-dotnet.azurewebsites.net/api/load-test",
      },
    },
  },
  kubernetes: {
    aws: {
      nodejs: {
        identifier: "AWS-NODEJS-KUBERNETES",
        url: "http://aacb22f1752ae4202883278f5cd70a88-809086049.eu-central-1.elb.amazonaws.com:3000/test",
      },
    },
  },
};

const { url, identifier } = settings.local;
// const { url, identifier } = settings.serverless.azure.nodejs;

/**
 * Cloud configuration. Standard for all tests.
 */
const projectID = 3659233;
const distribution = {
  frankfurt: { loadZone: "amazon:de:frankfurt", percent: 100 },
};

/**
 * Smoke Test:
 * A minimal test where the system is run with one user for a brief period.
 * Used to verify if it is working as expected.
 */
const smokeTestOptions = {
  vus: 1, // 1 user making 1 request per second
  duration: "10s", // for 10 seconds
  ext: {
    loadimpact: {
      projectID,
      name: `${identifier}_SMOKE-TEST`,
      distribution,
    },
  },
};

/**
 * Load Test:
 * A test to simulate the expected number of concurrent users and requests to the system.
 * It helps identify how the system behaves under normal and peak loads.
 */
const loadTestOptions = {
  stages: [
    { duration: "20s", target: 10 }, // ramp up from 1 to 100 users over 20 seconds
    { duration: "2m", target: 1000 }, // stay at 100 users for 2 minutes
    { duration: "20s", target: 5 }, // ramp down to 0 users
  ],
  thresholds: { http_req_duration: ["avg<100", "p(95)<200"] },
  // ext: {
  //   loadimpact: {
  //     projectID,
  //     name: `${identifier}_LOAD-TEST`,
  //     distribution,
  //   },
  // },
};

/**
 * The actual test.
 */
// export const options = loadTestOptions;

export const options = {
  scenarios: {
    user_operations: {
      // A variable number of VUs executes as many iterations as possible for a specified amount of time.
      executor: "ramping-vus",
      // Number of VUs to run at test start.
      startVUs: 1,
      // Array of objects that specify the target number of VUs to ramp up or down to.
      stages: [
        { duration: "1m", target: 20 }, // ramp up to 20 VUs over 5 minutes
        { duration: "2m", target: 20 }, // stay at 20 VUs for 10 minutes
        { duration: "1m", target: 0 }, // ramp down to 0 VUs over 5 minutes
      ],
      // Time to wait for an already started iteration to finish before stopping it during a ramp down.
      gracefulRampDown: "30s",
    },
    product_operations: {
      // Ramps the iteration rate according to your configured stages
      executor: "ramping-arrival-rate",
      startRate: "50",
      timeUnit: "1m",
      preAllocatedVUs: 10,
      maxVUs: 50,
      stages: [
        { duration: "1m", target: 100 },
        { duration: "2m", target: 200 },
        { duration: "1m", target: 100 },
      ],
      // Time to wait for iterations to finish executing before stopping them forcefully
      gracefulStop: "30s",
    },
    order_operations: {
      // Sends VUs at a constant number
      executor: "constant-vus",
      vus: 10,
      duration: "2m",
      // Time to wait for iterations to finish executing before stopping them forcefully
      gracefulStop: "30s",
    },
  },
};

export default function () {
  // http.get(url);

  // const url = "http://localhost:3000/users";
  // const payload = JSON.stringify({ name: "Arthur" });
  // const headers = { "Content-Type": "application/json" };
  // http.get(url, payload, { headers });

  // prettier-ignore
  const actions = [
    { method: 'GET', url: '/users' },
    { method: 'POST', url: '/users', body: JSON.stringify({ name: 'John Doe' }), params: { headers: { 'Content-Type': 'application/json' } } },
    { method: 'PUT', url: '/users/1', body: JSON.stringify({ name: 'John Smith' }), params: { headers: { 'Content-Type': 'application/json' } } },
    { method: 'DELETE', url: '/users/1' },

    { method: 'GET', url: '/products' },
    { method: 'POST', url: '/products', body: JSON.stringify({ name: 'Product A', price: 10.0 }), params: { headers: { 'Content-Type': 'application/json' } } },
    { method: 'PUT', url: '/products/1', body: JSON.stringify({ name: 'Product B', price: 15.0 }), params: { headers: { 'Content-Type': 'application/json' } } },
    { method: 'DELETE', url: '/products/1' },

    { method: 'GET', url: '/orders' },
    { method: 'POST', url: '/orders', body: JSON.stringify({ product_id: 1, quantity: 3 }), params: { headers: { 'Content-Type': 'application/json' } } },
    { method: 'PUT', url: '/orders/1', body: JSON.stringify({ product_id: 2, quantity: 4 }), params: { headers: { 'Content-Type': 'application/json' } } },
    { method: 'DELETE', url: '/orders/1' },
  ];

  const action = actions[Math.floor(Math.random() * actions.length)];
  http.request(action.method, action.url, action.body, action.params);

  /**
   * Generally, your load tests should add sleep time. Sleep time helps control the load generator and better simulates the traffic patterns of human users.
   * However, when it comes to API load tests, these recommendations about sleep come with a few qualifications. If testing an isolated component, you might care only about performance under a pre-determined throughput. But, even in this case, sleep can help you avoid overworking the load generator, and including a few randomized milliseconds of sleep can avoid accidental concurrency.
   * When testing the API against *normal*, human-run workflows, add sleep as in a normal test.
   * @link https://k6.io/docs/testing-guides/api-load-testing/
   */
  sleep(Math.floor(Math.random() * 4) + 1);
}

/**
 * Stress Test:
 * A test to find the system's breaking point.
 * Achieved by gradually increasing the load beyond normal operational capacity.
 */
const stressTestOptions = {
  stages: [
    { duration: "2m", target: 100 }, // below normal load
    { duration: "5m", target: 100 },
    { duration: "2m", target: 200 }, // normal load
    { duration: "5m", target: 200 },
    { duration: "2m", target: 300 }, // around the breaking point
    { duration: "5m", target: 300 },
    { duration: "2m", target: 400 }, // beyond the breaking point
    { duration: "5m", target: 400 },
    { duration: "10m", target: 0 }, // scale down. Recovery stage.
  ],
};
// @link https://k6.io/docs/test-types/stress-testing/
const stressTestOptionsV2 = {
  stages: [
    { duration: "10m", target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: "30m", target: 200 }, // stay at higher 200 users for 30 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};

/**
 * Soak Test:
 * A type of performance test where a system is subjected to a typical production load for an extended period.
 * Used to discover how the system behaves under sustained use.
 */
const soakTestOptions = {
  stages: [
    { duration: "2m", target: 400 }, // ramp up to 400 users
    { duration: "4h", target: 400 }, // stay at 400 for ~4 hours
    { duration: "2m", target: 0 }, // scale down
  ],
};

/**
 * Spike Test:
 * A test that suddenly increases the load on a system to a huge spike, and then quickly reduces the load to zero.
 * It is used to understand how the system will respond to sudden large spikes in load.
 */
const spikeTestOptions = {
  stages: [
    { duration: "2m", target: 2000 }, // fast ramp-up to a high point
    { duration: "1m", target: 0 }, // quick ramp-down to 0 users
  ],
};
