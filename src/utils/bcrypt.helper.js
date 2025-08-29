import bcrypt from "bcrypt";

export const hashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

export default { hashPassword, comparePassword };
