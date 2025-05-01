import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import BackendConnection from '../services/BackendConnection.js';


const PatientCaregivers = ({ token }) => {
    const [caregivers, setCaregivers] = useState([])
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchCaregivers = async () => {
        try {
            BackendConnection.setHeaders(localStorage.getItem('token'))
            const data = await BackendConnection.get_caregivers()

            setCaregivers(data)

        } catch (error) {
            setError(error.message ? error.message : "An unknown Error has occurred.")
            console.log(error)
        }
    }

    const deleteCaregiver = async (caregiver_id) => {
        try {
            const confirmation = window.confirm("Are you sure you want to delete the user?");

            if (confirmation) {
                await BackendConnection.delete_caregiver(caregiver_id);
                setSuccess(" 🎉 Caregiver deleted successfully.");
                setTimeout(() => {
                    setSuccess("");
                    fetchCaregivers();  // Fetch after message has time to show
                }, 3000);
            } else {

                setError("⚠️ Caregiver deletion canceled.");
            }
        } catch (error) {
            setError("‼️ Ooops" + error.message || "An unknown error occurred while deleting the user.");
        } finally {
            setTimeout(() => {
                setError("")
                setSuccess("")

            }, 5000)
        }

    };


    useEffect(() => {
        if (!token) {
            setError('Please login to access this page.')

            setTimeout(() => {
                navigate('/login')
            }, 2000)
            return;
        }

        fetchCaregivers()
    }, [navigate, token])



    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-[#a5bbc2] p-5">
                <header className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex items-center mr-12">
                        <span className="text-xl mr-4 bg-[#A8E6EF] px-4 py-1 rounded-lg">05:10:10</span>
                        <FontAwesomeIcon icon={faBell} className="text-xl text-gray-600" />
                    </div>
                </header>
                <p className="text-xl mt-2">Good Morning Jay</p>

                {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded relative mt-4">
                    {error}
                </div>}
                {success && <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded relative mt-4">
                    {success}
                </div>}

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
                            {caregivers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 px-4 border-b text-center text-red-500">
                                        No caregivers found for this patient.
                                    </td>
                                </tr>
                            ) : (

                                caregivers.map((caregiver, index) => (
                                    <tr key={caregiver.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-[#EDFCFF]' : 'bg-white'}`}>
                                        <td className="py-8 px-4 border-b">{caregiver.first_name}</td>
                                        <td className="py-8 px-4 border-b">{caregiver.last_name}</td>
                                        <td className="py-8 px-4 border-b">{caregiver.relationship_with_patient}</td>
                                        <td className="py-8 px-4 border-b">{caregiver.email}</td>
                                        <td className="py-8 px-4 border-b">{caregiver.phone}</td>
                                        <td className="py-8 px-4 border-b flex space-x-4">
                                            <button className="text-red-500 ml-2" onClick={() => deleteCaregiver(caregiver.id)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                            <button className="text-gray-500 ml-8">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </td>
                                    </tr>
                                ))

                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PatientCaregivers;
