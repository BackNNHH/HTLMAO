const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const xlsx = require('xlsx');
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

connection.connect((e) => {
	if (e) console.error('YOUr MySQL get CRINGE: ', e);
	else {
		// console.log('データベースコネクト！');
		console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣤⣤⣤⣤⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣿⣶⣄⡀⢀⣠⣶⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣠⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⠀⠀⠀\n⠀⠀⠀⠀⠀⣿⣶⣤⣄⣉⣉⠙⠛⠛⠛⠛⠛⠛⠋⣉⣉⣠⣤⣶⣿⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠂⠀⠀\n⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠉⢛⣿⣿⣿⣿⣿⣿⣶⣄⠀\n⠀⠀⠀⠀⠀⣄⡉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠛⢉⣠⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣁⠀⠻⣿⡿⠛⠁⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⣿⣿⣿⣶⣶⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣶⣶⣿⣿⣿⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠈⠀⣀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⠀\n⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⠀⠀⠀\n⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀\n⠀⠀⠀⠀⠀⣶⣤⣈⡉⠛⠛⠻⠿⠿⠿⠿⠿⠿⠟⠛⠛⢉⣁⣤⣶⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀\n⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠿⣿⠿⠋⠁⠈⠙⠿⣿⠿⠃⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠙⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠋⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠛⠛⠛⠛⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀`);
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

//////////////////////////////////
// code...
//////////////////////////////////////////////////////////////
app.get('/acc', (req, res) => {
	if (req.session.user) {
		const query = req.session.user.role != 'aDmIn'
			? `SELECT * FROM users WHERE id = ${req.session.user.id}`
			: `SELECT * FROM users`;
		connection.query(query, (e, r) => {
			if (e) {
				console.error('Lỗi truy vấn:', e);
				res.send('Lỗi xảy ra!');
			} else {
				console.log(">>acc");
				const users = r.map(user => ({ ...user, password: ' ͡° ͜ʖ ͡°' }));
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
		connection.query('SELECT * FROM books', (e, results) => {
			if (e) {
				console.error('Lỗi truy vấn:', e);
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
	const rsu = req.session.user
	if (rsu) {
		const images = fs.readdirSync(path.join(__dirname, 'public', 'img', 'bookic'))
			.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
		connection.query('SELECT * FROM books', (e, r) => {
			if (e) {
				console.error('Lỗi truy vấn:', e);
				res.send('Lỗi xảy ra!');
			} else {
				console.log(">>view");
				res.render('view', { books: r, typechr: rsu.role === 'aDmIn' ? true : false, manachr: rsu.role === 'mana' || rsu.role === 'aDmIn' ? true : false, images: images });
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

app.post('/edit/:id', (req, res) => {
	const rsu = req.session.user
	const AxuId = req.params.id;
	if (rsu) {
		if (!(rsu.role === 'mana' || rsu.role === 'aDmIn')) {
			res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa.' });
			console.log(403);
			return;
		}
		const images = fs.readdirSync(path.join(__dirname, 'public', 'img', 'bookic'))
			.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
		connection.query('SELECT * FROM books WHERE id = ?', [AxuId], (e, r) => {
			if (e) {
				console.error('Lỗi truy vấn:', e);
				res.send('Lỗi xảy ra!');
			} else {
				console.log(">>EDIT");
				console.log(r);
				res.render('EDIT', { book: r, AxuId, images: images });
			}
		});
	} else {
		res.redirect('/');
	}
});

app.post('/search', (req, res) => {
	const rsu = req.session.user;
	const searchTerm = req.body.searchTerm;
	if (rsu) {
		const images = fs.readdirSync(path.join(__dirname, 'public', 'img', 'bookic'))
			.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
		const query = `SELECT * FROM books WHERE title LIKE '%${searchTerm}%'`;
		connection.query(query, (e, results) => {
			if (e) {
				console.error('Lỗi truy vấn:', e);
				res.send('Lỗi xảy ra!');
			} else {
				console.log(">>view(sear)");
				res.render('view', { books: results, typechr: rsu.role === 'aDmIn' ? true : false, manachr: rsu.role === 'mana' || rsu.role === 'aDmIn' ? true : false, images: images });
			}
		});
	} else {
		res.redirect('/');
	}
});

app.post('/add-book', upload.single('image-upload'), (req, res) => {
	const { title, author, genre, available } = req.body;
	const cover_image = req.file ? req.file.filename : req.body['image-source'] == 'web' ? req.body['image-web'] : 'empty.jpg';
	console.log(cover_image);
	console.log(req.body);
	connection.query('INSERT INTO books (title, author, genre, cover_image, available) VALUES (?, ?, ?, ?, ?)',
		[title, author, genre, cover_image, available], (e, results) => {
			if (e) {
				console.error('Lỗi thêm sách:', e);
				res.send('Lỗi xảy ra!');
			} else {
				res.redirect('view');
			}
		});
});

app.post('/edit-book/:id', upload.single('image-upload'), (req, res) => {
	const bookId = req.params.id;
	const { title, author, genre, available } = req.body;
	const cover_image = req.file ? req.file.filename : req.body['image-source'] == 'web' ? req.body['image-web'] : req.body['image-source'];
	connection.query('UPDATE books SET title = ?, author = ?, genre = ?, available = ?, cover_image = ? WHERE id = ?', [title, author, genre, available, cover_image, bookId], (e, results) => {
		if (e) {
			console.error('Lỗi cập nhật database:', e);
			res.status(500).send('Lỗi server');
			return;
		}
		console.log(req.body);
		console.log(cover_image);
		res.redirect('/view');
	});
});

app.post('/delete-book/:id', (req, res) => {
	const bookId = req.params.id;
	connection.query('DELETE FROM books WHERE id = ?', [bookId], (e, results) => {
		if (e) {
			console.error('Lỗi xóa sách:', e);
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
	connection.query('SELECT role FROM users WHERE id = ?', [userId], (e, results) => {
		if (e) {
			console.error(e);
			res.status(500).json({ message: 'Lỗi server :(' });
			return;
		} else {
			if (results[0].role === 'aDmIn') {
				res.status(403).json({ message: 'you CAN NOT DELETE ADMIN!' });
				return;
			} else {
				connection.query('DELETE FROM users WHERE id = ?', [userId], (e, results) => {
					if (e) {
						console.error(e);
						res.status(500).json({ message: 'Error deleting user' });
						console.log(500);
					} else {
						res.send({ message: 'Đã xóa người dùng thành công' });
						if (req.session.user.id == userId) req.session.destroy();
					}
				});
			}
		}
	});
});
app.get('/download', (req, res) => {
	connection.query('SELECT id, title AS Name, genre, available AS Quatity FROM books', (e, r) => {
		if (e) throw e;
		const worksheet = xlsx.utils.json_to_sheet(r);
		const workbook = xlsx.utils.book_new();
		xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
		res.send(excelBuffer);
	});
});

// Xử lý đăng nhập
app.post('/login', (req, res) => {
	const { username, password } = req.body;
	connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (e, results) => {
		if (e) {
			console.error('Lỗi truy vấn:', e);
			res.send('Lỗi xảy ra!');
		} else {
			if (results.length > 0) {
				req.session.user = results[0];
				console.log("welcome..." + req.session.user.username);
				res.redirect('/home');
			} else {
				res.status(409).json({ message: 'Tên người dùng hoặc mật khẩu không chính xác!' });
			}
		}
	});
});

app.post('/register', (req, res) => {
	const { username, password, role } = req.body;
	const ur = req.session.user?.role || undefined;
	// console.log(req.body);
	// console.log(req.session.user);

	connection.query('SELECT * FROM users WHERE username = ?', [username], (e, results) => {
		if (e) {
			console.error(e);
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

		connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], (e, result) => {
			if (e) {
				console.error(e);
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
	req.session.destroy((e) => {
		if (e) {
			console.error('Lỗi đăng xuất:', e);
			res.send('Lỗi xảy ra!');
		} else {
			res.redirect('/');
		}
	});
});

app.listen(port, () => { console.log(`⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣ ‧₊˚✧⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣\n>>>>>> http://localhost:${port} \n>>LAN: http://192.168.1.32:${port} (HOST ONLY! Maybeisnotcorret)\n⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣ ‧₊˚✧⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣⌣`); });