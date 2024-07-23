import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import wishlistRoutes from './routes/wishlist.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => res.send("Welcome to Game Galaxy!"));

app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);

export default app;
