/* Seven-day Starve challenge. Works as plain checkboxes if storage is blocked. */
(function () {
  var root = document.querySelector("[data-starve]");
  if (!root) return;

  var KEY = "mindreclaim-starve-week-v1";
  var rules = root.querySelectorAll("input[data-rule]");
  var days = root.querySelectorAll("input[data-day]");
  var meter = root.querySelector("[data-meter]");
  var meterBar = root.querySelector("[data-meter-bar]");
  var status = root.querySelector("[data-status]");
  var clearBtn = root.querySelector("[data-clear]");

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function countChecked(nodes) {
    var n = 0;
    for (var i = 0; i < nodes.length; i++) if (nodes[i].checked) n++;
    return n;
  }

  function renderStatus() {
    var rc = countChecked(rules);
    var dc = countChecked(days);
    if (meter) meter.setAttribute("aria-valuenow", String(rc));
    if (meterBar) meterBar.style.width = (rules.length ? Math.round((rc / rules.length) * 100) : 0) + "%";
    if (status) {
      status.textContent = rc + " of " + rules.length + " rules kept · " + dc + " of " + days.length + " days marked";
    }
  }

  function apply(state) {
    var ruleState = state.rules || {};
    var dayState = state.days || {};
    for (var i = 0; i < rules.length; i++) rules[i].checked = !!ruleState[rules[i].value];
    for (var j = 0; j < days.length; j++) days[j].checked = !!dayState[days[j].value];
    renderStatus();
  }

  function persistFromDom() {
    var state = { rules: {}, days: {} };
    for (var i = 0; i < rules.length; i++) state.rules[rules[i].value] = rules[i].checked;
    for (var j = 0; j < days.length; j++) state.days[days[j].value] = days[j].checked;
    save(state);
    renderStatus();
  }

  root.addEventListener("change", function (e) {
    var t = e.target;
    if (!t || t.type !== "checkbox") return;
    persistFromDom();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      save({ rules: {}, days: {} });
      apply({});
    });
  }

  apply(load());
})();
