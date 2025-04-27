import axios from 'axios'

// create custom axios instance.
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {'Content-Type': 'application/json'}
});

class BackendConnection {
    setHeaders(token) {
        apiClient.defaults.headers.common['Authorization']=`Token ${token}`
    }

    async login(usernameOrEmail, password) {
        const  response = await apiClient.post('/api/authenticate/login/', {
            username_or_email: usernameOrEmail,
            password: password
        })

        return response.data
    }

    async get_roles(){
        const response = await apiClient.get("/api/roles/")

        return response.data
    }

    async register(formData) {
        const response = await apiClient.post('/api/authenticate/register/', formData)

        return response.data
    }

    

}

export default new BackendConnection();