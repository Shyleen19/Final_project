import axios from 'axios'

// create custom axios instance.
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' }
});

const handleError = (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.clear()
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

class BackendConnection {
    setHeaders(token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    async login(usernameOrEmail, password) {
        try {
            const response = await apiClient.post('/api/authenticate/login/', {
                username_or_email: usernameOrEmail,
                password: password
            })

            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async resendEmail(email) {
        try {
            const response = await apiClient.post(`/api/authenticate/resend-email/${email}/`)

            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async get_roles() {
        try {
            const response = await apiClient.get("/api/roles/")

            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async register(formData) {
        try {
            const response = await apiClient.post('/api/authenticate/register/', formData)

            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async get_caregivers() {
        try {
            const caregivers = await apiClient.get('/api/caregivers');
            return caregivers.data;

        } catch (error) {
            handleError(error)
        }
    }

    async delete_caregiver(caregiver_id) {
        try {
            await apiClient.delete(`/api/caregivers/${caregiver_id}/delete/`)
            return "✅✅ Caregiver deleted successfully."
        } catch (error) {
            handleError(error)
        }
    }

    async add_caregiver(formData) {
        try {
            console.log("Services", formData)
            const response = await apiClient.post('/api/caregivers/add-caregiver/', formData)

            return response.data

        } catch (error) {
            handleError(error)
        }
    }

    async get_patients() {
        try {
            const patients = await apiClient.get('/api/caregivers/my-patients/')
            return patients.data
        } catch (error) {
            handleError(error)
        }
    }


    async get_vitals(user_id = 0) {
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
            handleError(error)
        }
    }

    async record_vitals(formData) {
        try {
            const response = await apiClient.post('/api/vitals/', formData)
            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async get_admin_stats() {
        try {
            const response = await apiClient.get('/api/vitals/stats/')
            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async download_vitals(period = 'weekly', user_id = 0) {
        try {
            const url_path = user_id === 0 ? `/api/vitals/export/?period=${period}` : `/api/vitals/export/${user_id}?period=${period}`;
            const response = await apiClient.get(url_path, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    async chatbot(message, history = []) {
        try {
            const response = await apiClient.post('/api/chatbot/', {
                message: message,
                history: history
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

}
export default new BackendConnection();