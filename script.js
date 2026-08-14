document.addEventListener("DOMContentLoaded", () => {


const cards = document.querySelectorAll(".cards div");


cards.forEach((card,index)=>{

card.style.opacity="0";
card.style.transform="translateY(40px)";


setTimeout(()=>{

card.style.transition="0.8s";
card.style.opacity="1";
card.style.transform="translateY(0)";

},index*200);


});



const title = document.querySelector(".hero h2");


let text = title.innerHTML;

title.innerHTML="";


let i=0;


function typing(){

if(i < text.length){

title.innerHTML += text[i];

i++;

setTimeout(typing,80);

}

}


typing();



});
