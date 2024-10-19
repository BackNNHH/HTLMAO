const db = require("../models/db");

const getAcc = async (req, res) => {
  const currentUser = req.session.user;
  if (currentUser) {
    try {
      const result = await db.getUsers(currentUser);
      console.log(">>acc");
      const users = result.map((user) => ({ ...user, password: " ͡° ͜ʖ ͡°" }));
      res.render("acc", {
        users,
        searchTerm:"",
        typechr: currentUser.role === "aDmIn" ? true : false,
        manachr: isTypeChar(currentUser),
      });
    } catch (e) {
      console.error("Lỗi lấy danh sách người dùng:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const register = async (req, res) => {
  const { username, name, password, role } = req.body;
  const ur = req.session.user?.role || undefined;
  try {
    const isUsernameExists = await db.checkUsernameExists(username);
    if (isUsernameExists) {
      res.status(409).json({ message: "Tên người dùng đã tồn tại" });
      return;
    }
    if (role === "mana" && ur !== "aDmIn" && ur !== "mana") {
      res.status(403).json({ message: "Bạn không có quyền tạo tài khoản manager." });
      return;
    }
    await db.registerUser(username, name, password, role);
    res.status(201).json({ success: true, message: "Đăng ký thành công!" });
  } catch (e) {
    console.error("Lỗi đăng ký:", e);
    res.status(500).json("Lỗi máy chủ");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.getUserByUsernameAndPassword(username, password);
    if (user) {
      req.session.user = user;
      console.log("welcome..." + req.session.user.username);
      // res.redirect("/home");
      res.status(200).json({ message: 'Đăng nhập thành công' });
    } else {
      res.status(409).json({ message: "Tên người dùng hoặc mật khẩu không chính xác!" });
    }
  } catch (e) {
    console.error("Lỗi đăng nhập:", e);
    res.send("Lỗi xảy ra!");
  }
};
const logout = (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      console.error("Lỗi đăng xuất:", e);
      res.send("Lỗi xảy ra!");
    } else {
      res.redirect("/");
    }
  });
};


const editUser = async (req, res) => {
  const currentUser = req.session.user;
  const id = req.params.id;
  console.log("EDIT: "+id);  if (currentUser) {
    console.log(currentUser.id != id && !isTypeChar(currentUser));
    if (currentUser.id != id && !isTypeChar(currentUser)) {
      res.status(403).json({ message: "Bạn không thể chỉnh sửa." });
      console.log(403);
      return;
    }
    try {
      const chraux = await db.getUserByID(id);
      console.log(chraux[0]);
      res.render("editUser", {
        user:chraux[0],
        manachr: isTypeChar(currentUser),
      });
    } catch (e) {
      console.error("Lỗi lấy thông tin người dùng:", e);
      res.send("Lỗi xảy ra!");
    }
  } else {
    res.redirect("/");
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, password } = req.body;
  try {
    await db.updateUser(id, name, password );
    res.redirect("/acc");
  } catch (e) {
    console.error("Lỗi cập người mượn:", e);
    res.status(500).send("Lỗi server");
  }
};


const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const currentUser = req.session.user;
  try {
    const userRole = await db.getUserRoleById(userId);
    if (userRole === "aDmIn") {
      res.status(403).json({ message: "you CAN NOT DELETE ADMIN!" });
      return;
    }
    await db.deleteUser(userId);
    res.status(201).send({ message: "Đã xóa người dùng thành công" });
    if (currentUser.id === userId) req.session.destroy();
  } catch (e) {
    console.error("Lỗi xóa người dùng:", e);
    res.status(500).json({ message: "Error deleting user" });
  }
};
const searchUser = async (req, res) => {
  const currentUser = req.session.user;
  const searchTerm = req.body.searchTerm;
  console.log(searchTerm);
  if (currentUser) {
    try {
      const users = await db.searchUser(searchTerm);
      res.render("acc", {
        users,
        searchTerm,
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
const isTypeChar = (user) => {
  return user.role === "mana" || user.role === "aDmIn";
};

module.exports = {
  getAcc,
  register,
  editUser,
  updateUser,
  login,
  logout,
  searchUser,
  deleteUser,
};