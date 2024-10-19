# Ứng dụng quản lý thư viện trực tuyến

Ứng dụng được thiết kế để quản lý sách, người dùng và mượn sách trong một thư viện.

## Databases

### desc Books

| Field       | Type         | Null | Key | Default | Extra          |
| ----------- | ------------ | ---- | --- | ------- | -------------- |
| id          | int          | NO   | PRI | NULL    | auto_increment |
| title       | varchar(255) | NO   |     | NULL    |                |
| author      | varchar(255) | NO   |     | NULL    |                |
| genre       | varchar(255) | NO   |     | NULL    |                |
| cover_image | varchar(255) | YES  |     | empty   |                |
| location    | varchar(255) | YES   |     | NULL    |                |
| available   | tinyint(1)   | YES  |     | 1       |                |

### desc Borrower

| Field     | Type         | Null | Key | Default | Extra          |
| --------- | ------------ | ---- | --- | ------- | -------------- |
| id        | int          | NO   | PRI | NULL    | auto_increment |
| idUser    | int unsigned | YES  | MUL | NULL    |                |
| idBook    | int unsigned | YES  | MUL | NULL    |                |
| DayBorrow | date         | YES  |     | NULL    |                |
| DayReturn | date         | YES  |     | NULL    |                |
| borrowB   | bit(1)       | YES  |     | b'0'    |                |
| returnB   | bit(1)       | YES  |     | b'0'    |                |

### desc Users

| Field    | Type         | Null | Key | Default | Extra          |
| -------- | ------------ | ---- | --- | ------- | -------------- |
| id       | int unsigned | NO   | PRI | NULL    | auto_increment |
| username | varchar(255) | NO   | UNI | NULL    |                |
| password | varchar(255) | NO   |     | NULL    |                |
| role     | varchar(255) | YES  |     | normal  |                |
| name     | varchar(255) | YES  |     | NULL    |                |

### Users databases

| id  | username | password    | role  |
| --- | -------- | ----------- | ----- |
| 1   | admin    | :trollface: | aDmIn |
| ... | ...      | :trollface: | mana  |
| ... | ...      | :trollface: | norm  |

- aDmIn: là Admin, Quản trị viên
- mana: là Manager, quản lý
- norm: là Normal, tức là User bình thường

## Structure

Mô hình MVC: Ứng dụng được xây dựng theo kiến trúc MVC (Model-View-Controller).

- Model: Xử lý tương tác với cơ sở dữ liệu (model/db.js, bookModel.js).

- View: Hiển thị giao diện người dùng (views/\*.ejs).

- Controller: Xử lý logic nghiệp vụ và tương tác với model và view (app.js).

```
HTLMAO/:
├─CACHE/
│ └─...
├─Controller/
│ ├─bookController.js
│ ├─borrowController.js
│ └─userController.js
├─models/
│ ├─bookModel.js
│ └─db.js
├─node_modules/
│ └─(.gitignore)
├─Public/
│ ├─img/
│ │ ├─bookic/
│ │ │ └─...
│ │ └─...
│ ├─icon.png
│ ├─scrIco.js
│ └─styles.css
├─views/
│ ├─acc.ejs
│ ├─bookEdit.ejs
│ ├─borrow.ejs
│ ├─borrowEdit.ejs
│ ├─editUser.ejs
│ ├─EDIT.ejs
│ ├─home.ejs
│ ├─login.ejs
│ ├─returnBook.ejs
│ └─view.ejs
├─.env
├─.gitignore
├─app.js
├─package-lock.json
├─package.json
└─README.md
```

## MySQL 8.4 Command Line Client

`CREATE DATABASE web_login;`

`use web_login;`

```
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT 'normal',
  name VARCHAR(255)
);
```

```
CREATE TABLE books (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL,
  cover_image VARCHAR(255) DEFAULT 'empty',
  location VARCHAR(255),
  available TINYINT(1) DEFAULT 1
);
```

```
CREATE TABLE borrower (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idUser INT UNSIGNED,
  idBook INT UNSIGNED,
  DayBorrow DATE,
  DayReturn DATE,
  borrowB BIT(1) DEFAULT b'0',
  returnB BIT(1) DEFAULT b'0',
  FOREIGN KEY (idUser) REFERENCES Users(id),
  FOREIGN KEY (idBook) REFERENCES Books(id)
);
```

`INSERT INTO users (username, name, password, role) 
VALUES ('admin', 'Admin User', 'password123', 'aDmIn');`
