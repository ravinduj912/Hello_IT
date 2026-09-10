/**
 * HelloIT Solutions - Main JavaScript Controller
 * Tagline: Technology Made Simple.
 * 
 * Central Configuration, Dynamic Contact Binding, Form Handling,
 * Portfolio Filters, Interactive Estimator, and File Downloader.
 */

// ==========================================
// 1. CENTRAL SITE CONFIGURATION
// Edit these details in one place to update the whole website!
// ==========================================
const SITE_CONFIG = {
  companyName: "HelloIT Solutions",
  tagline: "Technology Made Simple.",
  phone: "+94 77 082 4583",
  phoneRaw: "+94 77 082 4583",
  whatsapp: "+94 77 082 4583",
  whatsappRaw: "94770824583",
  email: "support.helloit@gmail.com",
  location: "Awissawella, Sri Lanka",
  supportHours: "24/7 IT Technical Support Available",
  officeHours: "Mon - Sat: 8:30 AM - 6:30 PM",
  socials: {
    facebook: "https://facebook.com/helloitsolutions",
    linkedin: "https://linkedin.com/company/helloitsolutions",
    twitter: "https://twitter.com/helloit_tech"
  }
};

// ==========================================
// 2. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initDynamicConfig();
  initNavigation();
  initScrollSpy();
  initScrollAnimations();
  initPortfolioFilter();
  initQuoteEstimator();
  initPlanLinks();
  initContactForm();
  initWhatsAppFloating();
  initBackToTop();
  initModals();
});

// ==========================================
// 3. DYNAMIC CONFIG DATA BINDING
// Automatically injects SITE_CONFIG into data-config elements
// ==========================================
function initDynamicConfig() {
  // Bind Text Content
  document.querySelectorAll("[data-config-text]").forEach(el => {
    const key = el.getAttribute("data-config-text");
    if (SITE_CONFIG[key]) {
      el.textContent = SITE_CONFIG[key];
    }
  });

  // Bind Tel links
  document.querySelectorAll("[data-config-tel]").forEach(el => {
    el.setAttribute("href", `tel:${SITE_CONFIG.phoneRaw}`);
  });

  // Bind Mailto links
  document.querySelectorAll("[data-config-mailto]").forEach(el => {
    el.setAttribute("href", `mailto:${SITE_CONFIG.email}`);
  });

  // Bind WhatsApp Direct links
  document.querySelectorAll("[data-config-whatsapp]").forEach(el => {
    const customMsg = el.getAttribute("data-whatsapp-msg");
    const prefillMsg = encodeURIComponent(
      customMsg || "Hello HelloIT Solutions, I would like to know more about your IT services."
    );
    el.setAttribute("href", `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${prefillMsg}`);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

// ==========================================
// 4. NAVIGATION & COOL NAVBAR ANIMATIONS
// ==========================================
function initNavigation() {
  const headerWrapper = document.getElementById("siteHeaderWrapper");
  const header = document.getElementById("mainHeader");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const indicator = document.getElementById("navIndicator");
  const progressBar = document.getElementById("navScrollProgress");

  // Dynamic Scroll Reading Progress Line
  function updateScrollProgress() {
    if (!progressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      progressBar.style.width = "0%";
      return;
    }
    const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
    progressBar.style.width = `${progress}%`;
  }

  // Magnetic Dynamic Indicator Positioner
  function moveIndicator(targetEl) {
    if (!indicator || !navMenu || window.innerWidth <= 768) {
      if (indicator) indicator.classList.remove("active");
      return;
    }

    const activeEl = targetEl || navMenu.querySelector(".nav-link.active") || navMenu.querySelector(".nav-link");
    if (!activeEl) {
      indicator.classList.remove("active");
      return;
    }

    const menuRect = navMenu.getBoundingClientRect();
    const targetRect = activeEl.getBoundingClientRect();

    if (targetRect.width === 0) return;

    const offsetLeft = targetRect.left - menuRect.left;
    const targetWidth = targetRect.width;

    indicator.style.transform = `translateX(${offsetLeft}px)`;
    indicator.style.width = `${targetWidth}px`;
    indicator.classList.add("active");
  }

  // Sticky Header Scroll & Progress Effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header?.classList.add("scrolled");
      headerWrapper?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
      headerWrapper?.classList.remove("scrolled");
    }
    updateScrollProgress();
  }, { passive: true });

  // Hover animations for magnetic indicator
  navLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
      moveIndicator(link);
    });
  });

  navMenu?.addEventListener("mouseleave", () => {
    moveIndicator();
  });

  // Initial indicator setup with font-ready & resize safety
  function setupIndicator() {
    requestAnimationFrame(() => {
      moveIndicator();
      updateScrollProgress();
    });
  }

  setupIndicator();
  setTimeout(setupIndicator, 100);
  setTimeout(setupIndicator, 300);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setupIndicator);
  }

  window.addEventListener("resize", setupIndicator, { passive: true });

  // Mobile Animated Morphing Menu Toggle
  if (menuToggle && navMenu) {
    function toggleMobileMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("menu-open", isOpen);
    }

    function closeMobileMenu() {
      if (navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    }

    menuToggle.addEventListener("click", toggleMobileMenu);

    // Close mobile menu on clicking any navigation link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        closeMobileMenu();
        setTimeout(() => moveIndicator(link), 100);
      });
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Prevent clicks inside navMenu from closing it prematurely
    navMenu.addEventListener("click", (e) => {
      if (e.target === navMenu) {
        closeMobileMenu();
      }
    });
  }

  // Expose moveIndicator for ScrollSpy to call
  window.__moveNavIndicator = moveIndicator;
}

