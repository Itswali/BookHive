// routes/bookRouter.js

import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { addBook, deleteBook, getAllBook, getSingleBook } from "../controllers/bookController.js"; // Import getSingleBook
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all", isAuthenticated, getAllBook);
router.get("/:id", isAuthenticated, getSingleBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);


export default router;
