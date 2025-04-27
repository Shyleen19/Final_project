import React from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Caregiver = () => {
    const caregivers = [
        { firstName: "John", lastName: "Doe", relationship: "Son", email: "jd@gmail.com", phone: "07467245" },
        { firstName: "Paul", lastName: "Doe", relationship: "Father", email: "p@gmail.com", phone: "07533233" },
        { firstName: "Mia", lastName: "Mia", relationship: "Mother", email: "m@gmail.com", phone: "07899233" },
        { firstName: "Vincent", lastName: "Vincent", relationship: "Sister", email: "v@gmail.com", phone: "92832772" },
    ];

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-[#E6F7FC] p-5">
                <header className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex items-center mr-12">
                        <span className="text-xl mr-4 bg-[#A8E6EF] px-4 py-1 rounded-lg">05:10:10</span>
                        <FontAwesomeIcon icon={faBell} className="text-xl text-gray-600" /> 
                    </div>
                </header>
                <p className="text-xl mt-2">Good Morning Jay</p>

                <div className="flex justify-end mt-4">
                    <button className="bg-[#00D9FF] text-white py-2 px-4 rounded shadow-md">ADD CAREGIVER</button>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full bg-white rounded-lg shadow border-collapse">
                        <thead className="bg-[#03363f] text-black">
                            <tr>
                                <th className="py-6 px-4 border-b text-left">F.NAME</th>
                                <th className="py-6 px-4 border-b text-left">L.NAME</th>
                                <th className="py-6 px-4 border-b text-left">RELATIONSHIP</th>
                                <th className="py-6 px-4 border-b text-left">EMAIL</th>
                                <th className="py-6 px-4 border-b text-left">PHONE</th>
                                <th className="py-6 px-4 border-b text-left">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {caregivers.map((caregiver, index) => (
                                <tr key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-[#EDFCFF]' : 'bg-white'}`}> 
                                    <td className="py-8 px-4 border-b">{caregiver.firstName}</td>
                                    <td className="py-8 px-4 border-b">{caregiver.lastName}</td>
                                    <td className="py-8 px-4 border-b">{caregiver.relationship}</td>
                                    <td className="py-8 px-4 border-b">{caregiver.email}</td>
                                    <td className="py-8 px-4 border-b">{caregiver.phone}</td>
                                    <td className="py-8 px-4 border-b flex space-x-4">  
                                        <button className="text-red-500 ml-2">
                                            <FontAwesomeIcon icon={faTrashAlt} /> 
                                        </button>
                                        <button className="text-gray-500 ml-8">
                                            <FontAwesomeIcon icon={faEdit} /> 
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Caregiver;
