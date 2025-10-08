import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [bookFile, setBookFile] = useState(null); // <--- NEW STATE
  const [bookFilePreview, setBookFilePreview] = useState(null); // <--- NEW STATE

  const handleBookFileChange = (e) => { // <--- NEW HANDLER
    const file = e.target.files[0];
    if (file) {
      setBookFile(file);
      setBookFilePreview(file.name);
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    if (bookFile) { // <--- NEW APPEND
      formData.append("bookFile", bookFile);
    }
    dispatch(addBook(formData));
    dispatch(fetchAllBooks());
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Record Book</h3>
            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Book Title"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Book Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Book Quantity" className="w-full px-4 py-2 border-2 border-black rounded-md" required />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Book Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Book's Description" rows={4} className="w-full px-4 py-2 border-2 border-black rounded-md" />

              </div>

              {/* --- NEW INPUT FIELD FOR PDF --- */}
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Book PDF File (Optional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleBookFileChange}
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                />
                {bookFilePreview && <p className="text-sm text-gray-500 mt-1">Selected File: {bookFilePreview}</p>}
              </div>
              {/* --- END NEW INPUT FIELD FOR PDF --- */}

              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  type="button"
                  onClick={() => {
                    dispatch(toggleAddBookPopup());
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBookPopup;
