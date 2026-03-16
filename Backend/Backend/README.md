# TelemedRestAPI

TelemedRestAPI is a backend RESTful API built with Django 5.1 and Django REST Framework, designed to support a telemedicine platform. It provides robust user authentication, caregiver and patient management, vitals tracking, and role-based access control.

## 🔧 Tech Stack

- **Python 3.10+**
- **Django 5.1**
- **Django REST Framework**
- **PostgreSQL**
- **JWT Authentication (SimpleJWT)**
- **CORS Headers**
- **Environment Variable Configuration**

## 📁 Project Structure

```plaintext
TelemedRestAPI/
├── Authentication/       # Auth logic (registration, login, etc.)
├── user_profile/         # User profile management
├── Caregivers/           # Caregiver-related endpoints
├── roles/                # Role-based access control
├── Vitals/               # Vitals tracking (e.g., blood pressure, heart rate)
├── frontend/templates/   # Optional frontend template directory
├── TelemedRestAPI/       # Core project settings and URLs
````

## 🚀 Features

* JWT-based Authentication
* Secure Role-based Authorization
* Cross-Origin Resource Sharing (CORS) for frontend integration
* PostgreSQL database support
* Environment-based configuration for secrets
* Modular app structure (Authentication, Vitals, Roles, etc.)
* Extendable and RESTful endpoints

## 🔐 Environment Variables

Create a `.env` file in your root directory and include the following variables:

```env
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost

EMAIL_HOST=smtp.example.com
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_email_password
DEFAULT_FROM_EMAIL=your_email@example.com
```

## 🛠️ Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/TelemedRestAPI.git
   cd TelemedRestAPI
   ```

2. **Create and activate a virtual environment**

   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations**

   ```bash
   python manage.py migrate
   ```

5. **Run the server**

   ```bash
   python manage.py runserver
   ```

## 📫 API Authentication

This API uses JWT for secure authentication.

* Obtain token:

  ```
  POST /api/token/
  {
    "username": "yourusername",
    "password": "yourpassword"
  }
  ```

* Use the token in the `Authorization` header:

  ```
  Authorization: Bearer <your_token>
  ```

## 🌐 CORS Configuration

CORS is enabled for local development environments:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127:8000",
]
```

## 🧪 Running Tests

You can write and run unit tests using Django’s test framework:

```bash
python manage.py test
```
