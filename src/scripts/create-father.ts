import "dotenv/config";

import { auth } from "../lib/auth";
import { pool } from "../lib/db";

async function createSpiritualFather() {
  const name =
    process.env.INITIAL_FATHER_NAME;
  const email =
    process.env.INITIAL_FATHER_EMAIL
      ?.trim()
      .toLowerCase();
  const username =
    process.env.INITIAL_FATHER_USERNAME
      ?.trim()
      .toLowerCase();
  const password =
    process.env.INITIAL_FATHER_PASSWORD;

  if (
    !name ||
    !email ||
    !username ||
    !password
  ) {
    throw new Error(
      "Initial father environment variables are missing.",
    );
  }

  if (password.length < 10) {
    throw new Error(
      "The password must be at least 10 characters.",
    );
  }

  const existingUser = await pool.query<{
    id: string;
  }>(
    `
      SELECT id
      FROM "user"
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  if (existingUser.rowCount === 0) {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        username,
        displayUsername: username,
      },
    });
  }

  const updatedUser = await pool.query<{
    id: string;
    email: string;
    role: string;
  }>(
    `
      UPDATE "user"
      SET role = $1
      WHERE email = $2
      RETURNING id, email, role
    `,
    ["SPIRITUAL_FATHER", email],
  );

  if (updatedUser.rowCount !== 1) {
    throw new Error(
      "The spiritual-father account could not be created.",
    );
  }

  console.log(
    `Spiritual-father account ready: ${email}`,
  );
}

createSpiritualFather()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });