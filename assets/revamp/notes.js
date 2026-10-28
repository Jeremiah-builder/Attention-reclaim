/* Notes band and /notes. Items come from updates.json and media.json. */
(function () {
  var root = document.querySelector("[data-notes]");
  if (!root) return;
  var full = root.getAttribute("data-notes") === "page";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function when(iso) {
    var p = String(iso || "").split("-");
    if (p.length < 3) return iso || "";
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var day = String(parseInt(p[2], 10));
    return day + " " + months[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  function time(item) {
    return new Date(item.date + "T00:00:00").getTime();
  }

  function byDateDesc(a, b) {
    return time(b) - time(a);
  }

  function isWarning(item) {
    var blob = (item.summary || "") + " " + (item.title || "");
    return /content warning/i.test(blob);
  }

  function kickerFor(item, fallback) {
    var map = {
      news: "News",
      event: "Event",
      conference: "Conference",
      podcast: "Podcast",
      video: "Video",
      article: "Article"
    };
    return map[item.type] || fallback;
  }

  function sortEvents(items) {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var future = [];
    var past = [];
    items.forEach(function (item) {
      if (time(item) >= start.getTime()) future.push(item);
      else past.push(item);
    });
    future.sort(function (a, b) { return time(a) - time(b); });
    past.sort(byDateDesc);
    return future.concat(past);
  }

  function card(item, kicker) {
    return (
      '<article class="chip note-card">' +
      '<p class="kicker">' + esc(kicker) + "</p>" +
      '<p class="note-title"><a href="' + esc(item.url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(item.title) +
      '<span class="visually-hidden"> (opens in a new tab)</span></a></p>' +
      "<p>" + esc(item.summary) + "</p>" +
      '<p class="note-meta">' + esc(when(item.date)) + " · " + esc(item.source) + "</p>" +
      "</article>"
    );
  }

  function lane(label, note, items, kickerName) {
    if (!items.length) return "";
    var cards = items.map(function (item) {
      return card(item, kickerFor(item, kickerName));
    }).join("");
    return (
      '<div class="note-lane">' +
      "<h3>" + esc(label) + "</h3>" +
      (note ? '<p class="lane-note">' + esc(note) + "</p>" : "") +
      '<div class="note-stack">' + cards + "</div>" +
      "</div>"
    );
  }

  Promise.all([
    fetch("/updates.json").then(function (r) { return r.json(); }),
    fetch("/media.json").then(function (r) { return r.json(); })
  ]).then(function (files) {
    var news = (files[0].items || []).slice().sort(byDateDesc);
    var media = files[1].items || [];
    var events = media.filter(function (item) {
      return item.type === "event" || item.type === "conference" || item.type === "article";
    });
    var listening = media.filter(function (item) {
      return item.type === "podcast" || item.type === "video";
    }).sort(byDateDesc);
    var html;
    if (full) {
      html =
        lane("News", "Short notes from the public record. We summarise; we do not invent numbers.", news, "News") +
        lane("Events", "Rooms and dates where the same pressures are being named. A listing is not a full endorsement.", sortEvents(events), "Event") +
        lane("Listening", "Longer listens for quiet time. Prefer these over another hour in the feed.", listening, "Podcast");
    } else {
      var soonest = sortEvents(events)[0];
      var listen = listening.filter(function (item) { return !isWarning(item); })[0];
      html =
        lane("News", "", news.slice(0, 1), "News") +
        lane("Events", "", soonest ? [soonest] : [], "Event") +
        lane("Listening", "", listen ? [listen] : [], "Podcast");
    }
    root.innerHTML = html;
  }).catch(function () {
    root.innerHTML = "";
  });
})();
