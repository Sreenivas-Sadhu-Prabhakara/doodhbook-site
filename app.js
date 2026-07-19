/* DoodhBook explainer — tiny interactions
   1. Sticky nav shadow on scroll
   2. The signature: a live daily ledger that fills in row by row,
      honoring a default quantity with overrides + skip days, then
      counts the month total up — exactly what the product does.
   (No dependencies, no build step.)                                */

(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. sticky nav ---------------------------------------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- 2. the daily ledger ---------------------------------- */
  // One customer, Rs 62/litre full-cream milk. default_qty = 1 L.
  // A few overrides and a skip, to show the variable-count wedge.
  var RATE = 62;
  var DEFAULT_QTY = 1;
  // [day, qty, kind]  kind: "" normal | "more" override up | "skip"
  var days = [
    [1, 1, ""], [2, 2, "more"], [3, 1, ""], [4, 0, "skip"],
    [5, 1, ""], [6, 1, ""], [7, 2, "more"]
  ];

  var rowsEl = document.getElementById("ledgerRows");
  var totalEl = document.getElementById("ledgerTotal");

  function rupee(n) {
    // Indian grouping (e.g. 1,84,260) — here numbers are small but be correct anyway.
    return "Rs " + n.toLocaleString("en-IN");
  }

  function noteFor(kind, qty) {
    if (kind === "skip") return "Skip · out of town";
    if (kind === "more") return "+" + (qty - DEFAULT_QTY) + " extra";
    return "Default 1 L";
  }

  function buildRow(day, qty, kind, delay) {
    var amt = qty * RATE;
    var row = document.createElement("div");
    row.className = "lrow" + (kind ? " lrow--" + kind : "");
    if (!reduce) row.style.animationDelay = delay + "ms";
    else row.style.animation = "none", row.style.opacity = 1, row.style.transform = "none";

    var qtyLabel = kind === "skip" ? "—" : qty + " L";

    row.innerHTML =
      '<span class="lrow__day">Jul ' + day + '</span>' +
      '<span class="lrow__note">' + noteFor(kind, qty) + '</span>' +
      '<span class="lrow__qty">' + qtyLabel + '</span>' +
      '<span class="lrow__amt">' + (kind === "skip" ? "—" : rupee(amt).replace("Rs ", "₹")) + '</span>';
    return row;
  }

  function countUp(el, to) {
    if (reduce) { el.textContent = rupee(to); return; }
    var start = performance.now(), dur = 900;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = rupee(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderLedger() {
    if (!rowsEl || !totalEl) return;
    rowsEl.innerHTML = "";
    var total = 0;
    days.forEach(function (d, i) {
      var qty = d[2] === "skip" ? 0 : d[1];
      total += qty * RATE;
      rowsEl.appendChild(buildRow(d[0], qty, d[2], i * 110));
    });
    // start the count-up after rows have animated in
    var when = reduce ? 0 : days.length * 110 + 200;
    setTimeout(function () { countUp(totalEl, total); }, when);
  }

  // Render when the ledger scrolls into view (or immediately if IO missing).
  var ledger = document.querySelector(".hero__ledger");
  if (ledger && "IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { renderLedger(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(ledger);
  } else {
    renderLedger();
  }
})();
