// routes/favoriteRouter.js

import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { addToFavorites, getMyFavorites, removeFromFavorites } from "../controllers/favoriteController.js";

const router = express.Router();

// Get the user's list of favorite books
router.get("/my-favorites", isAuthenticated, getMyFavorites);

// Add a book to favorites
router.put("/add/:bookId", isAuthenticated, addToFavorites);

// Remove a book from favorites
router.put("/remove/:bookId", isAuthenticated, removeFromFavorites);


export default router;
