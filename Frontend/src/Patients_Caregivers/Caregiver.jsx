import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEdit, faTrashAlt, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import BackendConnection from '../services/BackendConnection.js';
import Dashboard from '../Patients_Dashboard/Dashboard.jsx';


const PatientCaregivers = ({ token, caregiver }) => {
    const [caregivers, setCaregivers] = useState([])
    const [patients, setPatients] = useState([])
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        relationship: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddCaregiver = () => {
        setCaregivers([...caregivers, formData]);
        setFormData({ firstName: '', lastName: '', relationship: '', email: '', phone: '' });
        setIsModalOpen(false);
    };

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

    const fetchPatients = async () => {
        try {
            BackendConnection.setHeaders(localStorage.getItem('token'))
            const data = await BackendConnection.get_patients()
            console.log(data)
            setPatients(data)
        } catch (error) {
            setError(error.message ? error.message : "An unknown Error has occurred.")
            console.log(error)
        }
    }

    const handleViewPatientVitals = (user_id, first_name, last_name) => {

        navigate('/caregiver/view-vitals', { state: { user_id, first_name, last_name } });
    }


    useEffect(() => {
        if (!token) {
            setError('Please login to access this page.')

            setTimeout(() => {
                navigate('/login')
            }, 2000)
            return;
        }

        caregiver ? fetchPatients() : fetchCaregivers();
    }, [navigate, token])



    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-[#EDFCFF] p-5">
                <header className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold"> {caregiver ? "Caregiver's" : "Patients"} Dashboard</h1>
                    <div className="flex items-center mr-12">
                        <span className="text-xl mr-4 bg-[#A8E6EF] px-4 py-1 rounded-lg">05:10:10</span>
                        <FontAwesomeIcon icon={faBell} className="text-xl text-gray-600" />
                    </div>
                </header>
                <p className="text-xl mt-2">Good Morning {localStorage.getItem('name')}</p>

                {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded relative mt-4">
                    {error}
                </div>}
                {success && <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded relative mt-4">
                    {success}
                </div>}

                {caregiver ? (
                    <div className="bg-[#E0F7FA] text-[#0277BD] border border-[#4FC3F7] px-6 py-4 rounded-lg shadow-sm mt-4 font-medium">
                        💙 You’re viewing all patients currently under your care.
                    </div>


                ) : (
                    <div className="flex justify-end mt-4">
                        <button onClick={() => setIsModalOpen(true)} className="bg-[#00D9FF] text-white py-2 px-4 rounded shadow-md hover:bg-[#00c1e6]">ADD CAREGIVER</button>
                    </div>

                )}

                <div className="overflow-x-auto mt-4">
                    <table className="w-full bg-white rounded-lg shadow border-collapse">
                        <thead className="bg-[#00D9FF] text-black">
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
                            {caregiver ? (
                                patients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-8 px-4 border-b text-center text-red-500">
                                            No patient found for this caregiver
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient, index) => (
                                        <tr key={patient.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-[#EDFCFF]' : 'bg-white'}`}>
                                            <td className="py-8 px-4 border-b">{patient.first_name}</td>
                                            <td className="py-8 px-4 border-b">{patient.last_name}</td>
                                            <td className="py-8 px-4 border-b">{patient.relationship_with_patient}</td>
                                            <td className="py-8 px-4 border-b">{patient.email}</td>
                                            <td className="py-8 px-4 border-b">{patient.phone}</td>
                                            <td className="py-8 px-4 border-b flex space-x-4">
                                                <button className="text-blue-500 ml-2" title='View Vitals' onClick={() => (handleViewPatientVitals(patient.user_id, patient.first_name, patient.last_name))}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button className="text-gray-500 ml-8">
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                caregivers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-8 px-4 border-b text-center text-red-500">
                                            No caregiver found for this patient
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
                                )
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Modal Overlay */}
                {isModalOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                            <h2 className="text-2xl font-bold text-center mb-6 text-[#00D9FF]">Add Caregiver</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 mb-1">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter First Name" className="w-full border-0 border-b-2 border-gray-300 focus:border-[#00D9FF] focus:ring-0 px-2 py-1" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter Last Name" className="w-full border-0 border-b-2 border-gray-300 focus:border-[#00D9FF] focus:ring-0 px-2 py-1" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Relationship</label>
                                    <input type="text" name="relationship" value={formData.relationship} onChange={handleInputChange} placeholder="Enter Relationship" className="w-full border-0 border-b-2 border-gray-300 focus:border-[#00D9FF] focus:ring-0 px-2 py-1" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" className="w-full border-0 border-b-2 border-gray-300 focus:border-[#00D9FF] focus:ring-0 px-2 py-1" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter Phone" className="w-full border-0 border-b-2 border-gray-300 focus:border-[#00D9FF] focus:ring-0 px-2 py-1" />
                                </div>
                            </div>

                            <button onClick={handleAddCaregiver} className="mt-8 w-full bg-[#00D9FF] hover:bg-[#00c1e6] text-white py-2 rounded-lg shadow">Save Caregiver</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientCaregivers;
