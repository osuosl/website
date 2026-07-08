// Displays formsender's error details when it redirects back to the form
// page with ?error=<number>&message=<text> in the query string.
(function () {
  var params = new URLSearchParams(window.location.search);
  var errorNumber = params.get("error");
  var errorMessage = params.get("message");

  if (!errorNumber || !errorMessage) {
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.createElement("div");
    box.className = "form-error";
    box.setAttribute("role", "alert");
    box.style.color = "red";

    var heading = document.createElement("h3");
    heading.textContent = "An error occurred with your form submission";
    var number = document.createElement("p");
    number.textContent = "Error number: " + errorNumber;
    var message = document.createElement("p");
    message.textContent = "Error message: " + errorMessage;
    box.append(heading, number, message);

    var form = document.querySelector(".webform-client-form");
    if (form && form.parentNode) {
      form.parentNode.insertBefore(box, form);
    } else {
      (document.querySelector("main") || document.body).prepend(box);
    }
  });
})();
