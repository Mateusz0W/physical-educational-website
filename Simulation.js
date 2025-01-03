
dtheta =0;
s=0;
ds=0;

function calculate(massX,massY,theta,length,m,k,g){
    conversion = 50 //1 meter in px

    

    tInc = 0.017 //Consistent with 60fps
    
    d2theta =-(g/(length+s))*Math.sin(theta)-(2/(length+s))*ds*dtheta;
    d2s = Math.pow(dtheta,2)*(s+length)-(k/m)*s+g*Math.cos(theta);

    //Verlet's mathod
    dtheta=d2theta*tInc+dtheta;
    ds=d2s*tInc+ds;

    theta=dtheta*tInc+theta;
    s=ds*tInc+s;

    massX = (length+s)*Math.sin(theta)+400;
    massY = (length+s)* Math.cos(theta)+100;

    //energy
    Ek=0.5 *m * (Math.pow(ds,2)+Math.pow((s+length) * theta,2));
    Ep=m*g*massY+0.5*k*Math.pow(s,2);
    Et=Ek+Ep;

    return {massX,massY,theta,dtheta,ds,s};

}
function draw_line(ctx,startX,startY,endX,endY){
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
function draw_circle(ctx, centerX, centerY, radius){
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
}
function draw_frame(massX,massY){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_line(ctx,400,50,massX,massY);
    draw_circle(ctx,massX,massY,5);
}

function animate(massX,massY,theta,l,m,k,g){
    const result = calculate(massX,massY,theta,l*50,m,k,g*50);
    massX = result.massX;
    massY = result.massY;
    theta = result.theta;
    dtheta = result.dtheta;
    ds = result.ds;
    s = result.s;
    draw_frame(massX,massY);
    requestAnimationFrame(() => animate(massX, massY, theta, l, m, k, g));
}

document.getElementById("start-button").addEventListener("click",function(){
    let l = parseFloat(document.getElementById("length").value);
    let m = parseFloat(document.getElementById("mass").value);
    let k = parseFloat(document.getElementById("spring-constant").value);
    let g = parseFloat(document.getElementById("gravity").value);
    let theta = parseFloat(document.getElementById("angle").value)* Math.PI / 180;
    let massX = parseFloat(document.getElementById("massX").value);
    let massY =  parseFloat(document.getElementById("massY").value);

    animate(massX, massY, theta, l, m, k, g);
})



