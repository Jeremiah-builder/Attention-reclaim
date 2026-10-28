/* Pass the brief. Progress stays in this browser. Nothing is posted. */
(function () {
  var key = "mr-pass";
  var names = ["get", "bend", "pass"];
  var labels = { get: "Get", bend: "Bend", pass: "Pass" };
  var tips = {
    newsletter: "Newsletter — paste once in an issue",
    circle: "Parent circle — send to the group chat, don’t blast a public feed",
    forum: "Forum — one clear post, no spam",
    other: "Other — one room you already belong to"
  };

  function load() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(key) || "");
      if (saved && typeof saved === "object") return saved;
    } catch (err) {}
    return { get: false, bend: false, pass: false, room: "" };
  }

  function save(state) {
    try { sessionStorage.setItem(key, JSON.stringify(state)); } catch (err) {}
  }

  function paint(state) {
    var current = "get";
    if (state.get && !state.bend) current = "bend";
    else if (state.bend && !state.pass) current = "pass";
    else if (state.pass) current = "pass";
    document.querySelectorAll("[data-pip]").forEach(function (item) {
      var name = item.getAttribute("data-pip");
      item.classList.toggle("is-done", !!state[name]);
      item.classList.toggle("is-current", !state.pass && name === current && !state[name]);
      if (!state.pass && name === current && !state[name]) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    var step = 1;
    if (state.get) step = 2;
    if (state.bend) step = 3;
    if (state.pass) step = 3;
    var line = state.pass ? "Passed. Thank you." : "Step " + step + " of 3 — " + labels[state.pass ? "pass" : current];
    document.querySelectorAll("[data-step-line]").forEach(function (node) { node.textContent = line; });
    document.querySelectorAll("[data-done]").forEach(function (node) { node.hidden = !state.pass; });
    document.querySelectorAll("[data-reset-wrap]").forEach(function (node) { node.hidden = !state.pass; });
  }

  var state = load();
  paint(state);

  var read = document.querySelector("[data-read]");
  if (read) {
    read.addEventListener("click", function () {
      state.get = true;
      save(state);
      paint(state);
    });
  }

  function versionEnough(value) {
    var text = String(value || "").trim();
    if (!text) return false;
    var words = text.split(/\s+/).length >= 4;
    var sentence = /[.!?]/.test(text);
    return text.length > 12 && (words || sentence);
  }

  function shareText(room, version) {
    var line = "I am sharing Mind Reclaim’s story with " + room + ".";
    if (version) {
      line += " Here is my version: " + version;
      if (!/[.!?]$/.test(version)) line += ".";
    }
    line += " Original: mindreclaim.org · Talk with us: https://discord.gg/BrMMWHwcz";
    return line;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return "copied"; });
    }
    if (navigator.share) {
      return navigator.share({ text: text }).then(function () { return "shared"; });
    }
    return Promise.reject(new Error("no-copy"));
  }

  var version = document.querySelector("[name=version]");
  if (version) {
    version.addEventListener("input", function () {
      state.bend = versionEnough(version.value);
      save(state);
      paint(state);
    });
  }

  document.querySelectorAll("[data-room]").forEach(function (button) {
    button.addEventListener("click", function () {
      var room = button.getAttribute("data-room");
      state.room = room;
      save(state);
      document.querySelectorAll("[data-room]").forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      var tip = document.querySelector("[data-room-tip]");
      if (tip) tip.textContent = tips[room] || "";
      var field = document.querySelector("[name=room]");
      if (field && !field.value.trim()) field.value = button.textContent.trim();
    });
  });

  var pass = document.querySelector("[data-pass]");
  if (pass) {
    pass.addEventListener("click", function () {
      var roomField = document.querySelector("[name=room]");
      var linkField = document.querySelector("[name=version]");
      var room = roomField ? roomField.value.trim() : "";
      var link = linkField ? linkField.value.trim() : "";
      if (!room) room = "people I know";
      var text = shareText(room, link);
      state.bend = versionEnough(link);
      state.pass = true;
      save(state);
      paint(state);
      var status = document.querySelector("[data-pass-status]");
      copyText(text).then(function (kind) {
        if (status) status.textContent = kind === "shared" ? "Shared." : "Copied.";
      }).catch(function () {
        if (status) status.textContent = text;
      });
    });
  }

  var reset = document.querySelector("[data-reset]");
  if (reset) {
    reset.addEventListener("click", function () {
      state = { get: false, bend: false, pass: false, room: "" };
      save(state);
      paint(state);
      var form = document.querySelector("[data-brief-form]");
      if (form) form.reset();
      document.querySelectorAll("[data-room]").forEach(function (button) {
        button.setAttribute("aria-pressed", "false");
      });
      var tip = document.querySelector("[data-room-tip]");
      if (tip) tip.textContent = "";
      var status = document.querySelector("[data-pass-status]");
      if (status) status.textContent = "";
    });
  }
})();
