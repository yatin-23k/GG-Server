import pool from '../db.js';

async function getUserDetails(req) {
  // get username from the header
  const username = req.header('username');

  // get user from the database
  try {
    const { rows } = await pool.query(
      'SELECT * FROM UsersGG WHERE username = $1',
      [username]
    );
    if (rows.length === 0) return null;

    return rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Get all wishlist items for the user
export async function getWishlist(req, res) {
  const user = await getUserDetails(req);

  try {
    const { rows } = await pool.query(
      'SELECT * FROM WishlistGG WHERE user_id = $1',
      [user.user_id]
    );
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

// Check if an item is in the wishlist
export async function checkWishlist(req, res) {
  console.log(req.header('username'), req.body);
  const { game_id } = req.body;
  const user = await getUserDetails(req);

  try {
    const { rows } = await pool.query(
      'SELECT * FROM WishlistGG WHERE user_id = $1 AND game_id = $2',
      [user.user_id, game_id]
    );
    if (rows.length === 0)
      return res.status(404).send('Item not found in the wishlist');

    res.status(200).send('Item found in the wishlist');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

// Add an item to the wishlist
export async function addToWishlist(req, res) {
  const { game_id } = req.body;
  const user = await getUserDetails(req);

  console.log(user, game_id);

  try {
    await pool.query(
      'INSERT INTO WishlistGG (user_id, game_id) VALUES ($1, $2)',
      [user.user_id, game_id]
    );
    res.status(201).send('Item added to the wishlist');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

// Remove an item from the wishlist
export async function removeFromWishlist(req, res) {
  const { game_id } = req.body;
  const user = await getUserDetails(req);

  try {
    await pool.query(
      'DELETE FROM WishlistGG WHERE user_id = $1 AND game_id = $2',
      [user.user_id, game_id]
    );
    res.status(200).send('Item removed from the wishlist');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}
