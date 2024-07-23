import bcrypt from 'bcryptjs';
import pool from '../db.js';

export async function register(req, res) {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);

  // Check if the email already exists
  try {
    const emailExist = await pool.query(
      'SELECT * FROM UsersGG WHERE email = $1',
      [email]
    );
    if (emailExist.rows.length > 0) {
      return res.status(400).send({
        error: 'An account with this Email already exists. Please Login.',
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ error: 'Server error' });
  }

  // Check if the username already exists
  try {
    const usernameExist = await pool.query(
      'SELECT * FROM UsersGG WHERE username = $1',
      [username]
    );
    if (usernameExist.rows.length > 0) {
      return res.status(400).send({ error: 'Username already taken' });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ error: 'Server error' });
  }

  // create a new user
  try {
    const { rows } = await pool.query(
      'INSERT INTO UsersGG (username, email, password) VALUES ($1, $2, $3) RETURNING username',
      [username, email, hashedPassword]
    );

    res.status(201).send({ username: rows[0].username });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM UsersGG WHERE username = $1',
      [username]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password))
        res.send({ username: user.username });
      else res.status(400).send({ error: 'Username or password is incorrect' });
    } else {
      res.status(400).send({ error: 'Username does not exist' });
    }
  } catch (err) {
    res.status(500).send({ error: 'Login failed' });
  }
}
