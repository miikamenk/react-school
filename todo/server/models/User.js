import { pool } from "../helper/db.js";
import { hash as bcryptHash } from "bcrypt";

const createUser = async (email, plainPassword) => {
  const hashed = await new Promise((resolve, reject) =>
    bcryptHash(plainPassword, 10, (err, hashedPw) =>
      err ? reject(err) : resolve(hashedPw),
    ),
  );

  return await pool.query(
    "INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *",
    [email, hashed],
  );
};

const findUserByEmail = async (email) => {
  return await pool.query("SELECT * FROM account WHERE email = $1", [email]);
};

export { createUser, findUserByEmail };
