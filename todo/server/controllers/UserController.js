import { createUser, findUserByEmail } from "../models/User.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../helper/apiError.js";

const { sign } = jwt;

const signUp = async (req, res, next) => {
  try {
    const { user } = req.body;
    if (!user || !user.email || !user.password) {
      return next(new ApiError("Email and password are required", 400));
    }

    const existing = await findUserByEmail(user.email);
    if (existing.rows && existing.rows.length > 0) {
      return next(new ApiError("Email already in use", 409));
    }

    const result = await createUser(user.email, user.password);
    return res
      .status(201)
      .json({ id: result.rows[0].id, email: result.rows[0].email });
  } catch (err) {
    return next(err);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { user } = req.body;
    if (!user || !user.email || !user.password) {
      return next(new ApiError("Email and password are required", 400));
    }

    const dbUser = await findUserByEmail(user.email);
    if (!dbUser.rows || dbUser.rows.length === 0) {
      return next(new ApiError("User not found", 404));
    }

    const dbRow = dbUser.rows[0];

    const isMatch = await new Promise((resolve, reject) =>
      compare(user.password, dbRow.password, (err, ok) =>
        err ? reject(err) : resolve(ok),
      ),
    );

    if (!isMatch) {
      return next(new ApiError("Invalid password", 401));
    }

    const token = sign({ user: dbRow.email }, process.env.JWT_SECRET);
    return res.status(200).json({
      id: dbRow.id,
      email: dbRow.email,
      token,
    });
  } catch (err) {
    return next(err);
  }
};

export { signUp, signIn };
