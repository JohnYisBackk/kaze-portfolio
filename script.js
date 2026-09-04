"use strict";

// ===============================
// 1. SELECT ELEMENTS
// ===============================

const header = document.getElementById("header");

const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav-link");

const menuBtn = document.getElementById("menuBtn");

const sections = document.querySelectorAll("section[id]");

const revealElements = document.querySelectorAll(
  ".section-label, .section-title, .hero-description, .about-description, .outline-button, .about-image-wrapper, .about-skills, .work-description, .text-link, .project-card, .contact-description, .contact-links",
);

const heroBackground = document.querySelector(".hero-background-image");

// ===============================
// 2. LUCIDE ICONS
// ===============================

if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

// ===============================
// STICKY HEADER
// ===============================

function updateHeader() {
  if (!header) return;

  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// ===============================
// 4. ACTIVE NAVIGATION
// ===============================

function updateActiveNavigation() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop - 250) {
      currentSection = section.id;
    }

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href");

    if (href === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// ===============================
// 5. SMOOTH NAVIGATION
// ===============================

function scrollToSection(event) {
  const link = event.currentTarget;
  const targetId = link.getAttribute("href");

  if (!targetId || !targetId.startsWith("#") || targetId === "#") {
    return;
  }

  const targetSection = document.querySelector(targetId);

  if (!targetSection) return;

  event.preventDefault();

  const headerHeight = header ? header.offsetHeight : 0;

  const targetPosition =
    targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });

  closeMobileMenu();
}

// ===============================
// 6. MOBILE MENU
// ===============================

function toggleMobileMenu() {
  const isOpen = nav.classList.toggle("open");

  menuBtn.classList.toggle("active", isOpen);

  document.body.classList.toggle("menu-open", isOpen);

  menuBtn.setAttribute("aria-expanded", isOpen);
}

function closeMobileMenu() {
  nav.classList.remove("open");

  menuBtn.classList.remove("active");

  document.body.classList.remove("menu-open");

  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", toggleMobileMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// ===============================
// 7. REVEAL ON SCROLL
// ===============================

function initializeRevealAnimations() {
  if (!revealElements.length) return;

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: "0px 0px -70px 0px",
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      observer.unobserve(entry.target);
    });
  }, observerOptions);

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

// ===============================
// 8. PROJECT CARD STAGGER
// ===============================

function initializeProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card, index) => {
    card.style.setProperty("--delay", `${index * 120}ms`);
  });
}

// ===============================
// 9. SKILL BAR ANIMATION
// ===============================

function initializeSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  if (!skillBars.length) return;

  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("animate");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.5,
    },
  );

  skillBars.forEach((bar) => {
    skillObserver.observe(bar);
  });
}

// ===============================
// 10. HERO PARALLAX
// ===============================

function updateHeroParallax() {
  if (!heroBackground) return;

  const scrollPosition = window.scrollY;

  if (scrollPosition > window.innerHeight) return;

  const movement = scrollPosition * 0.12;

  heroBackground.style.transform = `scale(1.04) translateY(${movement}px)`;
}

// ===============================
// 11. PROJECT MOUSE EFFECT
// ===============================

function initializeProjectHover() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const image = card.querySelector(".project-image");

    if (!image) return;

    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 992) return;

      const rect = card.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((mouseX - centerX) / centerX) * 2;
      const rotateX = ((centerY - mouseY) / centerY) * 2;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;

      image.style.transform = "scale(1.055)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";

      image.style.transform = "";
    });
  });
}

// ===============================
// 12. CLOSE MENU ON RESIZE
// ===============================

function handleResize() {
  if (window.innerWidth > 760) {
    closeMobileMenu();
  }
}

// ===============================
// 13. SCROLL HANDLER
// ===============================

function handleScroll() {
  updateHeader();
  updateActiveNavigation();
  updateHeroParallax();
}

// ===============================
// 14. EVENT LISTENERS
// ===============================

window.addEventListener("scroll", updateHeader);

window.addEventListener("scroll", handleScroll, {
  passive: true,
});

window.addEventListener("resize", handleResize);

if (menuBtn) {
  menuBtn.addEventListener("click", toggleMobileMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", scrollToSection);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  if (link.classList.contains("nav-link")) return;

  link.addEventListener("click", scrollToSection);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

// ===============================
// 15. INITIALIZE APP
// ===============================

function initializeApp() {
  updateHeader();
  updateActiveNavigation();

  initializeRevealAnimations();
  initializeProjectCards();
  initializeSkillBars();
  initializeProjectHover();

  updateHeroParallax();
}

initializeApp();
