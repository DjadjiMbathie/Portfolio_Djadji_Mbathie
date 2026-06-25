document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. GESTION DES THEMES (SOMBRE / CLAIR & COULEURS)
     ========================================================================== */
  const body = document.body;
  const darkLightToggle = document.getElementById("dark-light-toggle");
  const darkLightIcon = darkLightToggle.querySelector("i");

  // Activer/Désactiver le mode Sombre
  function setDarkMode(isDark) {
    if (isDark) {
      body.classList.add("dark");
      darkLightIcon.className = "fas fa-sun"; // Icône soleil en mode sombre
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark");
      darkLightIcon.className = "fas fa-moon"; // Icône lune en mode clair
      localStorage.setItem("theme", "light");
    }
  }

  // Initialisation du thème Sombre/Clair sur le stockage local ou système
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    setDarkMode(true);
  } else if (savedTheme === "light") {
    setDarkMode(false);
  } else {
    // Par défaut, vérifie si le système est en mode sombre
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }

  // Écouteur de clic sur le bouton Sombre/Clair
  darkLightToggle.addEventListener("click", () => {
    setDarkMode(!body.classList.contains("dark"));
  });

  // Gestion du sélecteur de style (Skin colors)
  const switcherToggle = document.getElementById("switcher-toggle");
  const styleSwitcher = document.getElementById("style-switcher");
  const themeColorLink = document.getElementById("theme-color-link");
  const themeColorsContainer = document.getElementById("theme-colors");

  // Ouvrir/Fermer le panneau de configuration de couleur
  switcherToggle.addEventListener("click", () => {
    styleSwitcher.classList.toggle("open");
  });

  // Fermer le panneau sur le défilement (scroll)
  window.addEventListener("scroll", () => {
    if (styleSwitcher.classList.contains("open")) {
      styleSwitcher.classList.remove("open");
    }
  });

  // Écouteur pour le changement de couleur de peau
  themeColorsContainer.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === "SPAN") {
      const colorName = target.getAttribute("data-color");
      changeSkinColor(colorName);
    }
  });

  function changeSkinColor(colorName) {
    themeColorLink.setAttribute("href", `./css/skins/${colorName}.css`);
    localStorage.setItem("skin-color", colorName);
  }

  // Initialiser la couleur de peau stockée
  const savedSkinColor = localStorage.getItem("skin-color");
  if (savedSkinColor) {
    changeSkinColor(savedSkinColor);
  }


  /* ==========================================================================
     2. NAVIGATION DYNAMIQUE & HAMBURGER MENU
     ========================================================================== */
  const navBouton = document.getElementById("nav-bouton");
  const aside = document.getElementById("aside");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  // Basculer l'ouverture de la barre latérale sur mobile
  navBouton.addEventListener("click", () => {
    aside.classList.toggle("open");
    navBouton.classList.toggle("open");
  });

  // Défilement fluide (Smooth Scroll) et mise à jour active manuelle au clic
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      
      // Fermer le menu sur mobile lors d'un clic
      if (aside.classList.contains("open")) {
        aside.classList.remove("open");
        navBouton.classList.remove("open");
      }

      // Scroll fluide vers la section ciblée
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: "smooth"
      });
    });
  });

  // Mettre en évidence les liens actifs lors du défilement
  window.addEventListener("scroll", () => {
    let currentSectionId = "";
    const scrollPosition = window.scrollY + 150; // Décalage pour un déclenchement anticipé

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });


  /* ==========================================================================
     3. BOUTON RETOUR EN HAUT
     ========================================================================== */
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });


  /* ==========================================================================
     4. ANIMATION DES BARRES DE COMPETENCES 
     ========================================================================== */
  const skillBars = document.querySelectorAll(".skill-bar-front");

  const animerSkills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.getAttribute("data-progress");
        bar.style.width = progress;
        // Optionnel : arrêter d'observer une fois l'animation jouée
        observer.unobserve(bar);
      }
    });
  };

  const skillsObserver = new IntersectionObserver(animerSkills, {
    root: null, // Regarde le viewport
    threshold: 0.1 // Déclenche quand 10% de l'élément est visible
  });

  skillBars.forEach(bar => {
    skillsObserver.observe(bar);
  });


  /* ==========================================================================
     5. VALIDATION DU FORMULAIRE DE CONTACT
     ========================================================================== */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status-message");

  const fields = {
    name: {
      input: document.getElementById("contact-name"),
      error: document.getElementById("name-error"),
      validate: (val) => {
        if (!val.trim()) return "Le nom complet est obligatoire.";
        if (val.trim().length < 2) return "Le nom doit contenir au moins 2 caractères.";
        return "";
      }
    },
    email: {
      input: document.getElementById("contact-email"),
      error: document.getElementById("email-error"),
      validate: (val) => {
        if (!val.trim()) return "L'adresse e-mail est obligatoire.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) return "Veuillez entrer une adresse e-mail valide.";
        return "";
      }
    },
    message: {
      input: document.getElementById("contact-message"),
      error: document.getElementById("message-error"),
      validate: (val) => {
        if (!val.trim()) return "Le message ne peut pas être vide.";
        if (val.trim().length < 10) return "Le message doit faire au moins 10 caractères.";
        return "";
      }
    }
  };

  // Validation au cours de la saisie 
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (field.input) {
      field.input.addEventListener("input", () => {
        const errorMsg = field.validate(field.input.value);
        if (field.error) {
          field.error.textContent = errorMsg;
        }
        if (errorMsg) {
          field.input.style.borderColor = "#ec1839";
        } else {
          field.input.style.borderColor = "";
        }
      });
    }
  });

  // Validation lors de la soumission du formulaire et envoi avec FormSubmit
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Réinitialiser les statuts globaux
    formStatus.className = "form-status";
    formStatus.textContent = "";

    // Valider tous les champs
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.input) {
        const errorMsg = field.validate(field.input.value);
        if (field.error) {
          field.error.textContent = errorMsg;
        }
        
        if (errorMsg) {
          isFormValid = false;
          field.input.style.borderColor = "#ec1839";
        } else {
          field.input.style.borderColor = "";
        }
      }
    });

    if (isFormValid) {
      // Afficher un message de chargement
      formStatus.className = "form-status info";
      formStatus.style.color = "var(--skin-color)";
      formStatus.textContent = "Envoi du message en cours...";

      const formData = {
        name: fields.name.input.value,
        email: fields.email.input.value,
        message: fields.message.input.value
      };

      fetch("https://formsubmit.co/ajax/djadji.mbathie@univ-thies.sn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          formStatus.style.color = "";
          formStatus.className = "form-status success";
          formStatus.textContent = "Votre message a été envoyé avec succès !";
          
          // Réinitialiser le formulaire
          contactForm.reset();
          
          // Nettoyer les bordures
          Object.keys(fields).forEach(key => {
            if (fields[key].input) {
              fields[key].input.style.borderColor = "";
            }
          });
        } else {
          throw new Error("Erreur de serveur");
        }
      })
      .catch(error => {
        formStatus.style.color = "";
        formStatus.className = "form-status error";
        formStatus.textContent = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
      })
      .finally(() => {
        // Effacer le message après 5 secondes
        setTimeout(() => {
          formStatus.textContent = "";
          formStatus.className = "form-status";
        }, 5000);
      });
    } else {
      // Formulaire invalide
      formStatus.className = "form-status error";
      formStatus.textContent = "Veuillez corriger les erreurs dans le formulaire.";
    }
  });

  /* ==========================================================================
     6. EFFET D'ECRITURE ANIMEE 
     ========================================================================== */
  const typingElement = document.querySelector(".typing");
  if (typingElement) {
    const words = ["Étudiant en Informatique", "Développeur Junior", "Passionné de Technologies"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 50; // Vitesse de frappe

    function typeEffect() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        delay = 55; // Vitesse d'effacement plus rapide
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        delay = 150;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        delay = 1000; // Pause à la fin du mot (2s)
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 500; // Pause avant de recommencer (0.5s)
      }

      setTimeout(typeEffect, delay);
    }

    // Lancement de l'effet de frappe après 1 seconde
    setTimeout(typeEffect, 1000);
  }
});
