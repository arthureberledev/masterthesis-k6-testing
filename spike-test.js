import http from "k6/http";
import { sleep, check } from "k6";

// ext: {
//   loadimpact: {
//     name: `HETZNER-MONOLITHIC-V3_SPIKE-TEST`,
//     //   name: `AWS-SERVERLESS_SPIKE-TEST`,
//     projectID: 3662254,
//     distribution: {
//       frankfurt: { loadZone: "amazon:de:frankfurt", percent: 100 },
//     },
//   },
// },

// https://mt-functions-app.azurewebsites.net/api/users

export const options = {
  insecureSkipTLSVerify: true,
  stages: [
    { duration: "2m", target: 2000 }, // fast ramp-up to a high point
    { duration: "1m", target: 0 }, // quick ramp-down to 0 users
  ],
};

export default () => {
  const res = http.get("http://20.170.72.54:3000/users");
  check(res, { "status was 200": () => res.status == 200 });
  sleep(1);
};
