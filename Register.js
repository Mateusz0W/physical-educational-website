document.getElementById("registerButton").addEventListener("click",async function (event){
    event.preventDefault();

    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;

    try{
        const response = await fetch('http://localhost:9013/register',{
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
        const response = await fetch('http://localhost:9013/login',{
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
            localStorage.setItem("token", result.token);
            window.location.href = "index.html";
        }
        else
            messageElement.innerHTML = `Błąd: ${result.error}`;
    }
    catch(error){
        console.error("Błąd; " ,error);
    }
})