import React, {Fragment} from "react";

const ListAll = () => {
    return <Fragment>
        {emps.map(emp => (
            <tr>
                <td>{emp.name}</td>
                <td>{emp.department_id}</td>
                <td>{emp.role_id}</td>
            </tr>
        ))}
    </Fragment>;

};
export default ListAll;