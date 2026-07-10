// Color theme toggle (Bootstrap color modes). The pre-paint snippet in
// head.html applies the initial theme; this wires the header button.
(function () {
  var button = document.getElementById("theme-toggle");
  if (!button) {
    return;
  }

  function sync() {
    var dark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    button.setAttribute("aria-pressed", String(dark));
  }

  button.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);
    localStorage.setItem("theme", next);
    sync();
  });

  sync();
})();

// Search dialog. Pagefind's UI assets are generated after the Hugo build,
// so they are loaded lazily the first time the dialog opens.
(function () {
  var dialog = document.getElementById("search-dialog");
  var open = document.getElementById("open-search");
  var close = document.getElementById("close-search");
  if (!dialog || !open || !close) {
    return;
  }

  var loaded = false;
  function loadPagefind() {
    if (loaded) {
      return;
    }
    loaded = true;
    var el = document.getElementById("search");
    var base = el.getAttribute("data-pagefind-base");
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = base + "pagefind-ui.css";
    document.head.appendChild(link);
    var script = document.createElement("script");
    script.src = base + "pagefind-ui.js";
    script.onload = function () {
      new PagefindUI({ element: "#search", showImages: false, showSubResults: true });
      var input = dialog.querySelector("input");
      if (input) {
        input.focus();
      }
    };
    document.head.appendChild(script);
  }

  open.addEventListener("click", function () {
    loadPagefind();
    dialog.showModal();
  });

  close.addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });
})();
