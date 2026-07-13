// Displays formsender's error details when it redirects to a page with
// ?error=<number>&message=<text> in the query string. On the
// /form-submitted page this also hides the success copy so users are not
// told their submission worked when it did not.
(function () {
  var params = new URLSearchParams(window.location.search);
  var errorNumber = params.get("error");
  var errorMessage = params.get("message");

  if (!errorNumber || !errorMessage) {
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var success = document.getElementById("form-success");
    if (success) {
      success.hidden = true;
      // The static page is titled for the success case; correct it.
      var pageHeading = document.querySelector("main h1");
      if (pageHeading) {
        pageHeading.textContent = "Form Not Submitted";
      }
      document.title = document.title.replace("Form Submitted", "Form Not Submitted");
    }

    var box = document.createElement("div");
    box.className = "alert alert-danger";
    box.setAttribute("role", "alert");

    var heading = document.createElement("h3");
    heading.className = "h5";
    heading.textContent = "An error occurred with your form submission";
    var message = document.createElement("p");
    message.textContent = "Error " + errorNumber + ": " + errorMessage;
    var advice = document.createElement("p");
    advice.className = "mb-0";
    advice.textContent = "Please go back, correct the problem, and submit the form again.";
    box.append(heading, message, advice);

    var form = document.querySelector(".webform-client-form");
    if (form && form.parentNode) {
      form.parentNode.insertBefore(box, form);
    } else {
      (document.querySelector("main .prose") || document.querySelector("main") || document.body).prepend(box);
    }
  });
})();
