/* What we can show. Observed seeds live in /show.json. Visitor posts are not added here. */
(function () {
  var mounts = document.querySelectorAll("[data-show]");
  var MIN = 4;
  var labels = { observed: "Observed", idea: "Idea", reading: "Our reading" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function carryLine(title) {
    return "Mind Reclaim keeps a public file of what we can show about feeds, dependence, and the AI race. This card: " + title + ". See the rest: mindreclaim.org/show";
  }

  function card(item) {
    var layer = labels[item.layer] || "Observed";
    return (
      '<article class="chip note-card" data-layer="' + esc(item.layer) + '">' +
      '<p class="kicker">' + esc(layer) + "</p>" +
      '<p class="note-title"><a href="' + esc(item.url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(item.title) +
      '<span class="visually-hidden"> (opens in a new tab)</span></a></p>' +
      "<p>" + esc(item.summary) + "</p>" +
      (item.source ? '<p class="note-meta">' + esc(item.source) + "</p>" : "") +
      '<button type="button" class="carry" data-carry="' + esc(item.title) + '">Carry this</button>' +
      "</article>"
    );
  }

  function copyStatus(anchor) {
    var status = anchor.nextElementSibling;
    if (!status || !status.hasAttribute("data-copy-status")) {
      status = document.createElement("p");
      status.className = "copy-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.setAttribute("data-copy-status", "");
      anchor.insertAdjacentElement("afterend", status);
    }
    return status;
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

  function wireCarry(scope) {
    scope.addEventListener("click", function (event) {
      var button = event.target.closest ? event.target.closest("[data-carry]") : null;
      if (!button || !scope.contains(button)) return;
      var text = carryLine(button.getAttribute("data-carry"));
      copyText(text).then(function (kind) {
        copyStatus(button).textContent = kind === "shared" ? "Shared." : "Copied.";
      }).catch(function () {
        copyStatus(button).textContent = text;
      });
    });
  }

  function wireContribute() {
    var form = document.querySelector("#contribute form");
    if (!form) return;
    var status = form.querySelector("[data-contribute-status]");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var type = String((form.elements.type && form.elements.type.value) || "");
      var linkField = form.elements.link;
      var whyField = form.elements.why;
      var link = linkField ? linkField.value.trim() : "";
      var why = whyField ? whyField.value.trim() : "";
      var name = form.elements.name ? form.elements.name.value : "Anonymous";
      var feature = form.elements.note ? form.elements.note.value : "no";
      if (type === "Reference" && (!link || (linkField && !linkField.checkValidity()))) {
        status.textContent = "A reference needs a checkable link.";
        if (linkField) linkField.focus();
        return;
      }
      if (link && linkField && !linkField.checkValidity()) {
        status.textContent = "A reference needs a checkable link.";
        linkField.focus();
        return;
      }
      if (!why) {
        status.textContent = "Add a short note on why it matters.";
        if (whyField) whyField.focus();
        return;
      }
      var lines = ["Type: " + type];
      if (link) lines.push("Link: " + link);
      lines.push("Why it matters: " + why);
      lines.push("Name on card: " + name);
      lines.push("OK to feature in the monthly note: " + feature);
      var mail = "mailto:hello@mindreclaim.org?subject=" + encodeURIComponent("What we can show") + "&body=" + encodeURIComponent(lines.join("\n"));
      status.textContent = "";
      status.appendChild(document.createTextNode("Thank you — we’ll review it. If it fits, it goes on the shelf. "));
      var mailLink = document.createElement("a");
      mailLink.href = mail;
      mailLink.textContent = "Email this to hello@mindreclaim.org";
      status.appendChild(mailLink);
      status.appendChild(document.createTextNode(" "));
      var discord = document.createElement("a");
      discord.href = "https://discord.gg/BrMMWHwcz";
      discord.target = "_blank";
      discord.rel = "noopener noreferrer";
      discord.textContent = "Join Discord to collaborate";
      status.appendChild(discord);
    });
  }

  function settleHash() {
    var id = (location.hash || "").replace(/^#/, "");
    if (!id) return;
    var node = document.getElementById(id);
    if (node && node.scrollIntoView) node.scrollIntoView();
  }

  function applySeedState(observed, published) {
    var seeding = published === 0;
    var open = published >= 1 || observed >= MIN;
    document.querySelectorAll("[data-add]").forEach(function (node) {
      node.hidden = !open;
    });
    document.querySelectorAll("[data-seed-line]").forEach(function (node) {
      node.hidden = !seeding;
    });
  }

  wireContribute();

  fetch("/show.json")
    .then(function (r) { return r.json(); })
    .then(function (file) {
      var items = (file.items || []).filter(function (item) {
        return item.layer === "observed" || item.layer === "idea" || item.layer === "reading";
      });
      var observed = items.filter(function (item) { return item.layer === "observed"; }).length;
      applySeedState(observed, items.length);
      mounts.forEach(function (mount) {
        if (mount.getAttribute("data-show") === "home") return;
        mount.innerHTML = items.map(card).join("");
        wireCarry(mount);
      });
      settleHash();
      var filters = document.querySelector("[data-filters]");
      if (filters) {
        filters.addEventListener("click", function (event) {
          var button = event.target.closest ? event.target.closest("[data-filter]") : null;
          if (!button) return;
          var name = button.getAttribute("data-filter");
          filters.querySelectorAll("[data-filter]").forEach(function (node) {
            node.setAttribute("aria-pressed", node === button ? "true" : "false");
          });
          document.querySelectorAll("[data-show='page'] [data-layer]").forEach(function (node) {
            node.hidden = name !== "all" && node.getAttribute("data-layer") !== name;
          });
        });
      }
    })
    .catch(function () {
      applySeedState(0, 0);
      settleHash();
    });
})();