// ==========================================
// 5. SCROLL SPY FOR ACTIVE NAVIGATION LINK
// ==========================================
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNav() {
    const scrollY = window.scrollY;

    // When near the top, reliably lock to Home tab
    if (scrollY < 120) {
      navLinks.forEach(link => {
        if (link.getAttribute("href") === "#home") {
          if (!link.classList.contains("active")) {
            link.classList.add("active");
            if (window.__moveNavIndicator) window.__moveNavIndicator(link);
          }
        } else {
          link.classList.remove("active");
        }
      });
      return;
    }

    // Determine current active section based on scroll offset
    let activeId = "home";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (scrollY >= sectionTop) {
        activeId = section.getAttribute("id") || "home";
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute("href") === `#${activeId}`) {
        if (!link.classList.contains("active")) {
          link.classList.add("active");
          if (window.__moveNavIndicator) {
            window.__moveNavIndicator(link);
          }
        }
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();
}

// ==========================================
// 6. SCROLL TRIGGERED FADE-IN ANIMATIONS
// ==========================================
function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-up");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    elements.forEach(el => el.classList.add("visible"));
  }
}

// ==========================================
// 7. PORTFOLIO FILTER TABS
// ==========================================
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 10);
        } else {
          card.style.display = "none";
          card.style.opacity = "0";
        }
      });
    });
  });
}

// ==========================================
// 8. INTERACTIVE ESTIMATOR CALCULATOR
// ==========================================
function initQuoteEstimator() {
  const checkboxes = document.querySelectorAll(".estimator-options input[type='checkbox']");
  const priceDisplay = document.getElementById("estimatePriceDisplay");
  const timeDisplay = document.getElementById("estimateTimeDisplay");
  const bookEstimateBtn = document.getElementById("bookEstimateBtn");

  function calculateEstimate() {
    let baseMin = 0;
    let baseMax = 0;
    let days = 1;
    let selectedServices = [];

    checkboxes.forEach(cb => {
      const parent = cb.closest(".estimate-check-label");
      if (cb.checked) {
        parent?.classList.add("selected");
        const min = parseInt(cb.getAttribute("data-min") || "0", 10);
        const max = parseInt(cb.getAttribute("data-max") || "0", 10);
        const time = parseInt(cb.getAttribute("data-days") || "1", 10);
        baseMin += min;
        baseMax += max;
        if (time > days) days = time;
        selectedServices.push(cb.value);
      } else {
        parent?.classList.remove("selected");
      }
    });

    if (baseMin === 0) {
      if (priceDisplay) priceDisplay.textContent = "Select Services";
      if (timeDisplay) timeDisplay.textContent = "Custom Assessment";
    } else {
      if (priceDisplay) priceDisplay.textContent = `$${baseMin} - $${baseMax}`;
      if (timeDisplay) timeDisplay.textContent = `${days} - ${days + 1} Business Days`;
    }

    return selectedServices;
  }

  checkboxes.forEach(cb => {
    cb.addEventListener("change", calculateEstimate);
  });

  // Prefill contact form when clicking Book Estimate
  if (bookEstimateBtn) {
    bookEstimateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const services = calculateEstimate();
      const serviceSelect = document.getElementById("contactService");
      const messageInput = document.getElementById("contactMessage");

      if (services.length > 0 && serviceSelect) {
        serviceSelect.value = services[0] || "General IT Support";
      }
      if (services.length > 0 && messageInput) {
        messageInput.value = `Hello, I generated an estimate for the following service(s): ${services.join(", ")}. Please provide a detailed quote and availability.`;
      }

      // Smooth scroll to contact section
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
        const nameInput = document.getElementById("contactName");
        setTimeout(() => nameInput?.focus(), 600);
      }
    });
  }

  // Initial Calculation
  calculateEstimate();
}

