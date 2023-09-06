import React, {Fragment,useEffect,useState} from "react";

const ListAll = () => {

    const [employees,setEmployees] = useState([]);

    const getEmployees = async () => {
        try {

            const response = await fetch("http://localhost:5000/getAllEmp");
            const jsonData = await response.json();

            setEmployees(jsonData);

        }catch (err){
            console.log(err.message);
        }

    };

    useEffect(() =>{
        getEmployees();
    },[]);

    return (
       <Fragment>
       <table className="table mt-5 text-center">
        <thead>
            <tr>
                <th>name</th>
                <th>department_id</th>
                <th>role_id</th>
            </tr>
        </thead>
           <tbody>
           {employees.map(employee => (
               <tr>
                   <td>{employee.name}</td>
                   <td>{employee.department_id}</td>
                   <td>{employee.role_id}</td>
               </tr>
           ))}
           </tbody>
        </table>
   </Fragment>
)
};
export default ListAll;