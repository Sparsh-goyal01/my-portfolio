
  // Read More toggle for project descriptions
  document.querySelectorAll(".read-more-btn").forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const desc = document.getElementById(targetId);
      if (desc) {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", !expanded);
        desc.hidden = expanded;
        button.textContent = expanded ? "Read More" : "Read Less";
      }
    });
  });

  // Contact form logic
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    let hasError = false;
    const nameInput = contactForm.name;
    const emailInput = contactForm.email;
    const messageInput = contactForm.message;

    if (nameInput.value.trim() === "") {
      showError(nameInput, "Please enter your name.");
      hasError = true;
    }
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address.");
      hasError = true;
    }
    if (messageInput.value.trim() === "") {
      showError(messageInput, "Please enter your message.");
      hasError = true;
    }

    if (!hasError) {
      const datasetdata = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      };

      formStatus.style.color = "green";
      formStatus.textContent = "Sending message...";

      try {
        const res = await fetch("http://localhost:3000/index", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datasetdata)
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const message = await res.text();
        formStatus.textContent = message;
        contactForm.reset();
      } catch (error) {
        formStatus.style.color = "red";
        formStatus.textContent = "❌ Failed to send message. Try again.";
        console.error("Failed to send data:", error.message);
      }
    }
  });

  function showError(input, message) {
    const errorEl = document.getElementById(input.id + "Error");
    if (errorEl) errorEl.textContent = message;
    input.setAttribute("aria-invalid", "true");
  }

  function clearErrors() {
    ["nameError", "emailError", "messageError"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });
    ["name", "email", "message"].forEach(id => {
      const input = contactForm[id];
      if (input) input.removeAttribute("aria-invalid");
    });
    formStatus.textContent = "";
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  /* Theme toggle (light/dark) stored in localStorage */
  (function themeToggleInit(){
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      const applyTheme = (t) => {
        try{
          if(t === 'dark'){
            root.classList.add('theme-dark');
            if(themeToggle){ themeToggle.textContent = '☀️'; themeToggle.setAttribute('aria-pressed','true'); }
          } else {
            root.classList.remove('theme-dark');
            if(themeToggle){ themeToggle.textContent = '🌙'; themeToggle.setAttribute('aria-pressed','false'); }
          }
        }catch(err){ console.error('applyTheme error', err); }
      }

    // initial (guarded)
    const initial = stored ? stored : (prefersDark ? 'dark' : 'light');
    applyTheme(initial);

    if(themeToggle){
      themeToggle.addEventListener('click', () => {
        const isDark = root.classList.contains('theme-dark');
        const next = isDark ? 'light' : 'dark';
        applyTheme(next);
        try{ localStorage.setItem('theme', next); } catch(e){ console.warn('Could not persist theme', e); }
      });
    } else {
      console.warn('Theme toggle button not found (id="themeToggle").');
    }
  })();

  /* Simple scroll reveal using IntersectionObserver */
  (function revealOnScroll(){
    const reveals = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){
      // fallback: make everything visible
      reveals.forEach(r => r.classList.add('revealed'));
      return;
    }
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {root:null, rootMargin: '0px 0px -8% 0px', threshold: 0.08});

    reveals.forEach(r => obs.observe(r));
  })();