// ==========================================
// 8B. BUSINESS IT SUPPORT INTERACTIVE SWITCHER & LINKS
// ==========================================
function initPlanLinks() {
  // 1. Team Size Switcher Buttons
  const switchBtns = document.querySelectorAll(".tier-switch-btn[data-tier-target]");
  const allTierCards = document.querySelectorAll(".business-it-card[data-tier]");

  switchBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTier = btn.getAttribute("data-tier-target");
      
      // Update active state on buttons
      switchBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // Highlight target card
      allTierCards.forEach(card => {
        const cardTier = card.getAttribute("data-tier");
        if (cardTier === targetTier) {
          card.classList.add("tier-focus");
          // Smooth scroll to card if on smaller screen
          if (window.innerWidth <= 992) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          card.classList.remove("tier-focus");
        }
      });
    });
  });

  // 2. Plan Action Links / Buttons
  document.querySelectorAll(".tier-link[data-plan]").forEach(link => {
    link.addEventListener("click", (e) => {
      const planName = link.getAttribute("data-plan") || "Business IT Support";
      const contactSection = document.getElementById("contact");
      const serviceSelect = document.getElementById("contactService");
      const messageInput = document.getElementById("contactMessage");
      const nameInput = document.getElementById("contactName");

      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes("support") || serviceSelect.options[i].text.toLowerCase().includes("business")) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (messageInput) {
        messageInput.value = `Hello HelloIT Solutions,\n\nI would like to inquire about the "${planName}" plan for our team. Please provide more details on pricing, device onboarding, and SLA.`;
      }

      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          nameInput?.focus();
        }, 600);
      }
    });
  });

  // 3. Calculator Estimator Link
  const consultEstimatorBtn = document.getElementById("consultEstimatorBtn");
  if (consultEstimatorBtn) {
    consultEstimatorBtn.addEventListener("click", (e) => {
      const calcSection = document.getElementById("quote-calculator");
      if (calcSection) {
        e.preventDefault();
        calcSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

// ==========================================
// 9. CONTACT FORM HANDLER (Mailto & WhatsApp)
// ==========================================
function initContactForm() {
  const form = document.getElementById("quoteContactForm");
  const statusAlert = document.getElementById("formStatusAlert");
  const sendWhatsAppBtn = document.getElementById("sendWhatsAppBtn");

  if (!form) return;

  function getFormData() {
    const name = document.getElementById("contactName")?.value.trim() || "";
    const phone = document.getElementById("contactPhone")?.value.trim() || "";
    const email = document.getElementById("contactEmail")?.value.trim() || "";
    const service = document.getElementById("contactService")?.value || "General IT Inquiry";
    const urgency = document.getElementById("contactUrgency")?.value || "Standard";
    const message = document.getElementById("contactMessage")?.value.trim() || "";

    return { name, phone, email, service, urgency, message };
  }

  function validate(data) {
    if (!data.name) return "Please enter your name.";
    if (!data.phone && !data.email) return "Please enter either a phone number or email address.";
    if (!data.message) return "Please briefly describe your requirement or problem.";
    return null;
  }

  // Standard Email Request Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getFormData();
    const error = validate(data);

    if (error) {
      showStatus(error, "error");
      return;
    }

    // Construct Email mailto link
    const subject = encodeURIComponent(`[IT Service Request] ${data.service} - ${data.name}`);
    const body = encodeURIComponent(
      `Hello HelloIT Solutions Team,\n\n` +
      `I would like to request assistance with the following service.\n\n` +
      `--- INQUIRY DETAILS ---\n` +
      `Client Name: ${data.name}\n` +
      `Phone: ${data.phone}\n` +
      `Email: ${data.email}\n` +
      `Service Required: ${data.service}\n` +
      `Urgency Level: ${data.urgency}\n\n` +
      `Message / Problem Description:\n` +
      `${data.message}\n\n` +
      `Thank you.`
    );

    showStatus("Opening your email client to send your inquiry...", "success");

    // Launch mail client
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;
  });

  // Direct WhatsApp Submission from form
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener("click", () => {
      const data = getFormData();
      const error = validate(data);

      if (error) {
        showStatus(error, "error");
        return;
      }

      const waText = encodeURIComponent(
        `*New IT Service Inquiry - HelloIT Solutions*\n\n` +
        `👤 *Name:* ${data.name}\n` +
        `📞 *Phone:* ${data.phone}\n` +
        `✉️ *Email:* ${data.email}\n` +
        `🛠️ *Service:* ${data.service}\n` +
        `⚡ *Urgency:* ${data.urgency}\n\n` +
        `📝 *Message:* ${data.message}`
      );

      showStatus("Connecting to WhatsApp...", "success");
      window.open(`https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${waText}`, "_blank", "noopener,noreferrer");
    });
  }

  function showStatus(msg, type) {
    if (!statusAlert) return;
    statusAlert.textContent = msg;
    statusAlert.className = `form-status-alert ${type}`;
    statusAlert.style.display = "block";

    setTimeout(() => {
      if (type === "success") {
        statusAlert.style.display = "none";
      }
    }, 6000);
  }
}

// ==========================================
// 10. FLOATING WHATSAPP BUTTON
// ==========================================
function initWhatsAppFloating() {
  const floatingBtn = document.getElementById("floatingWhatsApp");
  if (!floatingBtn) return;

  const defaultMsg = encodeURIComponent("Hello HelloIT Solutions, I would like to know more about your IT services.");
  floatingBtn.setAttribute("href", `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${defaultMsg}`);
  floatingBtn.setAttribute("target", "_blank");
  floatingBtn.setAttribute("rel", "noopener noreferrer");
}

// ==========================================
// 10B. FLOATING BACK TO TOP WITH SCROLL PROGRESS
// ==========================================
function initBackToTop() {
  const container = document.getElementById("backToTopContainer");
  const btn = document.getElementById("backToTopBtn");
  const progressCircle = document.getElementById("backToTopProgress");
  if (!container || !btn) return;

  const circumference = 2 * Math.PI * 20; // 125.66

  function updateBackToTop() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Show button once scrolled past 280px
    if (scrollY > 280) {
      container.classList.add("visible");
    } else {
      container.classList.remove("visible");
    }

    // Smoothly update circular scroll progress indicator
    if (progressCircle && totalHeight > 0) {
      const scrollPercent = Math.min(1, Math.max(0, scrollY / totalHeight));
      const offset = circumference - (scrollPercent * circumference);
      progressCircle.style.strokeDashoffset = `${offset}`;
    }
  }

  // Smooth scroll back to top on click
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Provide keyboard accessible focus reset
    const homeEl = document.getElementById("home");
    if (homeEl) {
      homeEl.setAttribute("tabindex", "-1");
      homeEl.focus({ preventScroll: true });
    }
  });

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
}

