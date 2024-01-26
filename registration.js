let optinalForm = document.getElementById("optionalForm");
let registrationForm = document.getElementById("registrationForm")
let addExtra = document.getElementById("optional");
let back = document.getElementById("back");

optinalForm.style.visibility = 'hidden';

addExtra.addEventListener("click", () => {
    registrationForm.style.visibility = 'hidden';
    optinalForm.style.visibility = 'visible';
    optinalForm.parentNode.insertBefore(optinalForm, optionalForm.parentNode.firstChild);
});

back.addEventListener("click", () => {
    registrationForm.style.visibility = 'visible';
    optinalForm.style.visibility = 'hidden';
    registrationForm.parentNode.insertBefore(registrationForm, registrationForm.parentNode.firstChild);
});

addExtra.addEventListener("click", () => {
    registrationForm.style.visibility = 'hidden';
    optinalForm.style.visibility = 'visible';
    optinalForm.parentNode.insertBefore(optinalForm, optionalForm.parentNode.firstChild);
});