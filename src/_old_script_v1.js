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
 * Load Test:
 * A test to simulate the expected number of concurrent users and requests to the system.
 * It helps identify how the system behaves under normal and peak loads.
 */
const loadTestOptions = {
  stages: [
    // ramp up from 1 to 10 users over 20 seconds
    { duration: "20s", target: 10 },
    // stay at 100 users for 2 minutes
    { duration: "2m", target: 100 },
    // and then ramp down to 5 users over 20 seconds
    { duration: "20s", target: 5 },
  ],
  thresholds: {
    http_req_duration: [
      // The average response time should be below 100ms
      "avg<100",
      // 95% of requests should be below 200ms
      "p(95)<200",
    ],
  },
};

export const options = loadTestOptions;

export default function () {
  http.request(__ENV.METHOD, __ENV.HOSTNAME);

  /**
   * Generally, your load tests should add sleep time. Sleep time helps control the load generator and better simulates the traffic patterns of human users.
   * However, when it comes to API load tests, these recommendations about sleep come with a few qualifications. If testing an isolated component, you might care only about performance under a pre-determined throughput. But, even in this case, sleep can help you avoid overworking the load generator, and including a few randomized milliseconds of sleep can avoid accidental concurrency.
   * When testing the API against *normal*, human-run workflows, add sleep as in a normal test.
   * @link https://k6.io/docs/testing-guides/api-load-testing/
   */
  sleep(1);
}

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
