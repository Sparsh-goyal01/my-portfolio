const root = document.documentElement;
const particleLayer = document.getElementById("particles");
const aurora = document.querySelector(".aurora");
const bgGlow = document.querySelector(".bg-glow");

const navToggle = document.querySelector(".nav-toggle");
const header = document.querySelector(".site-header");
const nav = document.getElementById("primary-nav");

if (navToggle && header && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const setPointer = (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  root.style.setProperty("--pointer-x", `${x}%`);
  root.style.setProperty("--pointer-y", `${y}%`);
  if (aurora) {
    aurora.style.transform = `translate3d(${(x - 50) * 0.08}px, ${(y - 50) * 0.08}px, 0)`;
  }
  if (bgGlow) {
    bgGlow.style.transform = `translate3d(${(x - 50) * 0.05}px, ${(y - 50) * 0.05}px, 0)`;
  }
  if (particleLayer) {
    particleLayer.style.transform = `translate3d(${(x - 50) * 0.1}px, ${(y - 50) * 0.1}px, 0)`;
  }
};

window.addEventListener("mousemove", setPointer, { passive: true });

if (particleLayer) {
  const count = 48;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("span");
    dot.className = "particle";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 12}s`;
    dot.style.animationDuration = `${18 + Math.random() * 18}s`;
    dot.style.opacity = `${0.25 + Math.random() * 0.5}`;
    dot.style.transform = `translate3d(0, ${Math.random() * 40}px, 0)`;
    fragment.appendChild(dot);
  }
  particleLayer.appendChild(fragment);
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const nameInput = contactForm.name;
    const emailInput = contactForm.email;
    const messageInput = contactForm.message;
    let hasError = false;

    if (!nameInput.value.trim()) {
      showError(nameInput, "Please enter your name.");
      hasError = true;
    }
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address.");
      hasError = true;
    }
    if (!messageInput.value.trim()) {
      showError(messageInput, "Please enter your message.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const subject = encodeURIComponent("Portfolio contact");
    const body = encodeURIComponent(
      `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\n${messageInput.value.trim()}`
    );
    window.location.href = `mailto:sparshgoyal2008.bittu@gmail.com?subject=${subject}&body=${body}`;
    if (formStatus) {
      formStatus.textContent = "Opening your email client...";
      formStatus.style.color = "#34d399";
    }
    contactForm.reset();
  });
}

function showError(input, message) {
  const errorEl = document.getElementById(`${input.id}Error`);
  if (errorEl) {
    errorEl.textContent = message;
  }
  input.setAttribute("aria-invalid", "true");
}

function clearErrors() {
  ["nameError", "emailError", "messageError"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = "";
    }
  });
  ["name", "email", "message"].forEach((id) => {
    const input = contactForm[id];
    if (input) {
      input.removeAttribute("aria-invalid");
    }
  });
  if (formStatus) {
    formStatus.textContent = "";
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

