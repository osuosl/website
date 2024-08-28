document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById("open-search");
    var menu = document.querySelector(".search-modal");
    var close = document.getElementById("close-search")
    button.addEventListener("click", function () {
        menu.classList.add("show");
        menu.classList.remove("hide");
    });

    close.addEventListener("click", function () {
        menu.classList.add("hide");
        menu.classList.remove("show");
    });
})