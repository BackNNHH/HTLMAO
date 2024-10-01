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
app.use(bodyParser.urlencoded({ extended: true }));

// Trang đăng nhập
app.get('/', (req, res) => {
  res.render('login');
});

// Xử lý đăng nhập
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      res.send('Lỗi xảy ra!');
    } else {
      if (results.length > 0) {
        req.session.user = results[0]; // Lưu thông tin người dùng vào session
        res.redirect('/home'); // Chuyển hướng đến trang chủ
      } else {
        res.send('Tên người dùng hoặc mật khẩu không chính xác!');
      }
    }
  });
});
// Xử lý đăng xuất
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

// Trang chủ
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

// Xử lý thêm sách
app.post('/add-book', (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const genre = req.body.genre;
  const description = req.body.description;
  const cover_image = req.body.cover_image;
  const available = req.body.available;

  // Thêm sách vào database
  connection.query('INSERT INTO books (title, author, genre, description, cover_image, available) VALUES (?, ?, ?, ?, ?, ?)',
                                      [title, author, genre, description, cover_image, available], (err, results) => {
    if (err) {
      console.error('Lỗi thêm sách:', err);
      res.send('Lỗi xảy ra!');
    } else {
      res.redirect('/home');
    }
  });
});

// Xử lý xóa sách
app.post('/delete-book/:id', (req, res) => {
  const bookId = req.params.id;
  connection.query('DELETE FROM books WHERE id = ?', [bookId], (err, results) => {
    if (err) {
      console.error('Lỗi xóa sách:', err);
      res.send('Lỗi xảy ra!');
    } else {
      res.redirect('/home');
    }
  });
});




app.listen(port, () => {
  console.log(`>>>http://localhost:${port}`);
});