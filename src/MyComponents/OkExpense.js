import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import './Expense.css';




function OkExpense() {


    const [userId, setUserId] = useState();
    const [allTransactions, setAllTransactions] = useState([]);

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

    useEffect(() => {
        getCustomerId();
    });


    // getting Expense history
    async function ExpenseHistory() {
        const url2 = "http://localhost:5000/show-expense";
        await axios
            .post(url2, {
                userId,
            })
            .then((res) => {
                setAllTransactions(res.data);
                console.log("hello", allTransactions);
            });
    }


       //delete history
       const handleDelete = (expense_id) => {
        axios
            .post(`http://localhost:5000/delete-expense-history`,{
                expense_id
            })
            .catch((error) => console.log(error));
    };



    return (
        <>
            <div>
                <h1>Expense Details</h1>

            </div>
            <FormControl className="filter-width">

                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue="default"
                    label="Events: "
                >
                    <MenuItem value="default" onClick={ExpenseHistory} selected>
                        ALL
                    </MenuItem>

                </Select>
            </FormControl><br /><br />


            <table className="table">
                <thead className="table-primary thead-width">
                    <tr>
                        <th scope="col">item</th>
                        <th scope="col">price</th>
                        <th scope="col">date</th>

                    </tr>
                </thead>
                {allTransactions.map((data) => (
                    <tbody className="table-data shadow-lg">
                        <tr key={data.expense_id}>
                            <td>{data.expense_spent_on}</td>
                            <td>{data.amount} </td>
                            <td>{data.date.split("T")[0]} </td>
                            <td><button
                                className="btn btn-info"
                                onClick={() => handleDelete(data.expense_id)}
                            >
                                Delete
                            </button> </td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </>

    );

}

export default OkExpense;