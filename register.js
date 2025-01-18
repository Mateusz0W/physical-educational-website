const BASE_URL = window.location.hostname === 'localhost'
? 'http://localhost:9013'
: 'http://pascal.fis.agh.edu.pl:9013';

document.getElementById("registerButton").addEventListener("click",async function (event){
    event.preventDefault();

    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;

    try{
        const response = await fetch(`${BASE_URL}/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const result =await response.json();
        const messageElement = document.getElementById("message");
        if(response.ok)
            messageElement.innerHTML =result.message;
        else
            messageElement.innerHTML = `Błąd: ${result.error}`;
    }
    catch(error){
        console.error("Błąd; " ,error);
    }
})
document.getElementById("loginButton").addEventListener("click",async function (event) {
    event.preventDefault();

    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;

    try{
        const response = await fetch(`${BASE_URL}/login`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        const result =await response.json();
        const messageElement = document.getElementById("message");
        if(response.ok){
            messageElement.innerHTML =result.message;
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken",result.refreshToken);

            window.location.href = "index.html";
        }
        else
            messageElement.innerHTML = `Błąd: ${result.error}`;
    }
    catch(error){
        console.error("Błąd; " ,error);
    }
})