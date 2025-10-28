import fs from "fs/promises";
import path from "path";
import { pool } from "./db.js";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const { sign } = jwt;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const initializeTestDb = async () => {
  const sql = await fs.readFile(path.resolve(__dirname, "../init.sql"), "utf8");
  return new Promise((resolve, reject) => {
    pool.query(sql, (err) => {
      if (err) {
        console.error("Error initializing test database:", err);
        reject(err);
      } else {
        console.log("Test database initialized successfully");
        resolve();
      }
    });
  });
};

const insertTestUser = async (user) => {
  const hashedPassword = await new Promise((resolve, reject) => {
    hash(user.password, 10, (err, hashed) => {
      if (err) reject(err);
      else resolve(hashed);
    });
  });

  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO account (email, password) VALUES ($1, $2)",
      [user.email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Error inserting test user:", err);
          reject(err);
        } else {
          console.log("Test user inserted successfully");
          resolve(result);
        }
      },
    );
  });
};

const getToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET);
};

export { initializeTestDb, insertTestUser, getToken };
