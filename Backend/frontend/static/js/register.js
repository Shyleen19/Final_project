import { getCSRFToken } from "./csrf.js";

/**
 * User Registration
 */


// global functions


// submit user form.
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const feedback = document.getElementById('feedback');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirm_password: document.getElementById('confirm_password').value,
            role: document.getElementById('role').value,
            specialty: document.getElementById('specialty').value || null,
            license_number: document.getElementById('license_number').value || null,
        };

        try {
            const response = await fetch("http://localhost:8000/api/authenticate/register/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                }, 
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                feedback.innerHTML = `<p style="color: green;">${data.success || "Registration successful. Check your email to activate your account."}</p>`;
                form.reset();

                // Delay for 2 seconds then redirect to confirm email page.
                setTimeout(() => {
                    window.location.href = window.location.href.replace("register", "confirm-email")
                }, 3000)
            } else {
                let errorMessage  = "";
                
                for(let key in data) {
                    errorMessage += `<p style="color: red;">${data[key]}</p>`;
                }

                feedback.innerHTML = errorMessage;

            }
        } catch (error){
            feedback.innerHTML = `<p style="color: red;">Something went wrong. Please try again.</p>`;
        }
    });

});

document.addEventListener("DOMContentLoaded", function () {
    const roleSelect = document.getElementById("role");
    const specialtyField = document.getElementById("specialty");
    const licenseField = document.getElementById("license_number");

    function toggleDoctorFields() {
        if (roleSelect.value === "1") {
            specialtyField.style.display = "block";
            licenseField.style.display = "block";
        } else {
            specialtyField.style.display = "none";
            licenseField.style.display = "none";
        }
    }

    roleSelect.addEventListener("change", toggleDoctorFields);
    toggleDoctorFields();
});
