/* Pass the brief. Nothing is posted publicly from this form. */
(function () {
  var form = document.querySelector("[data-brief-form]");
  if (!form) return;
  var wrap = document.querySelector("[data-pass-wrap]");
  var button = document.querySelector("[data-pass]");
  var text = "";

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var room = form.room.value.trim();
    var link = form.version.value.trim();
    text = "I adapted Mind Reclaim\u2019s brief for " + room + ". Here is my version: " + link + ". Original: mindreclaim.org";
    wrap.hidden = false;
  });

  button.addEventListener("click", function () {
    if (!text) return;
    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
    }
  });
})();
