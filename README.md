# Ứng dụng quản lý thư viện trực tuyến



## Booksd atabases
| Field       | Type         | Null | Key | Default | Extra          |
|-------------|--------------|------|-----|---------|----------------|
| id          | int          | NO   | PRI | NULL    | auto_increment |
| title       | varchar(255) | NO   |     | NULL    |                |
| author      | varchar(255) | NO   |     | NULL    |                |
| genre       | varchar(255) | NO   |     | NULL    |                |
| description | text         | YES  |     | NULL    |                |
| cover_image | varchar(255) | YES  |     | NULL    |                |
| available   | tinyint(1)   | YES  |     | 1       |                |

