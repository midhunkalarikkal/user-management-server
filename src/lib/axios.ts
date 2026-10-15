import axios from "axios";
import { env } from "../config/env.js";

export const dummyJsonApi = axios.create({
  baseURL: env.DUMMYJSON_BASE_URL,
  timeout: 10000,
});
