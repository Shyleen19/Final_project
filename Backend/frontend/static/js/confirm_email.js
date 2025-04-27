import { getCSRFToken } from "./csrf.js"

document.addEventListener('DOMContentLoaded', function() {
    const resendForm = document.getElementById("resend-form")
    const userEmail = document.getElementById('user-email')
    feedback = document.querySelector('.feedback')

    resendForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!userEmail) {
            feedback.innerHTML = '<span style = "color: red">An email in non-existent</span>'
            return
        }

        try {
            const response = await fetch('http://localhost:8000/api/authenticate/resend-email/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': getCSRFToken(),
                },

                body: JSON.stringify({email: userEmail}),
            });

            const data = await response.json()

            if (response.ok){
                feedback.style.color = 'green'
                feedback.textContent = data.success
            } else {
                feedback.style.color = 'red'
                feedback.textContent = data.email_error
            }
        } catch (error){
            feedback.style.color = 'red'
            feedback.textContent = error
        }
    })
})