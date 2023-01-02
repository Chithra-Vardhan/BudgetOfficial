import React from "react";
import { useState } from "react";
import "./StyleTransaction.css";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Homecss.css";
import FastRewindIcon from "@mui/icons-material/FastRewind";

//toastMessage of expense
const showToastMessage = () => {
  toast.info("expense limit exceeded !", {
    position: toast.POSITION.TOP_RIGHT,
  });
};

//toastMessage of Balance
const showToastMessage1 = () => {
  toast.warning("balance limit exceeded !", {
    position: toast.POSITION.TOP_RIGHT,
  });
};

const AddTransaction = () => {
  const [allTransactions, setAllTransactions] = useState(null);
  const [allTransactions2, setAllTransactions2] = useState(null);
  const [item, SetItem] = useState("");
  const [price, SetPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [item2, SetItem2] = useState("");
  const [price2, SetPrice2] = useState(0);
  const [category2, setCategory2] = useState("");
  const [balance, setBalance] = useState(0);
  const [budget, setBudget] = useState(0);
  const [expense, setExpense] = useState(0);
  const [expenseThreshold, setExpenseThreshold] = useState(0);

  const [overAllbalance, setOverAllBalance] = useState(0);

  useEffect(() => getAllTrans(), [allTransactions]);
  useEffect(() => getAllTrans2(), [allTransactions2]);

  useEffect(() => {
    calcSum();
    getOverAllBal();
    calcSum2();
    budgetExp();
    getExp();
  });

  const hello = () => {
    if (expense >= expenseThreshold) {
      // alert("expense limit exceeded");
      showToastMessage();
    }

    if (overAllbalance <= 0) {
      // alert("balance limmit exceeded");
      showToastMessage1();
    }
  };

  const getAllTrans = () => {
    axios
      .get("http://localhost:5000/transactions")
      .then((res) => {
        setAllTransactions(res.data);
        // console.log(res.data)
      })
      .catch((error) => console.log(error));
  };

  const getAllTrans2 = () => {
    axios
      .get("http://localhost:5000/transactions2")
      .then((res) => {
        setAllTransactions2(res.data);
        // console.log(res.data)
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/transactions/${id}`)
      .catch((error) => console.log(error));
  };

  const handleDelete2 = (id) => {
    axios
      .delete(`http://localhost:5000/transactions2/${id}`)
      .catch((error) => console.log(error));
  };

  //handlesubmit
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/transactions1", {
        item,
        price,
        category,
        budget,
        balance,
        expense,
      })
      .catch((error) => console.log(error));

    clearInput();
  };
  // hadlesubmit1
  const handleSubmit1 = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/transactions2", {
        item2,
        price2,
        category2,
        budget,
        balance,
        expense,
      })
      .catch((error) => console.log(error));

    clearInput2();
  };
  //clearing inputs
  const clearInput = () => {
    SetItem("");
    SetPrice(0);
    setCategory("");
  };
  const clearInput2 = () => {
    SetItem2("");
    SetPrice2(0);
    setCategory2("");
  };
  //calcsum
  const calcSum = () => {
    var ans = 0;
    if (allTransactions && allTransactions.length > 0) {
      for (var trans of allTransactions) {
        ans += trans.price;
      }
    }
    setExpense(ans.toFixed(2));
    // return ans.toFixed(2);
  };

  //calcsum2
  const calcSum2 = () => {
    var ans = 0;
    if (allTransactions2 && allTransactions2.length > 0) {
      for (var trans of allTransactions2) {
        ans += trans.price;
      }
    }
    setBalance(ans.toFixed(2));
    // return ans.toFixed(2);
  };

  //for budget threshold
  const setBud = async () => {
    const amnt = prompt("Enter the budget");
    const budgetAmnt = parseInt(amnt);
    if (budgetAmnt <= 0) {
      alert("Budget cannot be negative");
    } else {
      axios
        .post("http://localhost:5000/budget", {
          budgetAmnt,
        })
        .catch((error) => console.log(error));
    }
  };

  //get budgetblance
  const budgetExp = () => {
    axios.get("http://localhost:5000/budget").then((res) => {
      console.log(res.data[0]);
      setBudget(res.data[0].budget);
    });
  };

  //get expenseThreshold
  const getExp = () => {
    axios.get("http://localhost:5000/expense").then((res) => {
      console.log(res.data);
      setExpenseThreshold(res.data[0].expense);
    });
  };

  //for expense threshold
  const setExp = () => {
    const expAmnt = parseInt(prompt("Enter the Amount for expenseLimit"));
    const expenseAmnt = parseInt(expAmnt);
    if (expenseAmnt <= 0) {
      alert("Expense limit cannot be negative");
    } else if (expenseAmnt >= budget) {
      alert("Expense limit has to be less than budget amnt");
    } else {
      axios
        .post("http://localhost:5000/expenseThreshold", {
          expenseAmnt,
        })
        .catch((error) => console.log(error));
    }
  };

  //get OverAll bal
  const getOverAllBal = () => {
    setOverAllBalance(budget + parseInt(balance) - parseInt(expense));
    console.log(budget, balance, expense);
  };

  //code

  return (
    <>
      {/* <div className="mainContainer">
            <div className="form-container"> */}

      <div className="main_container">
        <div className="heading d-flex flex-row">
          <a href="/home" className="change">
            {" "}
            <FastRewindIcon sx={{ fontSize: 50 }} />
          </a>
          <h2>
            {" "}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          //  Expense Tracker
          </h2>
        </div>

        // <div className="btn_heading">
        //   <button type="button" className="btn btn-secondary" onClick={setBud}>
        //     setBudget{" "}
        //   </button>
        //   &nbsp;&nbsp;
        //   <button type="button" className="btn btn-secondary" onClick={setExp}>
        //     {" "}
        //     setExpense Limit{" "}
        //   </button>
        // </div>

        // <div className="inc-exp-container">
        //   <div>
        //     <h4>Your Budget</h4>
        //     <p className="money minus">Rs {budget}</p>
        //   </div>
        //   <div>
        //     <h4>Your Balance</h4>
        //     <p className="money plus">+Rs {overAllbalance}</p>
        //   </div>
        //   <span> <input type="text" className="btn btn-secondary" onClick={setExp}>
        //     {" "}
        //     setExpense Limit{" "}
        //   </input></span>
        //   <div>
        //     <h4>Expense Limit</h4>
        //     <p className="money minus">Rs {expenseThreshold}</p>
        //   </div>
        // </div>

        <div className="inc-exp-container">
          <div>
            <h4>Expense</h4>
            <p className="money minus">-Rs {expense}</p>
          </div>
          <div>
            <h4>Income</h4>
            <p className="money plus">+Rs {balance}</p>
          </div>
        </div>
        <div className="div_table">
          <div>
            <table>
              <thead>
                <tr>
                  <th>Text</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Record Date</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions?.length > 0 &&
                  allTransactions.map((transaction) => {
                    return (
                      <tr key={transaction.trans_id}>
                        <td>{transaction.item}</td>
                        <td>Rs {transaction.price}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.record_time.split("T")[0]}</td>
                        <td>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDelete(transaction.trans_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Text</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Record Date</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions2?.length > 0 &&
                  allTransactions2.map((transaction2) => {
                    return (
                      <tr key={transaction2.trans_id}>
                        <td>{transaction2.item}</td>
                        <td>Rs {transaction2.price}</td>
                        <td>{transaction2.category}</td>
                        <td>{transaction2.record_time.split("T")[0]}</td>
                        <td>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDelete2(transaction2.trans_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form_div">
          <div className="form1">
            <form onSubmit={(e) => handleSubmit(e)}>
              <label>Text : </label>
              <input
                type="text"
                value={item}
                required
                onChange={(e) => SetItem(e.target.value)}
              ></input>
              <label>Price: </label>
              <input
                type="number"
                value={price}
                required
                onChange={(e) => SetPrice(e.target.value)}
              ></input>
              <br></br>
              <label htmlFor="Product">Category </label>&nbsp;&nbsp;
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                placeholder="type"
              >
                <option value="rent">Rent</option>
                <option value="groceries">groceries</option>
                <option value="shopping">shopping</option>
                <option value="food">food</option>
              </select>
              <br></br>
              <br></br>
              <div className="button_div">
                <button onClick={hello} className="btn btn-danger">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
          <div className="form2">
            <form onSubmit={(e) => handleSubmit1(e)}>
              <label>Text : </label>
              <input
                type="text"
                value={item2}
                required
                onChange={(e) => SetItem2(e.target.value)}
              ></input>
              <label>Price: </label>
              <input
                type="number"
                value={price2}
                required
                onChange={(e) => SetPrice2(e.target.value)}
              ></input>
              <br></br>
              <label htmlFor="Product">Category </label>&nbsp;&nbsp;
              <select
                onChange={(e) => setCategory2(e.target.value)}
                value={category2}
                placeholder="type"
              >
                <option value="salary">salary</option>
                <option value="rent">Rent</option>
                <option value="interest">Intrest</option>
                <option value="sell">sell</option>
              </select>
              <br></br>
              <br></br>
              <button className="btn btn-primary">Add Amount</button>
            </form>
          </div>
        </div>

        {/* </div>

        </div> */}
      </div>
    </>
  );
};

export default AddTransaction;
