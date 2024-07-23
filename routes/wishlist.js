import express from 'express';
import {getWishlist, checkWishlist, addToWishlist, removeFromWishlist} from "../controllers/wishlistController.js";

const router = express.Router();

router.get('/', getWishlist);
router.post('/check', checkWishlist);
router.post('/add', addToWishlist);
router.post('/delete', removeFromWishlist);

export default router;
