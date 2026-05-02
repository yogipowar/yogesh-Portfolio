const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const progress = document.querySelector("[data-scroll-progress]");
const revealItems = document.querySelectorAll(".reveal");
const tiltCard = document.querySelector("[data-tilt]");
const navLinks = document.querySelectorAll(".main-nav a");

const pageSections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const setScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
};

const setActiveNav = () => {
  const current = pageSections
    .filter((section) => section.offsetTop - 130 <= window.scrollY)
    .pop();

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

let ticking = false;

const onScroll = () => {
  if (ticking) return;

  ticking = true;
  requestAnimationFrame(() => {
    setHeaderState();
    setScrollProgress();
    setActiveNav();
    ticking = false;
  });
};

setHeaderState();
setScrollProgress();
setActiveNav();

window.addEventListener("scroll", onScroll, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (tiltCard) {
  tiltCard.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    tiltCard.style.transform = `translateX(-50%) rotate(${8 + x * 4}deg) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
  });

  tiltCard.addEventListener("pointerleave", () => {
    tiltCard.style.transform = "translateX(-50%) rotate(8deg)";
  });
}
