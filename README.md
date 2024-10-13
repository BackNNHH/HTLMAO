# Ứng dụng quản lý thư viện trực tuyến

## Databases

### desc Books

| Field       | Type         | Null | Key | Default | Extra          |
| ----------- | ------------ | ---- | --- | ------- | -------------- |
| id          | int          | NO   | PRI | NULL    | auto_increment |
| title       | varchar(255) | NO   |     | NULL    |                |
| author      | varchar(255) | NO   |     | NULL    |                |
| genre       | varchar(255) | NO   |     | NULL    |                |
| description | text         | YES  |     | NULL    |                |
| cover_image | varchar(255) | YES  |     | empty   |                |
| available   | tinyint(1)   | YES  |     | 1       |                |

### Users databases

| id  | username | password    | role   |
| --- | -------- | ----------- | ------ |
| 1   | admin    | :trollface: | ăc min |
| ... | ...      | :trollface: | mana   |
| ... | ...      | :trollface: | norm   |

## Stru

```
HTLMAO/:
├─BACKUP/
│ └─...
├─node_modules/
│ └─(.gitignore)
├─Public/
│ ├─img/
│ │ └─...
│ ├─icon.png
│ ├─scrIco.js
│ └─styles.css
├─views/
| ├─acc.ejs
| ├─EDIT.ejs
| ├─homes.ejs
| ├─login.ejs
| └─view.ejs
├─.env
├─.gitignore
├─app.js
├─package-lock.json
├─package.json
└─README.md
```

## MySQL 8.4 Command Line Client

`CREATE DATABASE web_login;`

`use web_login`

```
CREATE TABLE books (
  id INT AUTO_INCREMENT
  PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(255) DEFAULT 'empty',
  available TINYINT(1) DEFAULT 1
);
```

```
CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT 'normal'
);
```
