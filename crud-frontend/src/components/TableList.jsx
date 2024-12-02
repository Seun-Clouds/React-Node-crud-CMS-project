import axios from 'axios';
import { useState } from 'react';

export default function Tablelist({handleOpen, tableData, setTableData, searchTerm}) {
    const [error, setError] = useState(null);



    const filteredData = tableData.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.job.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this")
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/clients/${id}`);
                setTableData((prevData) => prevData.filter(client => client.id !== id));
                } catch (err) {
                    setError(err.message);
                }
                }
    };

    



    return (
        <>

            {error && <div className='alert alert-error'>{error}</div>}

            <div className="overflow-x-auto mt-10">
            <table className="table">
                {/* head */}
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Job</th>
                    <th>Rate</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody className="hover">
                {/* row 1 */}

                {filteredData.map((client, index) => (

                    <tr key={client.id}>
                        <th>{index + 1}</th> {/* Dynamic numbering starting from 1 */}
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.job}</td>
                        <td>{client.rate}</td>
                        <td>
                        <button className={`btn rounded-full w-20 ${client.isactive ? 'btn-primary' : 'btn-outline btn-primary'}`}>
                            {client.isactive ? 'Active' : 'Inactive'}
                        </button>
                        </td>
                        <td>
                        <button onClick={() => handleOpen('edit', client)} className="btn btn-secondary">Update</button>
                        </td>
                        <td>
                        <button className="btn btn-accent" onClick={() => handleDelete(client.id)}>Delete</button>
                        </td>
                    </tr>                 
                    ))}

                

                </tbody>
            </table>
            </div>
        </>
    )
}