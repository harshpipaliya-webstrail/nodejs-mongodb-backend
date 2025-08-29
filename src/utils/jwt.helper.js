import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";

export function decodeToken(token) {
  return jwt.decode(token.replace("Bearer ", ""));
}

export function getJWTToken(data) {
  const token = `Bearer ${jwt.sign(data, jwtSecret)}`;
  return token;
}

export default { decodeToken, getJWTToken };
