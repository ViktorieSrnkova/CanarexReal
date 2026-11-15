import bcrypt from "bcrypt";

async function main() {
  const password = "Vladena123Canarex!";
  const hashed = await bcrypt.hash(password, 10);
  console.log("BCRYPT HASH:", hashed);
}

main().catch(console.error);
