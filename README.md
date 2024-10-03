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

| id  | username | password    |
| --- | -------- | ----------- |
| 1   | admin    | :trollface: |

## Stru

```
HTLMAO/:
├─BACKUP/
│ │...
├─node_modules/
│ └─(.gitignore)
├─Public/
│ ├─img/
│ │ └─...
│ ├─icon.png
│ └─styles.css
├─views/
| ├─homes.ejs
| └─login.ejs
├─.env
├─.gitignore
├─app.js
├─package-lock.json
├─package.json
└─README.md
```
