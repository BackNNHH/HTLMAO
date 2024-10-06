const express = require('express');
const mysql = require('mysql2');
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
				const users = r.map(user => ({
					...user,
					password: ' ͡° ͜ʖ ͡°'
				}));
				res.render('acc', { users });
			}
		});
	} else {
		res.redirect('/');
	}
});
app.get('/add', (req, res) => {
	if (req.session.user) res.render('add');
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
				res.render('home', { books: results });
			}
		});
	} else {
		res.redirect('/');
	}
});
app.get('/view', (req, res) => {
	if (req.session.user) {
		connection.query('SELECT * FROM books', (err, results) => {
			if (err) {
				console.error('Lỗi truy vấn:', err);
				res.send('Lỗi xảy ra!');
			} else {
				res.render('view', { books: results });
			}
		});
	} else {
		res.redirect('/');
	}
});





app.post('/search', (req, res) => {
	const searchTerm = req.body.searchTerm;
	const query = `SELECT * FROM books WHERE title LIKE '%${searchTerm}%'`;
	connection.query(query, (err, results) => {
		if (err) {
			console.error('Lỗi truy vấn:', err);
			res.send('Lỗi xảy ra!');
		} else {
			res.render('view', { books: results });
		}
	});
});
app.post('/add-book', (req, res) => {
	const title = req.body.title;
	const author = req.body.author;
	const genre = req.body.genre;
	const description = req.body.description;
	const cover_image = req.body.cover_image;
	const available = req.body.available;
	connection.query('INSERT INTO books (title, author, genre, description, cover_image, available) VALUES (?, ?, ?, ?, ?, ?)',
		[title, author, genre, description, cover_image, available], (err, results) => {
			if (err) {
				console.error('Lỗi thêm sách:', err);
				res.send('Lỗi xảy ra!');
			} else {
				res.redirect('/add');
			}
		});
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
			return res.status(500).json({ message: 'Lỗi server' });
		} else {
			if (results[0].role === 'aDmIn') {
				return res.status(403).json('You cannot delete an admin user');
			} else {
				connection.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
					if (err) {
						console.error(err);
						res.status(500).json('Error deleting user');
						console.log(500);
					} else {
						res.send('User deleted successfully');
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
				console.log(req.session.user);
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