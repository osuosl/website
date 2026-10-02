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
//
//    The custom validity is only applied once the user has tried to
//    submit. Setting it at load would expose the group's first checkbox
//    as invalid before the user has touched anything — a screen reader
//    would announce "Debian, checkbox, not checked, invalid entry" on a
//    box nobody chose (WCAG 4.1.2: the exposed state must reflect
//    reality). The legend carries a visually-hidden "(required)" so the
//    requirement is knowable up front without faking an error state.
// 3. Toggle checkboxes (type: toggle) reveal and enable a group of
//    follow-up fields, such as the VM details on the hosting form.
// 4. Fields with shown_when appear only while another field has a given
//    value, such as OpenStack access when the platform is OpenStack.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".webform-client-form").forEach(function (form) {
      var redirect = form.querySelector('input[name="redirect"][data-relative-value]');
      if (redirect) {
        redirect.value = new URL(redirect.getAttribute("data-relative-value"), window.location.href).href;
      }

      // Toggles: show and enable the revealed group only while its
      // checkbox is checked. A browser restores checked boxes on back
      // navigation after DOMContentLoaded, without a change event, so
      // sync again on pageshow; otherwise a restored box submits with its
      // follow-up fields still hidden and disabled.
      form.querySelectorAll("input[data-reveals]").forEach(function (toggle) {
        var group = document.getElementById(toggle.getAttribute("data-reveals"));
        if (!group) {
          return;
        }
        var sync = function () {
          group.hidden = !toggle.checked;
          group.disabled = !toggle.checked;
        };
        toggle.addEventListener("change", sync);
        window.addEventListener("pageshow", sync);
        sync();
      });

      // Conditional fields (shown_when): shown and enabled only while
      // another field has a given value. A hidden field is disabled, so it
      // is neither submitted nor checked for required, and counts as
      // unanswered for fields that depend on it, as does an unchecked box. Every change re-syncs all
      // of them in page order, so chains (a field shown by a field that is
      // itself conditional) settle in one pass.
      var shown = [];
      form.querySelectorAll("[data-shown-when]").forEach(function (wrapper) {
        var source = document.getElementById(wrapper.getAttribute("data-shown-when"));
        if (!source) {
          return;
        }
        var controls = wrapper.querySelectorAll("input, select, textarea");
        var values = JSON.parse(wrapper.getAttribute("data-shown-values"));
        shown.push(function () {
          var picked = source.type !== "checkbox" || source.checked;
          var on = !source.matches(":disabled") && picked && values.indexOf(source.value) !== -1;
          wrapper.hidden = !on;
          controls.forEach(function (control) {
            control.disabled = !on;
          });
        });
      });
      var syncShown = function () {
        shown.forEach(function (sync) {
          sync();
        });
      };
      form.addEventListener("change", syncShown);
      window.addEventListener("pageshow", syncShown);
      syncShown();

      var groups = [];
      form.querySelectorAll("fieldset[data-required-group]").forEach(function (group) {
        var boxes = group.querySelectorAll('input[type="checkbox"]');
        if (!boxes.length) {
          return;
        }
        var enforced = false;
        var sync = function () {
          if (!enforced) {
            return;
          }
          // A box inside a toggle's disabled group can stay checked after
          // its toggle is unchecked; it is not submitted, so it doesn't count.
          var anyChecked = Array.prototype.some.call(boxes, function (box) {
            return box.checked && !box.matches(":disabled");
          });
          var message = group.getAttribute("data-required-message") || "Please select at least one option.";
          boxes[0].setCustomValidity(anyChecked ? "" : message);
        };
        boxes.forEach(function (box) {
          box.addEventListener("change", sync);
        });
        groups.push(function () {
          enforced = true;
          sync();
        });
      });

      // Start enforcing at the first submit attempt. A click on the submit
      // button runs before the browser's validity check, and pressing
      // Enter in a field fires that same click via implicit submission.
      var submit = form.querySelector('button[type="submit"]');
      if (submit) {
        submit.addEventListener("click", function () {
          groups.forEach(function (enforce) {
            enforce();
          });
        });
      }
    });
  });
})();
