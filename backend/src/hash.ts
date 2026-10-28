import bcrypt from "bcrypt";

async function main() {
  const password = "";
  const hashed = await bcrypt.hash(password, 10);
  console.log("BCRYPT HASH:", hashed);
}

main().catch(console.error);
