import { getCSRFToken } from './csrf.js'

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form')
    const feedback = document.querySelector('#feedback')

    form.addEventListener('submit', async function(event) {
        event.preventDefault()

        const email = document.querySelector('#email').value

        try{
            const response = await fetch("http://localhost:8000/api/authenticate/reset-password/", {
                method: 'POST', 
                headers: {
                    "Content-Type": 'application/json',
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({email: email})
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