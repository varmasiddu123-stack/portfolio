/* ==============================================
   SCRIPT.JS – Siddartha Danthuluri Portfolio
   Vanilla JavaScript – no dependencies.
   Sections:
     1. Smooth Scrolling
     2. Navbar: scroll behaviour + active link
     3. Mobile hamburger menu
     4. Scroll-reveal animations (IntersectionObserver)
     5. Footer year auto-update
   ============================================== */


/* ------------------------------------------
   1. SMOOTH SCROLLING
   Intercepts all internal anchor clicks and
   scrolls smoothly to the target section,
   accounting for the fixed navbar height.
------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navbar     = document.getElementById('navbar');
    const navHeight  = navbar ? navbar.offsetHeight : 70;
    const targetTop  = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    // Close mobile menu if open
    closeMobileMenu();
  });
});


/* ------------------------------------------
   2. NAVBAR – scroll behaviour + active link
   Adds 'scrolled' class to navbar when user
   has scrolled past the hero, which triggers
   the frosted-glass background in CSS.
   Also highlights the nav link whose section
   is currently visible in the viewport.
------------------------------------------ */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll () {
  /* Scrolled state */
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Active link highlighting */
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbar.offsetHeight - 10;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
// Run once on load to set initial state
onScroll();


/* ------------------------------------------
   3. MOBILE HAMBURGER MENU
   Toggles the .open class on both the button
   and the nav-links list. CSS handles the
   slide-in animation via 'right' transition.
------------------------------------------ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

function closeMobileMenu () {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu when clicking outside of it
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    closeMobileMenu();
  }
});


/* ------------------------------------------
   4. SCROLL-REVEAL ANIMATIONS
   Uses IntersectionObserver to add 'visible'
   to any element with class 'reveal' once it
   enters the viewport. CSS handles the actual
   fade-up transition.
   All timeline-cards and section content get
   the class added automatically below.
------------------------------------------ */

// Automatically tag elements we want to reveal
document.querySelectorAll(
  '.timeline-card, .project-card, .skill-group, .edu-card, .contact-card, .about-grid, .section-title, .section-sub'
).forEach(el => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Once revealed, stop observing (no need to re-trigger)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,  // Trigger when 12 % of the element is visible
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Stagger card children for a cascading entrance
function staggerChildren (parentSelector, childSelector, delayStep = 80) {
  document.querySelectorAll(parentSelector).forEach(parent => {
    parent.querySelectorAll(childSelector).forEach((child, i) => {
      child.style.transitionDelay = `${i * delayStep}ms`;
    });
  });
}

staggerChildren('.projects-grid', '.project-card', 60);
staggerChildren('.skills-grid',   '.skill-group',  80);
staggerChildren('.contact-grid',  '.contact-card', 60);
staggerChildren('.education-list','.edu-card',     80);


/* ------------------------------------------
   5. FOOTER – automatic year update
   Keeps the copyright year current without
   ever needing to edit the HTML.
------------------------------------------ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
