document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("contactForm");

if(form){

form.addEventListener("submit", function(e){

e.preventDefault();

let name = form.querySelector("input").value;
let phone = form.querySelectorAll("input")[1].value;
let text = form.querySelector("textarea").value;


let msg =
"درخواست جدید سایت VORIX.SECURITY\n\n" +
"نام: " + name +
"\nشماره: " + phone +
"\nتوضیحات: " + text;


window.open(
"https://wa.me/989357781529?text=" +
encodeURIComponent(msg),
"_blank"
);


});

}

});
