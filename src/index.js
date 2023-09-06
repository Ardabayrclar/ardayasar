// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
//
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
//
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./server");

app.use(cors());
app.use(express.json());

//ROUTES

//post emp
app.post("/createEmp", async (req, res) => {
    try {
        const { id, name, department_id, role_id } = req.body;
        const newEmp = await pool.query(
            "INSERT INTO employees (id, name, department_id, role_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, name, department_id, role_id]
        );
        res.json(newEmp.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// get all todos
app.get("/getAllEmp", async (req, res) =>{
    try {
        const allEmp = await pool.query("SELECT * FROM employees");
        res.json(allEmp.rows)
    }catch (err){
        console.error(err.message)
    }
})

//get a Emp
app.get("/getEmp/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const emp = await  pool.query("SELECT * FROM employees WHERE id = $1",[id])
        res.json(emp.rows[0])
    }catch (err){
        console.error(err.message)
    }
})

//update emp
app.put("/updateEmp/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { empID, name, department_id, role_id } = req.body;
        const updateEmp = await pool.query(
            "UPDATE employees SET id = $1, name = $2, department_id = $3, role_id = $4 WHERE id = $5",
            [empID, name, department_id, role_id, id]
        );
        res.json("Employee updated");
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});


// delete emp
app.delete("/deleteEmp", async (req,res) => {
    try{
        const {id} = req.params;
        const deleteEmp = req.body;
        const updateEmp = await pool.query(
            "DELETE FROM employees WHERE id = $1",
            [id]
        );
        res.json("Deleted!")
    } catch (err){
        console.error(err.message)
    }
})

app.listen(5000,()=>{
    console.log("listening port 5000")
})