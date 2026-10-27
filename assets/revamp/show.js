/* What we can show. Observed seeds live in /show.json. Visitor posts are not added here. */
(function () {
  var mounts = document.querySelectorAll("[data-show]");
  if (!mounts.length) return;
  var MIN = 8;
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

  function wireCarry(scope) {
    scope.addEventListener("click", function (event) {
      var button = event.target.closest ? event.target.closest("[data-carry]") : null;
      if (!button) return;
      var text = carryLine(button.getAttribute("data-carry"));
      if (navigator.share) {
        navigator.share({ text: text }).catch(function () {});
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {});
      }
    });
  }

  function applySeedState(observed, published) {
    var open = observed >= MIN;
    document.querySelectorAll("[data-add]").forEach(function (node) {
      node.hidden = !open;
    });
    document.querySelectorAll("[data-seed-line]").forEach(function (node) {
      node.hidden = open;
    });
    document.querySelectorAll("[data-shelf-count]").forEach(function (node) {
      node.textContent = published + " on the shelf";
    });
  }

  fetch("/show.json")
    .then(function (r) { return r.json(); })
    .then(function (file) {
      var items = (file.items || []).filter(function (item) {
        return item.layer === "observed" || item.layer === "idea" || item.layer === "reading";
      });
      var observed = items.filter(function (item) { return item.layer === "observed"; }).length;
      applySeedState(observed, items.length);
      mounts.forEach(function (mount) {
        var home = mount.getAttribute("data-show") === "home";
        var list = home
          ? items.filter(function (item) { return item.layer === "observed"; }).slice(0, 4)
          : items;
        mount.innerHTML = list.map(card).join("");
        wireCarry(mount);
      });
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
    });
})();
