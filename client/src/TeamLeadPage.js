import React, {Fragment, useEffect, useRef, useState} from "react";
import logo from './logo.svg';
import './App.css';


//components

import ListAll from "./Components/ListAll";
import Axios from 'axios';
import LoginPage from "./LoginPage.js";
import './LoginPage.css';
//import {user} from "pg/lib/native";
//import pool from "../../src/server";
//import app from "../../src/App";
//import pool from "../../src/server";
import AdminPage from "./AdminPage.js"; // Import your AdminPage component

import EmployeePage from "./EmployeePage.js"; // Import your EmployeePage component
const colorOptions = ['#FF5733', '#33FF57', '#FFD700', '#5F9EA0', '#800080','#f27e9f','#ad9df5','#f5be9d','#02f7be','#8102f7npm '];

const getRandomColor = () => {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};
function TeamLeadPage() {


    const availableDepartments = ['Asp', 'Java', 'Satış',];
    const [loading, setLoading] = useState(true); // Loading state
    const [employeees, setEmployees] = useState([]);
    const [calendars, setCalendars] = useState([]);
// const getEmployees = async () => {
//     try {
//
//         const response = await fetch("http://localhost:5000/getAllEmp");
//         const jsonData = await response.json();
//
//         setEmployees(jsonData);
//
//     }catch (err){
//         console.log(err.message);
//     }
// };
//
// useEffect(() =>{
//     getEmployees();
// },[]);
    useEffect(() => {
        Axios.get("http://localhost:3000/getAllEmp")
            .then(response => {
                setEmployees(response.data);
                setLoading(false); // Data loaded, set loading to false
            })
            .catch(error => {
                console.error("Error fetching employee names:", error);
                setLoading(false); // Data failed to load, set loading to false
            });
        // Fetch calendars data here in a similar manner
        Axios.get("http://localhost:3000/getAllCalendars")
            .then(response => {
                setCalendars(response.data);
            })
            .catch(error => {
                console.error("Error fetching calendars:", error);
            });
        Axios.post("http://localhost:3000/saveData")
            .then(response => {
                setCalendars(response.data);
            })
    }, []);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const filteredEmployees = employeees.filter(employee => employee.department === selectedDepartment);
    const [showCalendars, setShowCalendars] = useState(false);
    const [newEmployeeName, setNewEmployeeName] = useState('');
    const [newEmployeeDays, setNewEmployeeDays] = useState([]);
    const [newEmployeeDepartment, setNewEmployeeDepartment] = useState('');
    const [selectedWeek, setSelectedWeek] = useState(null);


    const handleDateSelect = (employeeId, selectedDate) => {
        if (selectedWeek === null) {
            setSelectedWeek(getWeekNumber(new Date(selectedDate))[1]);
        }

        const selectedDay = new Date(selectedDate).getDay();

        if (selectedDay === 0 || selectedDay === 6) {
            alert('Hafta sonları seçim yapamazsınız.');
            return;
        }

        const employeeIndex = employeees.findIndex(emp => emp.id === employeeId);


        if (selectedWeek !== getWeekNumber(new Date(selectedDate))[1]) {
            alert('Sadece seçilen ilk tarihin haftası için tarih seçimi yapabilirsiniz.');
            return;
        }

        const employee = { ...employeees[employeeIndex] };


        // Ensure that selectedDates is an array
        employee.selectedDates = Array.isArray(employee.selectedDates) ? employee.selectedDates : [];


        if (employee.selectedDates.length >= 5) {
            alert('En fazla 5 gün seçebilirsiniz.');
            return;
        }

        employee.selectedDates.push(selectedDate);

        const updatedEmployees = [...employeees];
        updatedEmployees[employeeIndex] = employee;

        setEmployees(updatedEmployees);
    };
    const clearAllDates = () => {
        const updatedEmployees = employeees.map((employee) => ({
            ...employee,
            selectedDates: [],
        }));

        setEmployees(updatedEmployees);
    };

    const handleDateDelete = (employeeId, deletedDate) => {
        const employeeIndex = employeees.findIndex(emp => emp.id === employeeId);

        if (employeeIndex === -1) {
            // Employee not found, handle the error gracefully
            return;
        }

        const employee = { ...employeees[employeeIndex] };

        // Ensure that selectedDates is an array
        employee.selectedDates = Array.isArray(employee.selectedDates) ? employee.selectedDates : [];

        // Remove the deletedDate from selectedDates
        employee.selectedDates = employee.selectedDates.filter(date => date !== deletedDate);

        const updatedEmployees = [...employeees];
        updatedEmployees[employeeIndex] = employee;

        setEmployees(updatedEmployees);
    };

    const saveDataToDatabase = async (req, res) => {
        const apiUrl = "http://localhost:5000/saveData"; // Update the API URL
        console.log(calendars);
        if (Array.isArray(calendars)) {
            const postData = {
                calendars: calendars.map(calendar => ({
                    employee_id: calendar.employee_id,
                    work_date: calendar.work_date,
                    calendar_id:calendar.id,
                })),
            };
            Axios.post(apiUrl, postData)
                .then(response => {
                    console.log('Data was successfully saved to the database:', response.data);
                    res.status(200).json({ message: 'Data was successfully saved to the database.' });
                })
                .catch(error => {
                    console.error('An error occurred while saving the data:', error);
                    res.status(500).json({ error: 'An error occurred while saving the data.' });
                });
        } else {
            console.error('Calendars data is not available or is not an array.');
            res.status(400).json({ error: 'Calendars data is not available or is not an array.' });
        }



        // Verileri API'ye gönderin
        // app.post("/saveData", async (req, res) => {
        //     try {
        //         const { id, employee_id, work_date,employee_name,department_id} = req.body;
        //         const newEmp = await pool.query(
        //             "INSERT INTO calendars (id, employee_id, work_date,employee_name,department_id) VALUES ($1, $2, $3, $4,$5) RETURNING *",
        //             [id, employee_id, work_date,employee_name,department_id]
        //         );
        //         res.json(newEmp.rows[0]);
        //     } catch (err) {
        //         console.error(err.message);
        //         res.status(500).json({ error: "Server Error" });
        //     }
        // });
        // // Burada verileri bir API'ye göndererek veritabanına kaydetme işlemlerini yapabilirsiniz.
        // console.log('Veriler veritabanına kaydedildi:', employeees);
        // alert('Veriler veritabanına kaydedildi.');
    };

    const toggleCalendars = () => {

        if (Array.isArray(employeees) && employeees.length > 0) {
            setShowCalendars(!showCalendars);
        } else {
            // Handle the case where employeees is not properly initialized
            console.error("Employee data is not available or empty.");
        }
    };


    const addEmployee = () => {
        if (newEmployeeName && newEmployeeDays.length > 0 && newEmployeeDepartment) {
            const newEmployee = {
                id: Date.now(),
                name: newEmployeeName,
                selectedDates: newEmployeeDays,
                color: getRandomColor(),
                department: newEmployeeDepartment,
            };
            setEmployees([...employeees, newEmployee]);
            setNewEmployeeName('');
            setNewEmployeeDays([]);
            setNewEmployeeDepartment('');
        }
    };

    const removeEmployee = employeeId => {
        const updatedEmployees = employeees.filter(employee => employee.id !== employeeId);
        setEmployees(updatedEmployees);
    };

    const getEmployeeForDay = (selectedDate, employeeId) => {
        const employee = employeees.find(emp => emp.id === employeeId);
        return employee ? employee.name : '';
    };

    const groupDatesByDay = () => {
        const groupedDates = {};

        if (Array.isArray(employeees) && employeees.length > 0) {
            employeees.forEach(employee => {
                if (employee.selectedDates && Array.isArray(employee.selectedDates)) {
                    employee.selectedDates.forEach(date => {
                        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
                        if (!groupedDates[day]) {
                            groupedDates[day] = [];
                        }
                        groupedDates[day].push({ date, employeeId: employee.id });
                    });
                }
            });
        }

        return groupedDates;
    };

    const getEmployeeCountForDay = day => {
        const dates = Object.values(groupDatesByDay());
        const employeesForDay = dates.find(d =>
            d.some(date => new Date(date.date).toLocaleDateString('en-US', { weekday: 'long' }) === day)
        );
        return employeesForDay ? employeesForDay.length : 0;
    };

    const getWeekNumber = date => {
        const today = new Date(date.getTime());
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() + 4 - (today.getDay() || 7));
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((today - yearStart) / 86400000 + 1) / 7);
        return [today.getFullYear(), weekNumber];
    };
    const scrollToRef = ref => {
        if (ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop,
                behavior: 'smooth',
            });
        }
    };
    const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);

    const toggleEmployeeExpand = (employeeId) => {
        setExpandedEmployeeId(prevExpandedId => prevExpandedId === employeeId ? null : employeeId);
    };
    const mondayRef = useRef(null);
    const tuesdayRef = useRef(null);
    const wednesdayRef = useRef(null);
    const thursdayRef = useRef(null);
    const fridayRef = useRef(null);


    const dayOrder = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
    };

    return (


            <div className="TeamLeadPage">

                <div className="container">
                    <h1>Team Lead Sayfasi</h1>
                    <div className="add-employee">
                        <div className="department-selection">

                            <select
                                value={selectedDepartment}
                                onChange={e => setSelectedDepartment(e.target.value)}
                            >
                                <option value="">Departmant Seçin</option>
                                {availableDepartments.map((department, index) => (
                                    <option key={index} value={department}>
                                        {department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="employee-info">
                            <input
                                type="text"
                                placeholder="Çalışan Adı"
                                value={newEmployeeName}
                                onChange={e => setNewEmployeeName(e.target.value)}
                            />
                            <select
                                value={newEmployeeDepartment}
                                onChange={e => setNewEmployeeDepartment(e.target.value)}
                            >
                                <option value="">Departman Seçin</option>
                                {availableDepartments.map((department, index) => (
                                    <option key={index} value={department}>
                                        {department}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={newEmployeeDays}
                                onChange={e => setNewEmployeeDays([...newEmployeeDays, e.target.value])}
                            />
                        </div>
                        <div className="add-button">
                            <button onClick={addEmployee}>Çalışan Ekle</button>
                        </div>

                    </div>
                    {/*<div className="container">*/}
                    {/*    <ListAll />*/}
                    {/*</div>*/}
                    {Array.isArray(employeees) && employeees.length > 0 ? (
                        employeees.map(employee => (
                            <div key={employee.id} className={`employee employee${employee.id}`}>
                                <div className="employee-header" onClick={() => toggleEmployeeExpand(employee.id)}>
                                    <h2>{employee.name}</h2>
                                    <p>Department: {employee.department}</p>
                                </div>
                                {expandedEmployeeId === employee.id && (
                                    <div className="employee-details">

                                        <input
                                            className="date-input"
                                            type="date"
                                            onChange={e => handleDateSelect(employee.id, e.target.value)}
                                        />
                                        <div className="selected-dates">
                                            <p className="selecteddates">Seçilen Tarihler:</p>
                                            {employee.selectedDates && employee.selectedDates.map((date, index) => (
                                                <div key={index} className="selected-date">
                                                    <span>{date}</span>
                                                    <button onClick={() => handleDateDelete(employee.id, date)}>Sil</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="selected-count">Toplam Seçilen Gün: {employee.selectedDates ? employee.selectedDates.length : 0}</div>
                                        <button onClick={() => removeEmployee(employee.id)}>Çalışanı Sil</button>
                                    </div>
                                )}


                            </div>
                        ))
                    ) : (
                        <p>Loading employee data...</p>
                    )

                    }
                    <div className="button-container">
                        <button className="view-calendar-button" onClick={toggleCalendars}>
                            Takvimi Görüntüle
                        </button>

                        <button className="save-data-button" onClick={saveDataToDatabase}>
                            Veriyi Kaydet
                        </button>
                        <div className="clear-week">
                            <button onClick={clearAllDates}>Haftayı Sil</button>
                        </div>
                    </div>
                    {showCalendars && (
                        <div className="calendars-container">
                            <div className="week-days">
                                <div ref={mondayRef} className="week-day" onClick={() => scrollToRef(mondayRef)}>
                                    Pazartesi {getEmployeeCountForDay('Monday')} Kişi
                                </div>
                                <div ref={tuesdayRef} className="week-day" onClick={() => scrollToRef(tuesdayRef)}>
                                    Salı {getEmployeeCountForDay('Tuesday')} Kişi
                                </div>
                                <div ref={wednesdayRef} className="week-day" onClick={() => scrollToRef(wednesdayRef)}>
                                    Çarşamba {getEmployeeCountForDay('Wednesday')} Kişi
                                </div>
                                <div ref={thursdayRef} className="week-day" onClick={() => scrollToRef(thursdayRef)}>
                                    Perşembe {getEmployeeCountForDay('Thursday')} Kişi
                                </div>
                                <div ref={fridayRef} className="week-day" onClick={() => scrollToRef(fridayRef)}>
                                    Cuma {getEmployeeCountForDay('Friday')} Kişi
                                </div>
                            </div>

                            <div className="calendar-group-container">

                                {Object.entries(groupDatesByDay())
                                    .sort(([dayA], [dayB]) => dayOrder[dayA] - dayOrder[dayB])
                                    .map(([day, dates]) => (
                                        <div key={day} className="calendar-group">
                                            <h3>{day}</h3>
                                            <div className="employee-boxes">
                                                {Array(getEmployeeCountForDay(day)).fill(null).map((_, index) => {
                                                    const employeeId = dates[index].employeeId;
                                                    return (
                                                        <div
                                                            key={employeeId}
                                                            className={`employee-box ${
                                                                getEmployeeForDay(dates[0].date, employeeId) ===
                                                                employeees.find(emp => emp.id === employeeId).name
                                                                    ? `employee${employeeId}`
                                                                    : ''
                                                            }`}
                                                        >
                                                            {getEmployeeForDay(dates[0].date, employeeId) ===
                                                            employeees.find(emp => emp.id === employeeId).name ? (
                                                                <span>{employeees.find(emp => emp.id === employeeId).name}</span>
                                                            ) : null}
                                                            <button
                                                                className="delete-button"
                                                                onClick={() => handleDateDelete(employeeId, dates[0].date)}
                                                            >
                                                                Sil
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>




            );
            }



export default TeamLeadPage;