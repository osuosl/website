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

// Status notices. Fills the strip under the header with open incidents,
// maintenance in progress and maintenance starting within a week, read
// from the status.io public API. Stays hidden when there is nothing to
// report or the API can't be reached.
(function () {
  var strip = document.getElementById("status-notices");
  if (!strip || !window.fetch) {
    return;
  }

  var pageId = strip.getAttribute("data-page-id");
  var statusUrl = strip.getAttribute("data-status-url");
  var api = "https://api.status.io/1.0/status/" + pageId;
  var cacheKey = "status-notices";
  var cacheTtl = 60 * 1000;
  var upcomingWindow = 7 * 24 * 60 * 60 * 1000;

  // status.io status codes on incident updates; 100 and 200 aren't incidents.
  var severity = {
    300: { label: "Degraded performance", tone: "warning" },
    400: { label: "Partial service disruption", tone: "warning" },
    500: { label: "Service disruption", tone: "danger" },
    600: { label: "Security event", tone: "danger" },
  };
  var states = { 100: "Investigating", 200: "Identified", 300: "Monitoring" };

  var timeFormat = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  var dayTimeFormat = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  function formatTime(date) {
    var sameDay = date.toDateString() === new Date().toDateString();
    return (sameDay ? timeFormat : dayTimeFormat).format(date);
  }

  function formatRange(start, end) {
    if (dayTimeFormat.formatRange) {
      return dayTimeFormat.formatRange(start, end);
    }
    return dayTimeFormat.format(start) + " – " + dayTimeFormat.format(end);
  }

  function latestMessage(item) {
    var messages = (item.messages || []).slice();
    messages.sort(function (a, b) {
      return new Date(b.datetime) - new Date(a.datetime);
    });
    return messages[0] || {};
  }

  function notices(result) {
    var now = Date.now();
    var list = [];

    (result.incidents || []).forEach(function (incident) {
      var message = latestMessage(incident);
      var level = severity[message.status] || { label: "Incident", tone: "warning" };
      var meta = "since " + formatTime(new Date(incident.datetime_open));
      if (states[message.state]) {
        meta = states[message.state] + " · " + meta;
      }
      list.push({
        icon: "incident",
        tone: level.tone,
        rank: message.status || 0,
        label: level.label,
        title: incident.name,
        meta: meta,
        href: statusUrl + "pages/incident/" + pageId + "/" + incident._id,
      });
    });
    list.sort(function (a, b) {
      return b.rank - a.rank;
    });

    var maintenance = result.maintenance || {};
    (maintenance.active || []).forEach(function (item) {
      var end = new Date(item.datetime_planned_end);
      list.push({
        icon: "maintenance",
        tone: "info",
        label: "Maintenance in progress",
        title: item.name,
        meta: end > now ? "until " + formatTime(end) : "since " + formatTime(new Date(item.datetime_planned_start)),
        href: statusUrl + "pages/maintenance/" + pageId + "/" + item._id,
      });
    });

    (maintenance.upcoming || [])
      .filter(function (item) {
        return new Date(item.datetime_planned_start) - now <= upcomingWindow;
      })
      .sort(function (a, b) {
        return new Date(a.datetime_planned_start) - new Date(b.datetime_planned_start);
      })
      .forEach(function (item) {
        list.push({
          icon: "upcoming",
          tone: "info",
          label: "Scheduled maintenance",
          title: item.name,
          meta: formatRange(new Date(item.datetime_planned_start), new Date(item.datetime_planned_end)),
          href: statusUrl + "pages/maintenance/" + pageId + "/" + item._id,
        });
      });

    return list;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text) {
      node.textContent = text;
    }
    return node;
  }

  function render(result) {
    var list = notices(result);
    strip.querySelectorAll(".status-notice").forEach(function (node) {
      node.remove();
    });
    list.forEach(function (notice) {
      var row = el("div", "status-notice status-notice-" + notice.tone);
      var inner = el("div", "container-site status-notice-inner");
      var icon = strip.querySelector('template[data-icon="' + notice.icon + '"]');
      if (icon) {
        inner.appendChild(icon.content.cloneNode(true));
      }
      inner.appendChild(el("strong", "status-notice-label", notice.label + ":"));
      inner.appendChild(el("span", "status-notice-title", notice.title));
      inner.appendChild(el("span", "status-notice-meta", notice.meta));
      var link = el("a", "status-notice-link", "Details");
      link.href = notice.href;
      link.appendChild(el("span", "visually-hidden", " on " + notice.title));
      link.appendChild(document.createTextNode(" →"));
      inner.appendChild(link);
      row.appendChild(inner);
      strip.appendChild(row);
    });
    strip.hidden = list.length === 0;
  }

  function readCache() {
    try {
      var cached = JSON.parse(sessionStorage.getItem(cacheKey));
      if (cached && Date.now() - cached.time < cacheTtl) {
        return cached.result;
      }
    } catch (e) {}
    return null;
  }

  function writeCache(result) {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), result: result }));
    } catch (e) {}
  }

  var cached = readCache();
  if (cached) {
    render(cached);
    return;
  }

  var controller = window.AbortController ? new AbortController() : null;
  if (controller) {
    setTimeout(function () {
      controller.abort();
    }, 5000);
  }
  fetch(api, { signal: controller && controller.signal })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("status.io returned " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      writeCache(data.result);
      render(data.result);
    })
    .catch(function () {});
})();
