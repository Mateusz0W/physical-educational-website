const buttonDiv =document.getElementById("Buttons");

window.addEventListener("load",function(){
    const token =this.localStorage.getItem("token");
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
    localStorage.removeItem("token");
    location.reload();
    alert("Wylogowano się");
}
async function save(){
    const token = localStorage.getItem("token"); 
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
        const response = await fetch('http://localhost:9013/save', {
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
    const token = localStorage.getItem("token"); 
    if (!token) {
        alert("Brak autoryzacji. Zaloguj się ponownie.");
        return;
    }
    try {
        const response = await fetch('http://localhost:9013/load', {
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