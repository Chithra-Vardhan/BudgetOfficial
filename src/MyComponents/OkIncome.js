import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";




function OkIncome() {

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


    // const [data, setData] = useState([]);
    // const getAll = async () => {
    //     const data = await axios.get("http://localhost:5000/show-income");
    //     console.log(data.data);
    //     setData(data.data);
    // };


    // getting Expense history
    async function IncomeHistory() {
        const url2 = "http://localhost:5000/show-income";
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
    const handleDelete = (income_id) => {
        axios
            .post(`http://localhost:5000/delete-income-history`, {
                income_id
            })
            .catch((error) => console.log(error));
    };


    return (
        <>
            <div>
                <h1>Income Details</h1>

            </div>
            <FormControl className="filter-width">

                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue="default"
                    label="Events: "
                >
                    <MenuItem value="default" onClick={IncomeHistory} selected>
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
                        <tr key={data.income_id}>
                            <td>{data.income_source}</td>
                            <td>{data.amount} </td>
                            <td>{data.date.split("T")[0]} </td>
                            <td><button
                                className="btn btn-secondary"
                                onClick={() => handleDelete(data.income_id)}
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

export default OkIncome;




// {data.map((data) => (
//     <tbody className="table-data shadow-lg">
//         <tr>
//             <td>{data.item}</td>
//             <td>{data.price} </td>
//             <td>{data.date}</td>
//             </tr>
//             </tbody>