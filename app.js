const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
// const routes = require("./routes/index");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Cấu hình session
app.use(
	session({
		secret: "memaysieubeo",
		resave: false,
		saveUninitialized: false,
	})
);

// Cấu hình body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cấu hình multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "public", "img", "bookic"));
	},
	filename: (req, file, cb) => {
		const originalName = file.originalname;
		const dotIndex = originalName.lastIndexOf(".");
		const newName =
			originalName
				.substring(0, dotIndex)
				.replace(/[^a-zA-Z0-9]/g, "")
				.toLowerCase() +
			(dotIndex !== -1 ? originalName.substring(dotIndex) : "");
		cb(null, newName);
	},
});
const upload = multer({ storage: storage });

// Sử dụng EJS làm template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// Sử dụng các route
const bookController = require("./controllers/bookController");
const userController = require("./controllers/userController");
const borrowController = require("./controllers/borrowController");


// Routes cho sách
app.get("/", (req, res) => { res.render("login"); });
app.get("/home", bookController.getHomePage); // Trang chủ
app.get("/view", bookController.getViewBooks); // Danh sách sách
app.post("/search", bookController.searchBooks); // Tìm kiếm sách
app.get("/add", bookController.getAddBook); // Thêm sách
app.post("/add-book", upload.single("image-upload"), bookController.addBook); // Xử lý thêm sách
app.post("/edit/:id", bookController.editBook); // Chỉnh sửa sách
app.post("/update-book/:id", upload.single("image-upload"), bookController.updateBook); // Cập nhật sách
app.post("/delete-book/:id", bookController.deleteBook); // Xóa sách

// Routes cho mượn sách
app.get("/borrow", borrowController.getBorrow); // Danh sách mượn
app.post("/search-borrow", borrowController.searchBorrow);  // Tìm
app.post("/add-chr", borrowController.addBorrow); // Danh sách sách
// app.post("/edit-chr/:id", borrowController.editBorrow); // Chỉnh sửa người mượn
app.post("/edit-chr/:id", borrowController.editBorrow); // duyệt người mượn
app.post("/update-chr/:id", borrowController.updateBorrow); // Cập nhật người mượn
app.post("/delete-chr/:id", borrowController.deleteBorrow); // Xóa
// Routes cho trả sách
app.get("/returnBook", borrowController.getReturnBook); // Danh sách trar

// Routes cho người dùng
app.get("/acc", userController.getAcc); // Danh sách người dùng
app.post("/register", userController.register); // Đăng ký tài khoản
app.post("/edit-user/:id", userController.editUser); // Chỉnh sửa 
app.post("/login", userController.login); // Đăng nhập tài khoản
app.post("/scrU", userController.searchUser); // Tìm kiếm
app.post("/logout", userController.logout); // Đăng xuất
app.post("/update-user/:id", userController.updateUser); // Đăng xuất
app.post("/delete-user/:id", userController.deleteUser); // Xóa người dùng

// Routes cho export Excel
app.get("/download", bookController.downloadExcel); // Export sách
app.get("/downBor", borrowController.downloadExcel); // Export mượn

app.listen(port, () => {
	console.log(
		`⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣ ‧₊˚✧⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣\n>>>>>> http://localhost:${port} \n>>LAN: http://192.168.1.32:${port} (HOST ONLY! Maybeisnotcorret)\n⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣ ‧₊˚✧⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣`
	);
});