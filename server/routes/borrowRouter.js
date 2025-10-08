import express from "express";
import { borrowedBooks, getBorrowedBooksForAdmin, recordBorrowedBook, returnBorrowBook}  from "../controllers/borrowControllers.js";
import { isAuthenticated, isAuthorized }  from "../middlewares/authMiddleware.js"

const router = express.Router();


router.post("/record-borrow-book/:id", isAuthenticated, isAuthorized("Admin"),  recordBorrowedBook);

router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"), getBorrowedBooksForAdmin);


router.get("/my-borrowed-books", isAuthenticated,  borrowedBooks);

// ADMIN route for manual return (Admin provides the user's email in the body)
router.put("/return-book/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowBook);

// USER route for self-return (User is identified by their session/token)
router.put("/user-return-book/:bookId", isAuthenticated, returnBorrowBook);

export default router;
