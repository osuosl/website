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

// Status notices. Fills the strip under the navigation with open incidents,
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

  // Intl throws on an invalid date, which would hide every notice, and
  // new Date(null) is the 1970 epoch, so both come back as null.
  function toDate(value) {
    var date = new Date(value);
    return value && !isNaN(date) ? date : null;
  }

  function formatTime(date) {
    if (!date) {
      return "";
    }
    var sameDay = date.toDateString() === new Date().toDateString();
    return (sameDay ? timeFormat : dayTimeFormat).format(date);
  }

  // An end before the start would print nonsense (or throw in older
  // browsers), so it shows the start alone. formatRange gives both ends one
  // zone label, which misstates a window across a daylight saving change,
  // so those get each end formatted on its own.
  function formatRange(start, end) {
    if (!start || !end || end < start) {
      return formatTime(start);
    }
    if (dayTimeFormat.formatRange && start.getTimezoneOffset() === end.getTimezoneOffset()) {
      return dayTimeFormat.formatRange(start, end);
    }
    return dayTimeFormat.format(start) + " – " + dayTimeFormat.format(end);
  }

  // Joins the parts of a notice's meta text that are present.
  function meta(parts) {
    return parts
      .filter(function (part) {
        return part;
      })
      .join(" · ");
  }

  function postUrl(kind, id) {
    return new URL("pages/" + kind + "/" + pageId + "/" + id, statusUrl).href;
  }

  function latestMessage(item) {
    var messages = (item.messages || []).slice();
    // An invalid date sorts as oldest rather than breaking the sort.
    messages.sort(function (a, b) {
      return (toDate(b.datetime) || 0) - (toDate(a.datetime) || 0);
    });
    return messages[0] || {};
  }

  function notices(result) {
    var now = Date.now();
    var list = [];

    (result.incidents || []).forEach(function (incident) {
      var message = latestMessage(incident);
      var level = severity[message.status] || { label: "Incident", tone: "warning" };
      var opened = formatTime(toDate(incident.datetime_open));
      list.push({
        icon: "incident",
        tone: level.tone,
        rank: message.status || 0,
        label: level.label,
        title: incident.name,
        meta: meta([states[message.state], opened && "since " + opened]),
        href: postUrl("incident", incident._id),
      });
    });
    list.sort(function (a, b) {
      return b.rank - a.rank;
    });

    var maintenance = result.maintenance || {};
    (maintenance.active || []).forEach(function (item) {
      var start = toDate(item.datetime_planned_start);
      var end = toDate(item.datetime_planned_end);
      var when = "";
      if (end && end > now) {
        when = "until " + formatTime(end);
      } else if (start) {
        when = "since " + formatTime(start);
      }
      list.push({
        icon: "maintenance",
        tone: "info",
        label: "Maintenance in progress",
        title: item.name,
        meta: when,
        href: postUrl("maintenance", item._id),
      });
    });

    // Without a start date there's no telling whether it falls in the window.
    // A window that has already ended can stay "upcoming" when nobody marks
    // it started, so those are left out too.
    (maintenance.upcoming || [])
      .filter(function (item) {
        var start = toDate(item.datetime_planned_start);
        var end = toDate(item.datetime_planned_end) || start;
        return start && start - now <= upcomingWindow && end > now;
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
          meta: formatRange(toDate(item.datetime_planned_start), toDate(item.datetime_planned_end)),
          href: postUrl("maintenance", item._id),
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
      if (notice.meta) {
        inner.appendChild(el("span", "status-notice-meta", notice.meta));
      }
      var link = el("a", "status-notice-link", "Details");
      link.href = notice.href;
      link.appendChild(el("span", "visually-hidden", " on " + notice.title));
      var arrow = el("span", null, " →");
      arrow.setAttribute("aria-hidden", "true");
      link.appendChild(arrow);
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
