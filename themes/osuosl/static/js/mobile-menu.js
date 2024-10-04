document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById("toggle-mobile-menu");
    var menu = document.querySelector(".mobile-menu");
    button.addEventListener("click", function () {
        menu.classList.toggle("show");
    })
});