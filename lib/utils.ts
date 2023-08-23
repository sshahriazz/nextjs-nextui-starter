import bcrypt from "bcrypt";

export async function hashData(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
export async function verifyData(password: string, hash: string) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

export async function generateUsernameFromEmail(email: string) {
  const firstPart = email.split("@")[0];
  const randomSuffix = Math.floor(Math.random() * 1000); // Adding a random number to ensure uniqueness

  const username = `${firstPart}_${randomSuffix}`;

  return username;
}
