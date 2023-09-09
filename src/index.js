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

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// app.post('/saveData', async (req, res) => {
//     // Retrieve the data from the request body
//     const {calendars} = req.body;
//     const newEmpDate = [];
//     if (Array.isArray(calendars)) {
//         // Store the data (you should replace this with database code)
//         const { id, employee_id, work_date,employee_name,department_id} = req.body;
//         const newDate = pool.query(
//             "INSERT INTO calendars (id, employee_id, work_date,employee_name,department_id) VALUES ($1, $2, $3, $4,$5) RETURNING *",
//             [id, employee_id, work_date,employee_name,department_id]
//         );
//         newEmpDate.push(...calendars);
//         res.json(newDate.rows[0]);
//         // Respond with a success message
//         res.status(200).json({ message: 'Data saved successfully' });
//     }
//     // Process and insert the data into the database (you will need to implement this part)
//
//
//     // Respond with a success message or error message
//     res.status(200).json({ message: 'Data saved successfully' });
// });
app.post("/saveData", async (req, res) => {

    try {
        //     const {employee_id, work_date,employee_name,department_id} = req.body;
        //     const newDate = await pool.query(
        //         "INSERT INTO calendars (employee_id, work_date) VALUES ($1, $2) RETURNING *",
        //         [employee_id, work_date, employee_name, department_id]
        //     );
        //     console.log(req.body);
        //     console.log([employee_id, work_date, employee_name, department_id]);
        //     res.json(newDate.rows[0]);
        // const calendars = [
        //     { employee_id: 1, work_date: '2023-09-08' },
        //     { employee_id: 3, work_date: '2023-09-09' },
        //     { employee_id: 4, work_date: '2023-09-09' },
        // ];
        const calendars = req.body; // Assuming calendars is an array from the request body
        let result = [];

        for(let i in calendars){
            result.push([i, calendars [i]]);
        }

      //  console.log(result);
// Ensure calendars is an array
        if (Array.isArray(result)) {
            let queryString = "'INSERT INTO calendars (employee_id, work_date) VALUES'";
            let valueStrings = [];

            for (let i = 0; i < result.length; i++) {
                const employee = result[i];

                // Check if employee has the expected properties
                if (employee.employee_id && Array.isArray(employee.work_date)) {
                    const employeeId = employee.employee_id;
                    const workDates = employee.work_date.map(date => `('${employeeId}', '${date}')`).join(', ');
                    valueStrings.push(workDates);
                }
            }

            queryString += valueStrings.join(', ');
            await pool.query(queryString);

        } else {
            console.error('calendars is not in the expected format');
            // Handle the case when calendars is not as expected
        }
    } catch (err) {
        console.log(err.message)
    }
})
// get all employees
    app.get("/getAllEmp", async (req, res) => {
        try {
            const allEmp = await pool.query("SELECT * FROM employees");
            res.json(allEmp.rows)
        } catch (err) {
            console.error(err.message)
        }
    })

// get all calendars
app.get("/getAllCalendars", async (req, res) => {
    try {
        const allCalendars = await pool.query("SELECT * FROM calendars");
        res.json(allCalendars.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get a Emp
    app.get("/getEmp/:id", async (req, res) => {
        try {
            const {id} = req.params;
            const emp = await pool.query("SELECT * FROM employees WHERE id = $1", [id])
            res.json(emp.rows[0])
        } catch (err) {
            console.error(err.message)
        }
    })

//update emp
    app.put("/updateEmp/:id", async (req, res) => {
        try {
            const {id} = req.params;
            const {empID, name, department_id, role_id} = req.body;
            const updateEmp = await pool.query(
                "UPDATE employees SET id = $1, name = $2, department_id = $3, role_id = $4 WHERE id = $5",
                [empID, name, department_id, role_id, id]
            );
            res.json("Employee updated");
        } catch (err) {
            console.error(err.message);
            res.status(500).json({error: "Server Error"});
        }
    });


// delete emp
    app.delete("/deleteEmp/:id", async (req, res) => {
        try {
            const {id} = req.params;
            const deleteEmp = await pool.query(
                "DELETE FROM employees WHERE id = $1",
                [id]
            );
            res.json("Deleted!");
        } catch (err) {
            console.error(err.message);
            res.status(500).json({error: "Server Error"});
        }
    });


    app.listen(5000, () => {
        console.log("listening port 5000")
    })
