const db = require("../models/db");
const fileUtils = require("../models/bookModel");

const getHomePage = (req, res) => {
  const currentUser = req.session.user;
  if (currentUser) {
    res.render("home", { manachr: isTypeChar(currentUser) });
  } else {
    res.redirect("/");
  }
};

const getViewBooks = async (req, res) => {
  const currentUser = req.session.user;
  if (currentUser) {
    const images = await fileUtils.getBookImages();
    try {
      const books = await db.getBooks();
      res.render("view", {
        books,
        images,
        manachr: isTypeChar(currentUser),
      });
    } catch (e) {
      console.error("Lỗi lấy danh sách sách:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const searchBooks = async (req, res) => {
  const currentUser = req.session.user;
  const searchTerm = req.body.searchTerm;
  if (currentUser) {
    const images = await fileUtils.getBookImages();
    try {
      const books = await db.searchBooks(searchTerm);
      res.render("view", {
        books,
        images,
        manachr: isTypeChar(currentUser),
      });
    } catch (e) {
      console.error("Lỗi tìm kiếm sách:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const getAddBook = (req, res) => {
  const currentUser = req.session.user;
  if (currentUser) {
    fileUtils.getBookImages().then((images) => {
      res.render("add", { images, manachr: isTypeChar(currentUser) });
    });
  } else {
    res.redirect("/");
  }
};

const addBook = async (req, res) => {
  const { title, author, genre, location, available } = req.body;
  const coverImage = req.file
    ? req.file.filename
    : req.body["image-source"] === "web"
    ? req.body["image-web"]
    : "empty.jpg";
    console.log(coverImage);
    console.log(req.body);
  try {
    await db.addBook(title, author, genre, location, coverImage, available);
    res.redirect("/view");
  } catch (e) {
    console.error("Lỗi thêm sách:", e);
    res.send("Lỗi xảy ra!");
  }
};

const editBook = async (req, res) => {
  const currentUser = req.session.user;
  const AxuId = req.params.id;
  if (currentUser) {
    if (!(currentUser.role === "mana" || currentUser.role === "aDmIn")) {
      res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa." });
      console.log(403);
      return;
    }
    const images = await fileUtils.getBookImages();
    try {
      const book = await db.getBookById(AxuId);
      console.log(book);
      res.render("EDIT", {
        book,
        AxuId,
        images,
        manachr: isTypeChar(currentUser),
      });
    } catch (e) {
      console.error("Lỗi lấy thông tin sách:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const { title, author, genre, location, available } = req.body;
  const coverImage = req.file
    ? req.file.filename
    : req.body["image-source"] === "web"
    ? req.body["image-web"]
    : req.body["image-source"];
  try {
    await db.updateBook(
      bookId,
      title,
      author,
      genre,
      location,
      available,
      coverImage
    );
    res.redirect("/view");
  } catch (e) {
    console.error("Lỗi cập nhật sách:", e);
    res.status(500).send("Lỗi server");
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;
  try {
    await db.deleteBook(bookId);
    res.redirect("/view");
  } catch (e) {
    console.error("Lỗi xóa sách:", e);
    res.send("Lỗi xảy ra!");
  }
};

const downloadExcel = async (req, res) => {
  try {
    const books = await db.getBooksForExcel();
    const worksheet = xlsx.utils.json_to_sheet(books);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=DSsach.xlsx"
    );
    res.send(excelBuffer);
  } catch (e) {
    console.error("Lỗi export Excel:", e);
    res.send("Lỗi xảy ra!");
  }
};

const isTypeChar = (user) => {
  return user.role === "mana" || user.role === "aDmIn";
};

module.exports = {
  getHomePage,
  getViewBooks,
  searchBooks,
  getAddBook,
  addBook,
  editBook,
  updateBook,
  deleteBook,
  downloadExcel,
};