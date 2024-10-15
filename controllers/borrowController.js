const db = require("../models/db");

const searchBorrow = async (req, res) => {
  const currentUser = req.session.user;
  const searchTerm = req.body.searchTerm;
  if (currentUser) {
    try {
      const chr = await db.searchBorrow(searchTerm);
      res.render("borrow", {
        chr,
        manachr: isTypeChar(currentUser),
      });
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
    if (!isTypeChar(currentUser)) res.redirect("/view");
    try {
      const borrows = await db.getBorrows();
      res.render("borrow", { chr: borrows, manachr: isTypeChar(currentUser) });
    } catch (e) {
      console.error("Lỗi lấy danh sách mượn:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const addBorrow = async (req, res) => {
  const { nameS, MS, nameB, dayM, dayT } = req.body;
  const dayTr = dayT ? dayT : null;
  try {
    await db.addBorrow(nameS, MS, nameB, dayM, dayTr);
    res.redirect("/borrow");
  } catch (e) {
    console.error("Lỗi thêm mượn:", e);
    res.send("Lỗi xảy ra!");
  }
};


const editBorrow = async (req, res) => {
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
    try {
      const chraux = await db.getBorrowById(AxuId);
      console.log(chraux);
      res.render("borrowEdit", {
        chraux,
        manachr: isTypeChar(currentUser),
      });
    } catch (e) {
      console.error("Lỗi lấy thông tin người mượn:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const updateBorrow = async (req, res) => {
  const bookId = req.params.id;
  const { nameS, MS, nameB, dayM, dayT } = req.body;
  const dayTr = dayT ? dayT : null;
  try {
    await db.updateBorrow(nameS, MS, nameB, dayM, dayTr);
    res.redirect("/view");
  } catch (e) {
    console.error("Lỗi cập người mượn:", e);
    res.status(500).send("Lỗi server");
  }
};
const getBorrowHis = async (req, res) => {
  const currentUser = req.session.user;
  if (currentUser) {
    try {
      const borrows = await db.getBorrowHis();
      res.render("borrowhis", { chr: borrows, manachr: isTypeChar(currentUser) });
    } catch (e) {
      console.error("Lỗi lấy danh sách mượn lịch sử:", e);
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
  return user.role === "mana" || user.role === "aDmIn";
};

module.exports = {
  searchBorrow,
  getBorrow,
  addBorrow,
  getBorrowHis,
  updateBorrow,
  editBorrow,
  deleteBorrow,
  downloadExcel,
};