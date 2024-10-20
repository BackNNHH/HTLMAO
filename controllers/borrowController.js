const db = require("../models/db");
const xlsx = require("xlsx");

const searchBorrow = async (req, res) => {
  const currentUser = req.session.user;
  const searchTerm = req.body.searchTerm;
  if (!isTypeChar(currentUser)) res.redirect("/view");
  if (currentUser) {
    try {
      const list = await db.searchBorrow(searchTerm);
      list.forEach(book => {
        book.borrowB = parseInt(book.borrowB.toString('hex'), 16) === 1;
        book.returnB = parseInt(book.returnB.toString('hex'), 16) === 1;
      });
      // console.log(list);
      res.render("returnBook", { chr: list, manachr: isTypeChar(currentUser) });
    } catch (e) {
      console.error("Lỗi tìm kiếm người mượn:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};
const getBorrow = async (req, res) => {
  const currentUser = req.session.user;
  if (currentUser) {
    try {
      const borrows = await db.getBorrows();
      // const borrows = await db.getBorrows();
      const BookList = await db.getBooksName();
      borrows.forEach(book => {
        book.borrowB = parseInt(book.borrowB.toString('hex'), 16) === 1;
        book.returnB = parseInt(book.returnB.toString('hex'), 16) === 1;
      });
      const result = await db.getUsers(currentUser);
      res.render("borrow", { chr: borrows, BookList, currentID: result[0].id, manachr: isTypeChar(currentUser) });
    } catch (e) {
      console.error("Lỗi lấy danh sách mượn:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const addBorrow = async (req, res) => {
  const { idUser, idBook, DayBorrow, DayReturn, borrowB } = req.body;
  console.log(req.body)
  try {
    const test = await db.getUserByID(idUser);
    if (test < 1) {
      res.status(403).json({ message: "ID người dùng không tồn tại" });
      return;
    }
    db.addBorrower(idUser, idBook, DayBorrow, DayReturn, borrowB);
    const BookList = await db.getBooksName();
    res.redirect("/borrow");
  } catch (e) {
    console.error("Lỗi thêm mượn:", e);
    res.send("Lỗi xảy ra!");
  }
};


const editBorrow = async (req, res) => {
  const currentUser = req.session.user;
  const id = req.params.id;
  if (currentUser) {
    if (!(currentUser.role === "mana" || currentUser.role === "aDmIn")) {
      res.status(403).json({ message: "Bạn không có quyền duyệt." });
      return;
    }
    try {
      await db.editBorrow(id);
      const borrows = await db.getBorrows();
      const BookList = await db.getBooksName();
      borrows.forEach(book => {
        book.borrowB = parseInt(book.borrowB.toString('hex'), 16) === 1;
        book.returnB = parseInt(book.returnB.toString('hex'), 16) === 1;
      });
      const result = await db.getUsers(currentUser);
      res.render("borrow", { chr: borrows, BookList, currentID: result[0].id, manachr: isTypeChar(currentUser) });

    } catch (e) {
      console.error("Lỗi lấy thông tin người mượn:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};
const updateBorrow = async (req, res) => {
  const currentUser = req.session.user;
  const id = req.params.id;
  if (currentUser) {
    if (!(currentUser.role === "mana" || currentUser.role === "aDmIn")) {
      res.status(403).json({ message: "Bạn không có quyền duyệt." });
      return;
    }
    try {
      await db.updateBorrow(id);
      const borrows = await db.returnBook();
      borrows.forEach(book => {
        book.borrowB = parseInt(book.borrowB.toString('hex'), 16) === 1;
        book.returnB = parseInt(book.returnB.toString('hex'), 16) === 1;
      });
      res.render("returnBook", { chr: borrows, manachr: isTypeChar(currentUser) });

    } catch (e) {
      console.error("Lỗi lấy thông tin người mượn:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};


const getReturnBook = async (req, res) => {
  const currentUser = req.session.user;
  if (currentUser) {
    if (!isTypeChar(currentUser)) res.redirect("/view");
    try {
      const list = await db.returnBook();
      list.forEach(book => {
        book.borrowB = parseInt(book.borrowB.toString('hex'), 16) === 1;
        book.returnB = parseInt(book.returnB.toString('hex'), 16) === 1;
      });
      // console.log(list);
      res.render("returnBook", { chr: list, manachr: isTypeChar(currentUser) });
    } catch (e) {
      console.error("Lỗi lấy danh sách getReturnBook:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const deleteBorrow = async (req, res) => {
  const bookId = req.params.id;
  try {
    await db.deleteBorrow(bookId);
    res.redirect("/borrow");
  } catch (e) {
    console.error("Lỗi xóa sách:", e);
    res.send("Lỗi xảy ra!");
  }
};

const downloadExcel = async (req, res) => {
  try {
    const borrows = await db.getBorrowsForExcel();
    const worksheet = xlsx.utils.json_to_sheet(borrows);
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
      "attachment; filename=DSmuon.xlsx"
    );
    res.send(excelBuffer);
  } catch (e) {
    console.error("Lỗi export Excel:", e);
    res.send("Lỗi xảy ra!");
  }
};

const isTypeChar = (user) => {
  if (user == null) return;
  return user.role === "mana" || user.role === "aDmIn";
};

module.exports = {
  searchBorrow,
  getBorrow,
  addBorrow,
  getReturnBook,
  updateBorrow,
  editBorrow,
  deleteBorrow,
  downloadExcel,
};