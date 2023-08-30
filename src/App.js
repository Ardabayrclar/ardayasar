import React, { useState,useRef } from 'react';
import './App.css';

const colorOptions = ['#FF5733', '#33FF57', '#FFD700', '#5F9EA0', '#800080','#f27e9f','#ad9df5','#f5be9d','#02f7be','#8102f7npm '];

const getRandomColor = () => {
  return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};

function App() {
  const initialEmployees = [
      { id: 1, name: 'John Doe', selectedDates: [], color: getRandomColor(), department: 'Java' },
      { id: 2, name: 'Jane Smith', selectedDates: [], color: getRandomColor(), department: 'Asp' },
      { id: 3, name: 'Michael Johnson', selectedDates: [], color: getRandomColor(), department: 'Satış' },
      { id: 4, name: 'Michael Williams', selectedDates: [], color: getRandomColor(), department: 'Java' },
      { id: 5, name: 'Emily Davis', selectedDates: [], color: getRandomColor(), department: 'Java' },
      { id: 6, name: 'Daniel Wilson', selectedDates: [], color: getRandomColor(), department: 'Java' },
      { id: 7, name: 'Olivia Brown', selectedDates: [], color: getRandomColor(), department: 'Java' },
      { id: 8, name: 'Sophia Taylor', selectedDates: [], color: getRandomColor(), department: 'Asp' },
      { id: 9, name: 'Liam Martinez', selectedDates: [], color: getRandomColor(), department: 'Asp' },
     // { id: 10, name: 'Ava Anderson', selectedDates: [], color: getRandomColor(), department: 'Asp' },



    ];
  const availableDepartments = ['Asp', 'Java', 'Satış',];
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const filteredEmployees = employees.filter(employee => employee.department === selectedDepartment);
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

    const employee = employees.find(emp => emp.id === employeeId);

     if (selectedWeek !== getWeekNumber(new Date(selectedDate))[1]) {
        alert('Sadece seçilen ilk tarihin haftası için tarih seçimi yapabilirsiniz.');
        return;
      }

    if (selectedWeek !== getWeekNumber(new Date(selectedDate))[1]) {
      alert('Sadece seçilen ilk tarihin haftası için tarih seçimi yapabilirsiniz.');
      return;
    }

    if (employee.selectedDates.length >= 5) {
      alert('En fazla 5 gün seçebilirsiniz.');
      return;
    }

    const updatedEmployees = employees.map(employee => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          selectedDates: [...employee.selectedDates, selectedDate],
        };
      }
      return employee;
    });

    setEmployees(updatedEmployees);
  };

  const handleDateDelete = (employeeId, deletedDate) => {
    const updatedEmployees = employees.map(employee => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          selectedDates: employee.selectedDates.filter(date => date !== deletedDate),
        };
      }
      return employee;
    });

    setEmployees(updatedEmployees);
  };

  const saveDataToDatabase = () => {
    // Burada verileri bir API'ye göndererek veritabanına kaydetme işlemlerini yapabilirsiniz.
    console.log('Veriler veritabanına kaydedildi:', employees);
    alert('Veriler veritabanına kaydedildi.');
  };

  const toggleCalendars = () => {
    setShowCalendars(!showCalendars);
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
      setEmployees([...employees, newEmployee]);
      setNewEmployeeName('');
      setNewEmployeeDays([]);
      setNewEmployeeDepartment('');
    }
  };

  const removeEmployee = employeeId => {
    const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
    setEmployees(updatedEmployees);
  };

  const getEmployeeForDay = (selectedDate, employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : '';
  };

  const groupDatesByDay = () => {
    const groupedDates = {};

    employees.forEach(employee => {
      employee.selectedDates.forEach(date => {
        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        if (!groupedDates[day]) {
          groupedDates[day] = [];
        }
        groupedDates[day].push({ date, employeeId: employee.id });
      });
    });

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

  const clearAllDates = () => {
    const updatedEmployees = employees.map(employee => ({
      ...employee,
      selectedDates: [],
    }));

    setEmployees(updatedEmployees);
  };
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
    <div className="App">
      <div className="container">
        <h1>Çalışan Takvimi</h1>
        <div className="add-employee">
           <div className="department-selection">

               <select
                 value={selectedDepartment}
                 onChange={e => setSelectedDepartment(e.target.value)}
               >
                 <option value="">Departman Seçin</option>
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
       {filteredEmployees.map(employee => (
         <div key={employee.id} className={`employee employee${employee.id}`}>
           <div className="employee-header" onClick={() => toggleEmployeeExpand(employee.id)}>
             <h2>{employee.name}</h2>
             <p>Departman: {employee.department}</p>
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
                 {employee.selectedDates.map((date, index) => (
                   <div key={index} className="selected-date">
                     <span>{date}</span>
                     <button onClick={() => handleDateDelete(employee.id, date)}>Sil</button>
                   </div>
                 ))}
               </div>
               <div className="selected-count">Toplam Seçilen Gün: {employee.selectedDates.length}</div>
               <button onClick={() => removeEmployee(employee.id)}>Çalışanı Sil</button>
             </div>
           )}
         </div>
       ))}
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
                            employees.find(emp => emp.id === employeeId).name
                              ? `employee${employeeId}`
                              : ''
                          }`}
                        >
                          {getEmployeeForDay(dates[0].date, employeeId) ===
                          employees.find(emp => emp.id === employeeId).name ? (
                            <span>{employees.find(emp => emp.id === employeeId).name}</span>
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

export default App;
