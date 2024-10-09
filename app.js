const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(session({
	secret: 'memaysieubeo', // Khóa bí mật cho session
	resave: false,
	saveUninitialized: false
}));
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

connection.connect((err) => {
	if (err) {
		console.error('YOU MySQL get CRINGE:', err);
	} else {
		console.log('データベースコネクト！');
	}
});


// Sử dụng EJS làm template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Cấu hình body-parser để xử lý dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));;
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.render('login');
});



app.get('/acc', (req, res) => {
	if (req.session.user) {
		connection.query('SELECT * FROM users', (e, r) => {
			if (e) {
				console.error('Lỗi truy vấn:', e);
				res.send('Lỗi xảy ra!');
			} else {
				console.log(">>acc");
				const users = r.map(user => ({
					...user,
					password: ' ͡° ͜ʖ ͡°'
				}));
				res.render('acc', { users, typechr: req.session.user.role === 'aDmIn' ? true : false });
			}
		});
	} else {
		res.redirect('/');
	}
});
app.get('/add', (req, res) => {
	if (req.session.user) {
		const images = fs.readdirSync(path.join(__dirname, 'public', 'img', 'bookic'))
			.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));

		console.log(images);
		res.render('add', { images: images });
	}
	else res.redirect('/');
});
//login bottom text
app.get('/home', (req, res) => {
	if (req.session.user) {
		connection.query('SELECT * FROM books', (err, results) => {
			if (err) {
				console.error('Lỗi truy vấn:', err);
				res.send('Lỗi xảy ra!');
			} else {
				console.log(">>home");
				res.render('home', { books: results });
			}
		});
	} else {
		res.redirect('/');
	}
});
app.get('/view', (req, res) => {
	if (req.session.user) {
		const images = fs.readdirSync(path.join(__dirname, 'public', 'img', 'bookic'))
			.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
		connection.query('SELECT * FROM books', (err, results) => {
			if (err) {
				console.error('Lỗi truy vấn:', err);
				res.send('Lỗi xảy ra!');
			} else {
				console.log(">>view");
				res.render('view', { books: results, typechr: req.session.user.role === 'aDmIn' ? true : false, images: images });
			}
		});
	} else {
		res.redirect('/');
	}
});


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, 'public', 'img', 'bookic'));
	},
	filename: (req, file, cb) => {
		const originalName = file.originalname;
		const dotIndex = originalName.lastIndexOf('.')
		const newName = originalName.substring(0, dotIndex).replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + (dotIndex !== -1 ? originalName.substring(dotIndex) : '');
		// const newName = originalName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
		// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		// cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
		// cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		cb(null, newName);
	}
});
const upload = multer({ storage: storage });

app.post('/search', (req, res) => {
	const searchTerm = req.body.searchTerm;
	const images = fs.readdirSync(path.join(__dirname, 'public', 'img', 'bookic'))
		.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
	const query = `SELECT * FROM books WHERE title LIKE '%${searchTerm}%'`;
	connection.query(query, (err, results) => {
		if (err) {
			console.error('Lỗi truy vấn:', err);
			res.send('Lỗi xảy ra!');
		} else {
			res.render('view', { books: results, images: images });
		}
	});
});
app.post('/add-book', upload.single('image-upload'), (req, res) => {
	const { title, author, genre, available } = req.body;
	const cover_image = req.file ? req.file.filename : req.body['image-source'] == 'web' ? req.body['image-web'] : null;
	console.log(cover_image);
	console.log(req.body);
	connection.query('INSERT INTO books (title, author, genre, cover_image, available) VALUES (?, ?, ?, ?, ?)',
		[title, author, genre, cover_image, available], (err, results) => {
			if (err) {
				console.error('Lỗi thêm sách:', err);
				res.send('Lỗi xảy ra!');
			} else {
				res.redirect('view');
			}
		});
});



app.post('/add-SAYGEX', (req, res) => {
	const { MaSV, HoSv, TenSv, Phai, NgaySinh, NoiSinh, MaKhoa, HocBong } = req.body;
	const newName = NgaySinh.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
	console.log(
`INSERT INTO SinhVien (MaSV, HoSV, TenSV, Phai, NgaySinh, NoiSinh, MaKhoa, HocBong)
VALUES ('${MaSV}', '${HoSv}', '${TenSv}', ${Phai}, '${newName}', '${NoiSinh}', '${MaKhoa}', ${HocBong});`);

});




app.post('/delete-book/:id', (req, res) => {
	const bookId = req.params.id;
	connection.query('DELETE FROM books WHERE id = ?', [bookId], (err, results) => {
		if (err) {
			console.error('Lỗi xóa sách:', err);
			res.send('Lỗi xảy ra!');
		} else {
			res.redirect('/view');
		}
	});
});

app.post('/scrU', (req, res) => {
	const searchTerm = req.body.searchTerm;
	const query = `SELECT * FROM users WHERE username LIKE '%${searchTerm}%'`;
	connection.query(query, (e, r) => {
		if (e) {
			console.error('Lỗi truy vấn:', e);
			res.send('Lỗi xảy ra!');
		} else {
			res.render('acc', { users: r });
		}
	});
});
app.post('/delete-user/:id', (req, res) => {
	const userId = req.params.id;
	console.log(userId);
	connection.query('SELECT role FROM users WHERE id = ?', [userId], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ message: 'Lỗi server :(' });
			return;
		} else {
			if (results[0].role === 'aDmIn') {
				res.status(403).json({ message: 'Mày không thể xoá được bố mày!' });
				return;
			} else {
				connection.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
					if (err) {
						console.error(err);
						res.status(500).json({ message: 'Error deleting user' });
						console.log(500);
					} else {
						res.send({ message: 'Đã xóa người dùng thành công' });
					}
				});
			}
		}
	});
});


// Xử lý đăng nhập
app.post('/login', (req, res) => {
	const { username, password } = req.body;
	connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
		if (err) {
			console.error('Lỗi truy vấn:', err);
			res.send('Lỗi xảy ra!');
		} else {
			if (results.length > 0) {
				req.session.user = results[0]; // Lưu thông tin người dùng vào session
				console.log("welcome..." + req.session.user.username);
				res.redirect('/home');
			} else {
				res.send('Tên người dùng hoặc mật khẩu không chính xác!');
			}
		}
	});
});

app.post('/register', (req, res) => {
	const { username, password, role } = req.body;
	const ur = req.session.user?.role || undefined;
	console.log(req.body);
	console.log(req.session.user);

	connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ message: 'DEAD FROM CRINGE' });
			console.log(500);
			return;
		}
		if (results.length > 0) {
			res.status(409).json({ message: 'Tên người dùng đã tồn tại' });
			console.log(409);
			return;
		}
		if (role === 'mana' && (ur !== 'aDmIn' && ur !== 'manager')) {
			res.status(403).json({ message: 'Bạn không có quyền tạo tài khoản manager.' });
			console.log(403);
			return;
		}

		connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], (err, result) => {
			if (err) {
				console.error(err);
				res.status(500).json('Lỗi máy chủ');
				return;
			}
			res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
			if (req.originalUrl === '/acc') res.render('acc', { users, typechr: req.session.user.role === 'aDmIn' ? true : false });
			console.log(201);
		});
	});
});
app.post('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error('Lỗi đăng xuất:', err);
			res.send('Lỗi xảy ra!');
		} else {
			res.redirect('/');
		}
	});
});


app.listen(port, () => {
	console.log(`>>>http://localhost:${port}`);
});