// counter variable    
if (!localStorage.getItem('counter')){
    localStorage.setItem('counter', 0);
}
            
// count function
function count(){
    let counter = localStorage.getItem('counter');
    counter++;
    document.querySelector("h1").innerHTML = counter;
    localStorage.setItem('counter', counter);
}

// add event listener to the button
document.addEventListener("DOMContentLoaded", function(){
    document.querySelector("h1").innerHTML = localStorage.getItem('counter');
    document.querySelector("button").onclick = count;

});
    