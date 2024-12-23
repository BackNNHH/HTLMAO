const mysql = require("mysql2");
const dotenv = require("dotenv");
const moment = require('moment');
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
    let query;
    if (searchTerm.startsWith('auth:')) {
      const name = searchTerm.slice(5).trim();
      query = `SELECT * FROM books WHERE author LIKE '%${name}%'`;
    } else {
      if (searchTerm.startsWith('genr:')) {
        const name = searchTerm.slice(5).trim();
        query = `SELECT * FROM books WHERE genre LIKE '%${name}%'`;
      } else {
        query = `SELECT * FROM books WHERE title LIKE '%${searchTerm}%'`;
      }
    }
    connection.query(query, (e, r) => {
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
    connection.query("SELECT id, title AS Name, genre, location, available AS Quatity FROM books", (e, r) => {
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
const getUsers = (_) => {
  return new Promise((resolve, reject) => {
    const query = _.role !== "aDmIn"
      ? `SELECT * FROM users WHERE id = ${_.id}`
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
// Hàm lasy user bằng id
const getUserByID = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM users WHERE id = ${id}`, (e, r) => {
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
// Hàm sửa người dùng
const updateUser = (id, name, password) => {
  return new Promise((resolve, reject) => {
    connection.query("UPDATE users SET name = ? WHERE id = ?",
      [name, id],
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

// Hàm đăng ký tài khoản
const registerUser = (username, name, password, role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?)",
      [username, name, password, role],
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

// Hàm tìm kiếm người dùng
const searchUser = (searchTerm) => {
  return new Promise((resolve, reject) => {
    let query;
    if (searchTerm.startsWith('name:')) {
      const name = searchTerm.slice(5).trim();
      query = `SELECT * FROM users WHERE name LIKE '%${name}%'`;
    } else {
      query = `SELECT * FROM users WHERE username LIKE '%${searchTerm}%'`;
    }
    connection.query(query, (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
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
// Hàm lấy danh sách mượn sách
const getBorrows = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT borrower.id, name, title, DayBorrow, DayReturn, borrowB, returnB FROM borrower LEFT JOIN users ON borrower.idUser = users.id LEFT JOIN books ON borrower.idBook = books.id WHERE borrowB = 0", (e, r) => {
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

// Duyệt
const editBorrow = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE borrower SET borrowB = 1, returnB = 0 WHERE id = ${id}`, (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    }
    );
  });
};
const updateBorrow = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE borrower SET borrowB = 1, returnB = 1,dayReturn = '${moment().format('YYYY-MM-DD')}' WHERE id = ${id}`, (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    }
    );
  });
};
// Hàm cập nhật thông tin người mượn
// const updateBorrow = (nameS, MS, nameB, dayM, dayT, id) => {
//   return new Promise((resolve, reject) => {
//     connection.beginTransaction((e) => {
//       if (e) reject(e);
//       connection.query(
//         "UPDATE borrow SET nameS= ?, MS= ?, nameB= ?, dayM= ?, dayT= ? WHERE id = ?",
//         [nameS, MS, nameB, dayM, dayT, id],
//         (e, r) => {
//           if (e) reject(e);
//           connection.query(
//             "UPDATE borrowhis SET nameS= ?, MS= ?, nameB= ?, dayM= ?, dayT= ? WHERE id = ?",
//             [nameS, MS, nameB, dayM, dayT, id],
//             (e, r) => {
//               if (e) reject(e);
//               connection.commit((e) => {
//                 if (e) {
//                   connection.rollback(() => {
//                     reject(e)
//                   });
//                 } resolve(r)
//               });
//             }
//           );
//         }
//       );
//     });
//   });
// };

// Hàm thêm mượn sách
const addBorrower = (idUser, idBook, DayBorrow, DayReturn, borrowB) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO borrower (idUser, idBook, DayBorrow, DayReturn) VALUES (?, ?, ?, ?)",
      [idUser, idBook, DayBorrow, DayReturn, borrowB],
      (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      }
    );
  });
};//remove....
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
const deleteBorrow = (id) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM borrower WHERE id = ?", [id], (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};

// Hàm lấy danh sách trả
const returnBook = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT borrower.id, name, title, DayBorrow, DayReturn, borrowB, returnB FROM borrower LEFT JOIN users ON borrower.idUser = users.id LEFT JOIN books ON borrower.idBook = books.id", (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
};

const searchBorrow = (searchTerm) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT borrower.id, name, title, DayBorrow, DayReturn, borrowB, returnB FROM borrower LEFT JOIN users ON borrower.idUser = users.id LEFT JOIN books ON borrower.idBook = books.id WHERE name LIKE '%${searchTerm}%'`, (e, r) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    }
    );
  });
};
// Hàm lấy danh sách mượn sách cho export Excel
const getBorrowsForExcel = () => {
  return new Promise((resolve, reject) => {//id, nameS AS 'Tên Người Mượn', MS AS Mã, dayM AS 'Ngày Mượn', dayT AS 'Ngày Trả'
    connection.query("SELECT borrower.id, name, title, DayBorrow, DayReturn, borrowB, returnB FROM borrower LEFT JOIN users ON borrower.idUser = users.id LEFT JOIN books ON borrower.idBook = books.id", (e, r) => {
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

  searchUser,
  getUsers,
  getUserByID,
  checkUsernameExists,
  registerUser,
  getUserByUsernameAndPassword,
  getUserRoleById,
  updateUser,
  deleteUser,

  getBorrows,
  addBorrower,
  getBorrowById,
  editBorrow,
  updateBorrow,
  deleteBorrow,
  returnBook,
  getBorrowsForExcel,
};