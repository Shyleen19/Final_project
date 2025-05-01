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
            const caregivers = await apiClient.get('api/caregivers');
            return caregivers.data;

        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('‼️‼️ Oops !Session expired. Please log in again.');
            } else if (error.response && error.response.status === 500) {
                throw new Error('‼️‼️ Oops! Server Error. Please try again later.');
            } else {
                throw new Error ("An unknown error")
            }
        }
    }

    async delete_caregiver(caregiver_id) {
        try {
            await apiClient.delete(`/api/caregivers/${caregiver_id}/delete/`)
            return "✅✅ Caregiver deleted successfully."
        } catch(error) {
            console.log(error)
            throw new Error ("‼️‼️ Oops! Unexprected Error occured while deleting the caregiver.")
        }
    }
}

export default new BackendConnection();