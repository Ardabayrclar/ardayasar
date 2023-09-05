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

//post todo
app.post("/todos", async (req,res) => {
  try {
      const {description} = req.body;
      const newTodo = await pool.query(
          "INSERT INTO todo (description)VALUES ($1) returning *",
          [description]);
      res.json(newTodo.rows[0]);
  } catch (err){
      console.error(err.message);
  }

});
// get all todos
app.get("/todos", async (req, res) =>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows)
    }catch (err){
        console.error(err.message)
    }
})

//get a todo
app.get("/todos/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const todo = await  pool.query("SELECT * FROM todo WHERE todo_id = $1",[id])
        res.json(todo.rows[0])
    }catch (err){
        console.error(err.message)
    }
})

//update todo
app.put("/todos/:id", async (req,res) => {
    try{
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        );
        res.json("Updated!")
    } catch (err){
        console.error(err.message)
    }
})

// delete todo
app.delete("/todos/:id", async (req,res) => {
    try{
        const {id} = req.params;
        const deleteTodo = req.body;
        const updateTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1",
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