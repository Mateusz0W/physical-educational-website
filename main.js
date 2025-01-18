const BASE_URL = window.location.hostname === 'localhost'
? 'http://localhost:9013'
: 'http://pascal.fis.agh.edu.pl:9013';


const buttonDiv =document.getElementById("Buttons");

window.addEventListener("load",function(){
    const token =this.localStorage.getItem("accessToken");
    if(token)
    {    
        addButtons("Zapisz",save);
        addButtons("Wczytaj",load);
        addButtons("Wyloguj się",logout);
    }    
})
function addButtons(name,clickHandler){
    const button=document.createElement("button");
    button.innerText = name;
    button.addEventListener("click",clickHandler);
    buttonDiv.appendChild(button);
}
function logout(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    location.reload();
    alert("Wylogowano się");
}
async function save(){
    const token = localStorage.getItem("accessToken"); 
    if (!token) {
        alert("Brak autoryzacji. Zaloguj się ponownie.");
        return;
    }
    const parameters={
        length: document.getElementById("length").value,
        mass: document.getElementById("mass").value,
        springConstant: document.getElementById("spring-constant").value,
        gravity: document.getElementById("gravity").value,
        angle: document.getElementById("angle").value,
        massX: document.getElementById("massX").value,
        massY: document.getElementById("massY").value,
    }
    try {
        const response = await fetchWithRefresh(`${BASE_URL}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(parameters),
        });
        const result =await response.json();
        if(response.ok)
            alert("zapisano Parametry");
        else
            alert(`Błąd: ${result.error}`);
    }
    catch (error) {
        console.error("Błąd zapisu: ", error);
    }
}
async function load(){
    const token = localStorage.getItem("accessToken"); 
    if (!token) {
        alert("Brak autoryzacji. Zaloguj się ponownie.");
        return;
    }
    try {
        const response = await fetchWithRefresh(`${BASE_URL}/load`, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        });
        const result =await response.json();
        if(response.ok){
            document.getElementById("length").value = result.length;
            document.getElementById("mass").value = result.mass;
            document.getElementById("spring-constant").value = result.springConstant;
            document.getElementById("gravity").value = result.gravity;
            document.getElementById("angle").value = result.angle;
            document.getElementById("massX").value = result.massX;
            document.getElementById("massY").value = result.massY;

            alert("Parametry wczytane!");
        }
        else {
            alert(`Błąd: ${result.error}`);
        }
    }
    catch (error) {
        console.error("Błąd wczytywania: ", error);
    }
}
async function fetchWithRefresh(url, options = {}) {
    let response = await fetch(url, options);

    if (response.status === 403) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            alert("Brak tokena odświeżania. Zaloguj się ponownie.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "login.html";
            return;
        }

        const refreshResponse = await fetch(`${BASE_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
            const { accessToken } = await refreshResponse.json();
            localStorage.setItem("accessToken", accessToken);

            options.headers = {
                ...options.headers,
                'Authorization': accessToken,
            };
            response = await fetch(url, options);
        } else {
            const errorText = await refreshResponse.text();
            alert(`Sesja wygasła: ${errorText}`);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "login.html";
            return;
        }
    }
    return response;
}
