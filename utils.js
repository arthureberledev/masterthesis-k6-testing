const tresholds = {
  http_req_failed: ["rate<0.01"], // http errors should be less than 1%
  http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
};

const architecture = "AZURE-MONOLITHIC"; // will be changed for each test

export const smokeTest = {
  vus: 2,
  duration: "30s",
  thresholds: tresholds,
  ext: {
    loadimpact: {
      name: `${architecture}_SMOKE-TEST`,
      projectID: 3662254,
      distribution: {
        frankfurt: { loadZone: "amazon:de:frankfurt", percent: 100 },
      },
    },
  },
};

export const loadTest = {
  stages: [
    { duration: "5m", target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "30m", target: 100 }, // stay at 100 users for 30 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
  thresholds: tresholds,
  ext: {
    loadimpact: {
      name: `${architecture}_LOAD-TEST`,
      projectID: 3662254,
      distribution: {
        frankfurt: { loadZone: "amazon:de:frankfurt", percent: 100 },
      },
    },
  },
};

export const spikeTest = {
  stages: [
    { duration: "2m", target: 2000 }, // fast ramp-up to a high point
    { duration: "1m", target: 0 }, // quick ramp-down to 0 users
  ],
  thresholds: tresholds,
  ext: {
    loadimpact: {
      name: `${architecture}_SPIKE-TEST`,
      projectID: 3662254,
      distribution: {
        frankfurt: { loadZone: "amazon:de:frankfurt", percent: 100 },
      },
    },
  },
};

export function createRandomString(length, charset = "") {
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";
  let res = "";
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}
