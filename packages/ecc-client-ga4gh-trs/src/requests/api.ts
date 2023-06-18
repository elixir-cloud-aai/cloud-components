import axios from "axios";

const api = axios.create({
  baseURL: "https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
