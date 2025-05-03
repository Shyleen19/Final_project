import axios from 'axios'

// create custom axios instance.
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' }
});

class BackendConnection {
    setHeaders(token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    async login(usernameOrEmail, password) {
        const response = await apiClient.post('/api/authenticate/login/', {
            username_or_email: usernameOrEmail,
            password: password
        })

        return response.data
    }

    async get_roles() {
        const response = await apiClient.get("/api/roles/")

        return response.data
    }

    async register(formData) {
        const response = await apiClient.post('/api/authenticate/register/', formData)

        return response.data
    }

    async get_caregivers() {
        try {
            const caregivers = await apiClient.get('/api/caregivers');
            return caregivers.data;

        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('‼️‼️ Oops !Session expired. Please log in again.');
            } else if (error.response && error.response.status === 500) {
                throw new Error('‼️‼️ Oops! Server Error. Please try again later.');
            } else {
                throw new Error("An unknown error")
            }
        }
    }

    async delete_caregiver(caregiver_id) {
        try {
            await apiClient.delete(`/api/caregivers/${caregiver_id}/delete/`)
            return "✅✅ Caregiver deleted successfully."
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('‼️‼️ Oops !Session expired. Please log in again.');
            } else if (error.response && error.response.status === 500) {
                throw new Error('‼️‼️ Oops! Server Error. Please try again later.');
            } else {
                throw new Error("An unknown error")
            }
        }
    }

    async add_caregiver(formData) {
        try {
            console.log("Services", formData)
            const response = await apiClient.post('/api/caregivers/add-caregiver/', formData)

            return response.data

        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('‼️‼️ Oops !Session expired. Please log in again.');
            } else if (error.response && error.response.status === 500) {
                throw new Error('‼️‼️ Oops! Server Error. Please try again later.');
            } else if (error.response && error.response.data) {
                // Extract error message from Django
                const messages = Object.values(error.response.data).flat().join(' ');
                throw new Error(messages);
            } else {
                console.log(error)
                throw new Error("Something went wrong." + error)
            }
        }
    }

    async get_patients() {
        try {
            const patients = await apiClient.get('/api/caregivers/my-patients/')
            return patients.data
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('‼️‼️ Oops !Session expired. Please log in again.');
            } else if (error.response && error.response.status === 500) {
                throw new Error('‼️‼️ Oops! Server Error. Please try again later.');
            } else {
                throw new Error(error.message + ". Please try again later.")
            }
        }
    }


    async get_vitals(user_id=0) {
        try {
            let vitals
            if (user_id === 0) {
                vitals = await apiClient.get('/api/vitals/')
                return vitals.data
            } else {
                vitals = await apiClient.get(`/api/vitals/${user_id}`)
                return vitals.data
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('‼️‼️ Oops !Session expired. Please log in again.');
            } else if (error.response && error.response.status === 500) {
                throw new Error('‼️‼️ Oops! Server Error. Please try again later.');
            } else if (error.response && error.response.data) {
                // Extract error message from Django
                const messages = Object.values(error.response.data).flat().join(' ');
                throw new Error(messages);
            } else if (error.response && error.response.status === 404) {
                throw new Error('‼️‼️ Oops! Invalid request made. Please contact admin.');
            } else {
                throw new Error("Something went wrong.")
            }
        }
    }

    async record_vitals(formData) {
        try {
            const response = await apiClient.post('/api/vitals/',formData)
            return response.data
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear()
                throw new Error('‼️‼️ Oops !Session expired. Please log in again.');
                
            } else if (error.response && error.response.status === 500) {
                throw new Error('‼️‼️ Oops! Server Error. Please try again later.');
            } else if (error.response && error.response.data) {
                // Extract error message from Django
                const messages = Object.values(error.response.data).flat().join(' ');
                throw new Error(messages);
            } else {
                throw new Error("Something went wrong. " + error.message)
            }
        }
    }

}
export default new BackendConnection();