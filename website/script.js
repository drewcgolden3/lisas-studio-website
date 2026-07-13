/* Lisa's Studio — script.js */
(function () {
  "use strict";

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    menu.hidden = open;
    menu.classList.toggle("is-open", !open);
  });

  // Close the menu after choosing a link
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      menu.hidden = true;
      menu.classList.remove("is-open");
    })
  );

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".acc-item");
      const isOpen = item.classList.contains("is-open");

      // Close others so only one is open at a time
      document.querySelectorAll(".acc-item.is-open").forEach((openItem) => {
        openItem.classList.remove("is-open");
        openItem.querySelector(".acc-trigger").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    ".section__head, .grid-2 > *, .offer-card, .benefit, .quote, .acc-item, .booking, .contact__info"
  );
  // Elements already on screen (including anchor deep-links) show immediately;
  // everything below the fold animates in on scroll.
  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-visible");
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Booking form ---------- */
  const form = document.getElementById("bookingForm");
  const note = document.getElementById("formNote");
  const interest = document.getElementById("interest");
  const poolField = document.getElementById("poolField");

  const syncPoolField = () => {
    poolField.hidden = interest.value !== "Private Swim Lessons";
  };
  interest.addEventListener("change", syncPoolField);

  // Offer-card links pre-select the matching service in the form
  document.querySelectorAll(".book-link").forEach((link) =>
    link.addEventListener("click", () => {
      interest.value = link.dataset.interest;
      syncPoolField();
    })
  );

  const setError = (input, message) => {
    const err = form.querySelector('.err[data-for="' + input.id + '"]');
    input.classList.toggle("is-invalid", Boolean(message));
    if (err) {
      err.textContent = message || "";
      err.classList.toggle("is-visible", Boolean(message));
    }
  };

  const validators = {
    name: (v) => (v.trim() ? "" : "Please tell us your name."),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ""
        : "Please enter a valid email so we can reach you.",
  };

  // Validate on blur, clear as the user fixes things
  ["name", "email"].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => setError(input, validators[id](input.value)));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) {
        setError(input, validators[id](input.value));
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let firstInvalid = null;
    ["name", "email"].forEach((id) => {
      const input = document.getElementById(id);
      const message = validators[id](input.value);
      setError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // No backend yet — hand off to email with the details pre-filled.
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = interest.value;
    const pool = document.getElementById("pool").value.trim();
    const message = document.getElementById("message").value.trim();

    const subject = "Booking request from " + name + " — " + service;
    const bodyLines = [
      "Hi Lisa,",
      "",
      "I'd like to book: " + service,
      "",
      "Name: " + name,
      "Email: " + email,
      phone ? "Phone: " + phone : "",
      service === "Private Swim Lessons" && pool ? "Pool location: " + pool : "",
      message ? "Notes: " + message : "",
    ].filter(Boolean);

    window.location.href =
      "mailto:amols@comcast.net?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(bodyLines.join("\n"));

    note.textContent = "Opening your email app — send the message and we'll get back to you!";
    form.reset();
    syncPoolField();
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
