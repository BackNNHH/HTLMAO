const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Kết nối database
connection.connect((e) => {
  if (e) console.error("YOUr MySQL get CRINGE: ", e);
  else {
    console.log("Kết nối database thành công");
    console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣤⣤⣤⣤⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣿⣶⣄⡀⢀⣠⣶⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣠⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⠀⠀⠀\n⠀⠀⠀⠀⠀⣿⣶⣤⣄⣉⣉⠙⠛⠛⠛⠛⠛⠛⠋⣉⣉⣠⣤⣶⣿⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠂⠀⠀\n⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠉⢛⣿⣿⣿⣿⣿⣿⣶⣄⠀\n⠀⠀⠀⠀⠀⣄⡉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠛⢉⣠⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣁⠀⠻⣿⡿⠛⠁⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⣿⣿⣿⣶⣶⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣶⣶⣿⣿⣿⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠈⠀⣀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⠀\n⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⠀⠀⠀\n⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀\n⠀⠀⠀⠀⠀⣶⣤⣈⡉⠛⠛⠻⠿⠿⠿⠿⠿⠿⠟⠛⠛⢉⣁⣤⣶⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀\n⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠿⣿⠿⠋⠁⠈⠙⠿⣿⠿⠃⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠙⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠋⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠛⠛⠛⠛⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀`);
  }
});
/********************************************************
*   e: error                                            *
*   r: result                                           *
*********************************************************/

//--------------------------------------------------------
//BOOK
//--------------------------------------------------------
// Hàm lấy danh sách sách
const getBooks = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM books", (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};
const getBooksName = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT id, title FROM books", (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};

// Hàm tìm kiếm sách
const searchBooks = (searchTerm) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM books WHERE title LIKE '%${searchTerm}%'`, (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    }
    );
  });
};

// Hàm thêm sách
const addBook = (title, author, genre, location, coverImage, available) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO books (title, author, genre, location, cover_image, available) VALUES (?, ?, ?, ?, ?, ?)",
      [title, author, genre, location, coverImage, available],
      (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      }
    );
  });
};

// Hàm lấy thông tin sách theo id
const getBookById = (bookId) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM books WHERE id = ?", [bookId], (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r[0]);
      }
    });
  });
};

// Hàm cập nhật thông tin sách
const updateBook = (bookId, title, author, genre, location, available, coverImage) => {
  return new Promise((resolve, reject) => {
    connection.query("UPDATE books SET title = ?, author = ?, genre = ?, location = ?, available = ?, cover_image = ? WHERE id = ?",
      [title, author, genre, location, available, coverImage, bookId],
      (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      }
    );
  });
};

// Hàm xóa sách
const deleteBook = (bookId) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM books WHERE id = ?", [bookId], (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};

// Hàm lấy danh sách sách cho export Excel
const getBooksForExcel = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT id, title AS Name, genre, available AS Quatity FROM books", (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    }
    );
  });
};

//--------------------------------------------------------
//USERS
//--------------------------------------------------------
// Hàm lấy danh sách người dùng
const getUsers = (role) => {
  return new Promise((resolve, reject) => {
    const query = role !== "aDmIn"
      ? `SELECT * FROM users WHERE id = ${role}`
      : `SELECT * FROM users`;
    connection.query(query, (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};

// Hàm kiểm tra tên người dùng đã tồn tại hay chưa
const checkUsernameExists = (username) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r.length > 0);
        }
      }
    );
  });
};

// Hàm đăng ký tài khoản
const registerUser = (username, password, role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role],
      (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      }
    );
  });
};

// Hàm lấy thông tin người dùng theo username và password
const getUserByUsernameAndPassword = (username, password) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r[0]);
        }
      }
    );
  });
};

// Hàm lấy role của người dùng theo id
const getUserRoleById = (userId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT role FROM users WHERE id = ?",
      [userId],
      (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r[0].role);
        }
      }
    );
  });
};

// Hàm xóa người dùng
const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM users WHERE id = ?",
      [userId],
      (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      }
    );
  });
};

//--------------------------------------------------------
//BORROW
//--------------------------------------------------------
// Hàm lấy danh sách mượn sách// Hàm tìm kiếm sách
const searchBorrow = (searchTerm) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM borrow WHERE nameS LIKE '%${searchTerm}%'`, (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    }
    );
  });
};
const getBorrows = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM borrow", (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};
// Hàm lấy thông tin người mượn theo id
const getBorrowById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT id, nameS, MS, nameB, DATE_FORMAT(dayM, '%Y-%m-%d')AS dayM, DATE_FORMAT(dayT, '%Y-%m-%d')AS dayT  FROM borrow WHERE id = ?", [id], (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r[0]);
      }
    });
  });
};

// Hàm cập nhật thông tin người mượn
const updateBorrow = (id, nameS, MS, nameB, dayM, dayT) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((e) => {
      if (e) reject(e);
      connection.query(
        "UPDATE borrow SET nameS= ?, MS= ?, nameB= ?, dayM= ?, dayT= ? WHERE id = ?",
        [nameS, MS, nameB, dayM, dayT, id],
        (e, r) => {
          if (e) reject(e);
          connection.query(
            "UPDATE borrowhis SET nameS= ?, MS= ?, nameB= ?, dayM= ?, dayT= ? WHERE id = ?",
            [nameS, MS, nameB, dayM, dayT, id],
            (e, r) => {
              if (e) reject(e);
              connection.commit((e) => {
                if (e) {
                  connection.rollback(() => {
                    reject(e)
                  });
                } resolve(r)
              });
            }
          );
        }
      );
    });
  });
};

// Hàm thêm mượn sách
const addBorrow = (nameS, MS, nameB, dayM, dayT) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((e) => {
      if (e) reject(e);
      connection.query(
        "INSERT INTO borrow (nameS, MS, nameB, dayM, dayT) VALUES (?, ?, ?, ?, ?)",
        [nameS, MS, nameB, dayM, dayT],
        (e, r) => {
          if (e) reject(e);
          connection.query(
            "INSERT INTO borrowhis (nameS, MS, nameB, dayM, dayT) VALUES (?, ?, ?, ?, ?)",
            [nameS, MS, nameB, dayM, dayT],
            (e, r) => {
              if (e) reject(e);
              connection.commit((e) => {
                if (e) {
                  connection.rollback(() => {
                    reject(e)
                  });
                }
                resolve(r);
              });
            }
          );
        }
      );
    });
  });
};
// Hàm xóa mượn sách
const deleteBorrow = (bookId) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM borrow WHERE id = ?", [bookId], (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};

// Hàm lấy danh sách mượn lịch sử
const getBorrowHis = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM borrowhis", (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};

// Hàm lấy danh sách mượn sách cho export Excel
const getBorrowsForExcel = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT id, nameS AS 'Tên Người Mượn', MS AS Mã, dayM AS 'Ngày Mượn', dayT AS 'Ngày Trả' FROM borrow", (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    }
    );
  });
};

module.exports = {
  searchBorrow,
  getBooks,
  getBooksName,
  searchBooks,
  addBook,
  getBookById,
  updateBook,
  deleteBook,
  getBooksForExcel,

  getUsers,
  checkUsernameExists,
  registerUser,
  getUserByUsernameAndPassword,
  getUserRoleById,
  deleteUser,

  getBorrows,
  addBorrow,
  getBorrowById,
  updateBorrow,
  deleteBorrow,
  getBorrowHis,
  getBorrowsForExcel,
};