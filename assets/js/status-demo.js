// Sample data for the status notice strip, for previewing it while
// status.osuosl.org has nothing open. Only non-production builds load this
// (hugo server and the PR previews); see "Previewing the status strip" in the
// README.
//
//   ?status-demo               every kind of notice at once
//   ?status-demo=incident      one notice; also outage, maintenance, upcoming,
//                              baddates (missing or inconsistent dates) and
//                              clear (nothing)
//   ?status-demo=off           back to the live status page
//
// It seeds the cache that site.js reads, so the sample stays on every page of
// the tab for a day, until ?status-demo=off or until the tab closes.
(function () {
  var scenario = new URLSearchParams(location.search).get("status-demo");
  if (scenario === null) {
    return;
  }

  var cacheKey = "status-notices";
  if (scenario === "off") {
    try {
      sessionStorage.removeItem(cacheKey);
    } catch (e) {}
    return;
  }

  var hour = 60 * 60 * 1000;
  function at(hours) {
    return new Date(Date.now() + hours * hour).toISOString();
  }

  var incident = {
    _id: "6a7b752a892d7304f27472ab",
    name: "SMTP services issues",
    datetime_open: at(-0.5),
    messages: [{ status: 400, state: 200, datetime: at(-0.2) }],
  };
  var outage = {
    _id: "6a7f6aa66f989604d7b08006",
    name: "OpenStack Compute API outage",
    datetime_open: at(-2),
    messages: [{ status: 500, state: 100, datetime: at(-2) }],
  };
  var maintenance = {
    _id: "6ac3e43ab1079c5702dd2249",
    name: "OpenStack package migration",
    datetime_planned_start: at(-1),
    datetime_planned_end: at(3),
  };
  var upcoming = {
    _id: "6a061627db7d6f3a87071ed2",
    name: "Network maintenance",
    datetime_planned_start: at(72),
    datetime_planned_end: at(74),
  };
  // Past the 7-day window, so it should never show.
  var later = {
    _id: "6a061627db7d6f3a87071ed3",
    name: "Datacenter move",
    datetime_planned_start: at(24 * 20),
    datetime_planned_end: at(24 * 20 + 4),
  };

  var scenarios = {
    "": [[outage, incident], [maintenance], [upcoming, later]],
    incident: [[incident], [], []],
    outage: [[outage], [], []],
    maintenance: [[], [maintenance], []],
    upcoming: [[], [], [upcoming, later]],
    baddates: [
      [
        incident,
        { _id: "nodate", name: "Incident with no start time", messages: [{ status: 300, state: 300 }] },
        {
          _id: "badupdate",
          name: "Incident with a bad update time (should say Monitoring)",
          datetime_open: at(-1),
          messages: [
            { status: 500, state: 100, datetime: "not a date" },
            { status: 300, state: 300, datetime: at(-0.1) },
          ],
        },
      ],
      [
        {
          _id: "nulldates",
          name: "Maintenance with no times",
          datetime_planned_start: null,
          datetime_planned_end: null,
        },
      ],
      [
        { _id: "nostart", name: "Maintenance with no start (should not show)", datetime_planned_end: at(5) },
        {
          _id: "ended",
          name: "Maintenance that already ended (should not show)",
          datetime_planned_start: at(-48),
          datetime_planned_end: at(-46),
        },
        {
          _id: "reversed",
          name: "Maintenance ending before it starts (start time only)",
          datetime_planned_start: at(30),
          datetime_planned_end: at(28),
        },
        {
          _id: "reversedpast",
          name: "Maintenance with its end typed a day early (start time only)",
          datetime_planned_start: at(30),
          datetime_planned_end: at(-20),
        },
      ],
    ],
    clear: [[], [], [later]],
  };
  var picked = scenarios[scenario] || scenarios[""];

  var result = {
    incidents: picked[0],
    maintenance: { active: picked[1], upcoming: picked[2] },
  };
  try {
    // A timestamp a day ahead keeps site.js using the sample for the whole tab.
    sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now() + 24 * hour, result: result }));
  } catch (e) {}
})();
