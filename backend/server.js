const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();

const PORT = 5000;
const crypto = require("crypto");

var key = "abcdefghijklmnopqrstuvwx";

var encrypt = crypto.createCipheriv("des-ede3", key, "");

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});

// new user signup
app.post("/signup", (req, res) => {
  const user = req.body;
  const password = user.password;
  var encrypt = crypto.createCipheriv("des-ede3", key, "");

  var theCipher = encrypt.update(password, "utf8", "base64");

  theCipher += encrypt.final("base64");

  console.log(theCipher);
  // let encryptedData = cipher.update(user.password, "utf-8", "hex");

  // encryptedData += cipher.final("hex");
  let insertQuery = `insert into signin(name,email,password)
    values('${user.name}', '${user.email}', '${theCipher}') `;
  pool.query(insertQuery, (err, res) => {
    if (!err) {
      console.log("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

//login verification
app.post("/login", (req, res) => {
  const user = req.body;
  const email = user.email;
  const password = user.password;

  let passQuery = `Select password from signin where email = '${email}'`;
  pool.query(passQuery, (err, result1) => {
    console.log(result1);
    let passdb = result1.rows[0].password;

    var decrypt = crypto.createDecipheriv("des-ede3", key, "");
    var s = decrypt.update(passdb, "base64", "utf8");
    var decryptedData = s + decrypt.final("utf8");

    //     let decryptedData = decipher.update(passdb, "hex", "utf-8");

    // decryptedData = decipher.final("utf8");
    if (decryptedData == password) {
      res.send({
        sucess: "True",
        password: result1.rows[0].password,
      });
    } else {
      res.send({
        sucess: "False",
      });
    }
  });
});

//insert new income and update budget
app.post("/insert-income", (req, res) => {
  const user = req.body;
  let insertQuery = `insert into income_history (user_id,income_source,amount,date) values('${user.userId}','${user.text}','${user.amount}',CURRENT_DATE) `;
  pool.query(insertQuery, (err, res) => {
    if (!err) {
      console.log(
        "Insertion was successful income was inserted in income history"
      );
    } else {
      console.log(err.message);
    }
  });
  let selectQuery = `select count(*) from budget where user_id='${user.userId}'`;
  pool.query(selectQuery, (err, result) => {
    if (!err) {
      console.log("inside if");
      if (result.rows[0].count == 0) {
        console.log("nested if");
        let inQuery = `insert into budget(user_id, available_bal, income, expense)
                            values('${user.userId}', '${user.amount}', '${user.amount}', 0) `;
        pool.query(inQuery, (err, result1) => {
          if (!err) {
            res.send(
              "Insertion was successful into budget table first time user"
            );
          } else {
            console.log(err.message);
          }
        });
      } else {
        console.log("nested else");
        let updateQuery = `update budget set available_bal = income+'${user.amount}'-expense, income = income+'${user.amount}' where user_id='${user.userId}'`;
        pool.query(updateQuery, (err, res) => {
          if (!err) {
            console.log("Update was successful budget table");
          } else {
            console.log(err.message);
          }
        });
      }
    }
  });
  pool.end;
});

//insert new expense and update budget
app.post("/insert-expense", (req, res) => {
  const user = req.body;
  const amount = req.body.amount * -1;
  let selectQuery = `select count(user_id),sum(available_bal) available_bal from budget where user_id='${user.userId}'`;
  pool.query(selectQuery, (err, result) => {
    if (!err) {
      console.log("inside if");
      if (result.rows[0].count == 0) {
        console.log("nested if");
        console.log("user don't have income");
      } else if (amount > result.rows[0].available_bal) {
        console.log("nested if");
        console.log("expense can't exceed available balance");
      } else {
        console.log("nested else");
        let insertQuery = `insert into expense_history (user_id,expense_spent_on,amount,date) values('${user.userId}','${user.text}','${amount}', CURRENT_DATE) `;
        pool.query(insertQuery, (err, res) => {
          if (!err) {
            console.log("Insertion was successful");
          } else {
            console.log(err.message);
          }
        });
        let updateQuery = `update budget set available_bal = available_bal-'${amount}', expense = expense+'${amount}' where user_id='${user.userId}'`;
        pool.query(updateQuery, (err, res) => {
          if (!err) {
            console.log("Update was successful");
          } else {
            console.log(err.message);
          }
        });
      }
    } else {
      console.log(err);
    }
  });
  pool.end;
});

//show income
app.post("/show-income", (req, res) => {
  const id = req.body.userId;
  let searchQuery = `Select * from income_history where user_id = '${id}'`;
  pool.query(searchQuery, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
    }
  });
});

//show expense
app.post("/show-expense", (req, res) => {
  const id = req.body.userId;
  let searchQuery = `Select * from expense_history where user_id = '${id}'`;
  pool.query(searchQuery, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
    }
  });
});

//show bal, total_income, total_expense
app.post("/show-budget", (req, res) => {
  const id = req.body.userId;
  let searchQuery = `Select available_bal, income, expense from budget where user_id = '${id}'`;
  pool.query(searchQuery, (err, result) => {
    if (!err) {
      res.send(result.rows[0]);
    } else {
      console.log(err.message);
    }
  });
});

//give user-id to the frontend
app.post("/user-id", (req, res) => {
  const user = req.body;
  const email = user.email;
  let searchQuery = `Select count(email) from signin where email = '${email}'`;
  pool.query(searchQuery, (err, result) => {
    if (!err) {
      if (result.rows[0].count == 1) {
        let passQuery = `Select user_id from signin where email = '${email}'`;
        pool.query(passQuery, (err, result1) => {
          console.log(result1);
          let user_id = result1.rows[0].user_id;
          // console.log(user_id);
          res.send({
            success: user_id,
          });
        });
      }
    }
  });
});

// delete history income
app.post("/delete-income-history", (req, res) => {
  const id = req.body.income_id;
  var details = {};
  let amountQuery = `select amount,user_id from income_history where income_id = '${id}'`;
  pool.query(amountQuery, (err, result) => {
    //console.log(details)
    //after deleting updating the budget table
    let amnt = result.rows[0].amount;
    let user_id = result.rows[0].user_id;
    console.log("amount", amnt);
    console.log("userid", user_id);
    let updateQuery = `update budget set available_bal = income - expense - '${amnt}', income = income - '${amnt}' where user_id= '${user_id}'`;
    pool.query(updateQuery, (err, result) => {
      if (!err) {
        res.send("update was successful");
        console.log("Update was successful in budget table");
      } else {
        // console.log(err.message);
        // res.send(err.message);
      }
    });
  });

  console.log(details);
  let deleteQuery = `delete from income_history where income_id = '${id}'`;
  pool.query(deleteQuery, (err, result) => {
    console.log("record is deleted");
  });
});

// delete history expense
app.post("/delete-expense-history", (req, res) => {
  const id = req.body.expense_id;
  var details = {};
  let amountQuery = `select amount,user_id from expense_history where expense_id = '${id}'`;
  pool.query(amountQuery, (err, result) => {
    //console.log(details)
    //after deleting updating the budget table
    let amnt = result.rows[0].amount;
    let user_id = result.rows[0].user_id;
    console.log("amount", amnt);
    console.log("userid", user_id);
    let updateQuery = `update budget set available_bal = income - expense + '${amnt}', expense = expense - '${amnt}' where user_id= '${user_id}'`;
    pool.query(updateQuery, (err, result) => {
      if (!err) {
        res.send("update was successful");
        console.log("Update was successful in budget table");
      } else {
        // console.log(err.message);
        // res.send(err.message);
      }
    });
  });

  let deleteQuery = `delete from expense_history where expense_id = '${id}'`;
  pool.query(deleteQuery, (err, result) => {
    console.log("record is deleted");
  });
});
