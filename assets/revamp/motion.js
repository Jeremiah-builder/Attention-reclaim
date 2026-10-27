/* Journey ribbon and one-shot reveals. No Lenis. No scores. */
(function () {
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  function motionOK() { return !mq.matches; }

  function showAll() {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    var farm = document.querySelector(".feed-farm");
    if (farm) farm.classList.add("in");
    var starve = document.getElementById("starve");
    if (starve) starve.classList.add("in");
  }

  if (!motionOK()) showAll();
  if (mq.addEventListener) {
    mq.addEventListener("change", function () { if (!motionOK()) showAll(); });
  }

  if ("IntersectionObserver" in window && motionOK()) {
    var reveals = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        reveals.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
    document.querySelectorAll(".reveal").forEach(function (el) { reveals.observe(el); });

    var farm = document.querySelector(".feed-farm");
    if (farm) {
      var farmWatch = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          document.body.dataset.zone = entry.isIntersecting ? "farm" : "cream";
          if (entry.isIntersecting) farm.classList.add("in");
        });
      }, { threshold: 0.15 });
      farmWatch.observe(farm);
    }

    var starve = document.getElementById("starve");
    if (starve) {
      var starveWatch = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          starve.classList.add("in");
          starveWatch.unobserve(starve);
        });
      }, { threshold: 0.2 });
      starveWatch.observe(starve);
    }
  } else {
    showAll();
  }

  var nav = document.querySelector(".journey");
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll("[data-chapter]"));
  var chapters = links.map(function (link) {
    var ids = (link.getAttribute("data-els") || "").split(/\s+/);
    return {
      link: link,
      els: ids.map(function (id) { return document.getElementById(id); }).filter(Boolean)
    };
  });
  var label = nav.querySelector("[data-journey-label]");
  var last = -1;
  var ticking = false;

  function boxOf(els) {
    var top = Infinity;
    var bottom = -Infinity;
    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var start = rect.top + window.scrollY;
      var end = rect.bottom + window.scrollY;
      if (start < top) top = start;
      if (end > bottom) bottom = end;
    });
    return { top: top, height: Math.max(1, bottom - top) };
  }

  function update() {
    ticking = false;
    var mark = window.scrollY + window.innerHeight * 0.35;
    var active = 0;
    var activeP = 0;
    chapters.forEach(function (chapter, index) {
      if (!chapter.els.length) return;
      var box = boxOf(chapter.els);
      var p = (mark - box.top) / box.height;
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      if (!motionOK()) p = mark >= box.top ? 1 : 0;
      chapter.link.style.setProperty("--p", String(p));
      if (box.top <= mark) {
        active = index;
        activeP = p;
      }
    });
    nav.style.setProperty("--p", String(activeP));
    links.forEach(function (link, index) {
      link.classList.toggle("is-active", index === active);
      link.classList.toggle("is-past", index < active);
      if (index === active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    if (label && links[active]) {
      var name = links[active].querySelector(".label");
      label.textContent = name ? name.textContent : "";
    }
    if (active !== last && window.innerWidth < 1100) {
      var scroller = nav.querySelector("ol");
      var item = links[active];
      if (scroller && item) {
        scroller.scrollTo({ left: Math.max(0, item.offsetLeft - 12), behavior: motionOK() ? "smooth" : "auto" });
      }
    }
    last = active;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  var hero = document.getElementById("hero");
  if (hero && "IntersectionObserver" in window) {
    var heroWatch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        nav.classList.toggle("is-on", !entry.isIntersecting);
      });
    }, { threshold: 0 });
    heroWatch.observe(hero);
  } else {
    nav.classList.add("is-on");
  }
  update();
})();