// ==========================================
// 11. FILE DOWNLOAD & DEPLOYMENT GUIDE MODALS
// Provides 1-Click File Downloads for index.html, style.css, script.js, README.md, nginx.conf
// ==========================================
function initModals() {
  const downloadModal = document.getElementById("downloadModal");
  const guideModal = document.getElementById("guideModal");
  const openDownloadBtns = document.querySelectorAll(".open-download-modal");
  const openGuideBtns = document.querySelectorAll(".open-guide-modal");
  const closeBtns = document.querySelectorAll(".modal-close-btn");
  const backdrops = document.querySelectorAll(".modal-backdrop");

  openDownloadBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadModal?.classList.add("active");
    });
  });

  openGuideBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      guideModal?.classList.add("active");
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      backdrops.forEach(b => b.classList.remove("active"));
    });
  });

  backdrops.forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("active");
      }
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      backdrops.forEach(b => b.classList.remove("active"));
    }
  });

  // File Download Helpers
  document.querySelectorAll("[data-download-file]").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const fileName = btn.getAttribute("data-download-file");
      if (fileName) {
        downloadSingleFile(fileName);
      }
    });
  });

  // Download All Bundle (ZIP Package)
  const downloadAllBtn = document.getElementById("downloadAllZipBtn");
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadProjectZip();
    });
  }
}

// Single File Downloader using Blob & Fetch
async function downloadSingleFile(filename) {
  try {
    const response = await fetch(`./${filename}`);
    if (!response.ok) throw new Error("File fetch failed");
    const content = await response.text();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.warn(`Direct fetch failed, using memory export for ${filename}:`, err);
    // Fallback: trigger standard download link
    const a = document.createElement("a");
    a.href = `./${filename}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Bundle all files together into a clean download sequence or trigger individual files
async function downloadProjectZip() {
  const files = ["index.html", "style.css", "script.js", "nginx.conf", "README.md"];
  for (const f of files) {
    await downloadSingleFile(f);
    // Small delay between automatic browser triggers
    await new Promise(r => setTimeout(r, 250));
  }
}
