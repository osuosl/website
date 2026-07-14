// Progressive enhancement for the request forms (request-form shortcode).
//
// 1. Rebase the formsender redirect onto the current origin. The static
//    value points at production, so without this a submission from a
//    staging deploy or local server would land on the production
//    /form-submitted page. reCAPTCHA already requires JavaScript, so
//    every submittable form runs this.
// 2. Required checkbox groups: the HTML "required" attribute cannot
//    express "at least one of these", so keep a custom validity message
//    on the group's first checkbox until any box is checked. Native form
//    validation then blocks submission with the browser's error UI.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".webform-client-form").forEach(function (form) {
      var redirect = form.querySelector('input[name="redirect"][data-relative-value]');
      if (redirect) {
        redirect.value = new URL(redirect.getAttribute("data-relative-value"), window.location.href).href;
      }

      form.querySelectorAll("fieldset[data-required-group]").forEach(function (group) {
        var boxes = group.querySelectorAll('input[type="checkbox"]');
        if (!boxes.length) {
          return;
        }
        var sync = function () {
          var anyChecked = Array.prototype.some.call(boxes, function (box) {
            return box.checked;
          });
          boxes[0].setCustomValidity(anyChecked ? "" : "Please select at least one option.");
        };
        boxes.forEach(function (box) {
          box.addEventListener("change", sync);
        });
        sync();
      });
    });
  });
})();
