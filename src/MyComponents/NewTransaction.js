import React from "react";
import "./NewStyle.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const NewTransaction = () => {
  const navigate = useNavigate();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState();
  const [text, setText] = useState("");
  const [amount, setAmount] = useState(0);
  const [userId, setUserId] = useState();
  const [number, setNumber] = useState(0);

  //useEffect of updating the values in the frontend
  useEffect(() => {
    getCustomerId();
    getBudget();
  });

  //toastMessage of Balance
  const showToastMessage1 = () => {
    toast.warning("balance limit exceeded !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const getBalance = () => {
    if (balance <= 0) {
      showToastMessage1();
    }
  };

  async function getCustomerId() {
    var x = localStorage.getItem("email");
    const url2 = "http://localhost:5000/user-id";
    await axios
      .post(url2, {
        email: x,
      })
      .then((res) => {
        setUserId(res.data.success);
        console.log("UserId " + userId);
      });
  }

  //fucntion for showing the income,balance and expense
  const getBudget = async () => {
    await axios
      .post("http://localhost:5000/show-budget", {
        userId,
      })
      .then((res) => {
        setBalance(res.data.available_bal);
        setExpense(res.data.expense);
        setIncome(res.data.income);
      });


  };

  //handel submit function for submitting the user inputs to the backend
  //based on income or expense
  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount >= 0) {
      axios
        .post("http://localhost:5000/insert-income", {
          userId,
          text,
          amount,
        })
        .then((res) => {
          console.log(res);
        });
      clearInput();
    } else {
      axios
        .post("http://localhost:5000/insert-expense", {
          userId,
          text,
          amount,
        })
        .then((res) => {
          console.log(res);
        });  
      clearInput();
    }

    console.log(amount);
    console.log(text);
  };

  //clearing inputs after submitting the user inputs
  const clearInput = () => {
    setText("");
    setAmount(0);
  };

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  //   <form onSubmit={(e) => expenseSubmit(e)}>

  //   <label htmlFor="text">SetExpenseLimit</label>
  //   <input
  //     type="number" min= {0} onChange={(e) => setNumber(e.target.value)}
  //     value={number}
  //     required

  //     placeholder="Enter your Limit..." />
  //   <br></br>
  //   <button>Submit</button>
  // </form>

  return (
    <>
      <div className="container">
        <h4>Your Balance</h4>
        <h1 id="balance">${balance}</h1>

        <div className="inc-exp-container">
          <div>
            <h4>Income</h4>
            <p id="money-plus" className="money plus">
              +Rs{income}
            </p>
          </div>
          <div>
            <h4>Expense</h4>
            <p id="money-minus" className="money minus">
              -Rs{expense}
            </p>
          </div>
        </div>

        {/* <ul className="list">
            <li className="minus">
              {historyText} <span> {historyAmnt}</span>
              <button className="delete-btn">x</button>
            </li>
          </ul> */}

        <h3>Add new transaction</h3>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="form-control">
            <label htmlFor="text">Text</label>
            <input
              type="text"
              value={text}
              required
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">
              Amount <br />
              (negative - expense, positive - income)
            </label>
            <input
              type="number"
              value={amount}
              required
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
            />
          </div>
          <button onClick={getBalance} className="btn btn-primary">Add transaction</button>
          <button className="btn btn-danger" onClick={logout}>
            Log out
          </button>
        </form>
      </div>
    </>
  );
};
