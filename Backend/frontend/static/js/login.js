import {getCSRFToken} from './csrf.js'

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form')
    const feedback = document.querySelector("#feedback")

    form.addEventListener('submit', async function(event){
        event.preventDefault()

        const formData = {
            username_or_email: document.querySelector("#username_or_email").value,
            password: document.querySelector("#password").value
        }

        try{
            const response = await fetch("http://localhost:8000/api/authenticate/login/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if(response.ok){
                feedback.style.color = 'green'
                feedback.textContent = JSON.stringify(data, null, 2)
                form.reset()
            } else {
                feedback.style.color = 'red'
                feedback.textContent = data.error
            }

        } catch(error){
            feedback.style.color = 'red'
            feedback.textContent = error;
        }
    })
})