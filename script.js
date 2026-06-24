(() => {
  function initAos() {
    if (typeof window.AOS === "undefined") return;
    window.AOS.init();
  }

  function initBackToTop() {
    const button = document.getElementById("backToTop");
    if (!button) return;

    const handleScroll = () => {
      button.classList.toggle("hidden", window.scrollY <= 400);
    };

    window.addEventListener("scroll", handleScroll);
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    handleScroll();
  }

  function initMobileMenu() {
    const toggleButton = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const siteHeader = document.getElementById("site-header");
    const hamburgerIcon = document.getElementById("hamburger-icon");
    const closeIcon = document.getElementById("close-icon");

    if (!toggleButton || !mobileMenu || !siteHeader || !hamburgerIcon || !closeIcon) return;

    const setMenuOpen = (isOpen) => {
      mobileMenu.classList.toggle("hidden", !isOpen);
      siteHeader.classList.toggle("rounded-b-none", isOpen);
      hamburgerIcon.classList.toggle("hidden", isOpen);
      closeIcon.classList.toggle("hidden", !isOpen);
      toggleButton.setAttribute("aria-expanded", String(isOpen));
      toggleButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };

    toggleButton.addEventListener("click", () => {
      setMenuOpen(mobileMenu.classList.contains("hidden"));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });
  }

  function initFeatureTabs() {
    const title = document.getElementById("features-tabs-title");
    const tabs = document.querySelectorAll('input[name="features_tabs"]');

    if (!title || tabs.length === 0) return;

    tabs.forEach((tab) => {
      tab.addEventListener("change", () => {
        if (!tab.checked) return;
        title.textContent = tab.dataset.title || "Features";
      });
    });
  }

  function initTestimonialCarousel() {
    const carousel = document.getElementById("testimonials");
    const track = carousel?.querySelector("[data-testimonial-track]");
    const originalCards = track ? Array.from(track.querySelectorAll(".testimonial-card")) : [];
    const previousButton = carousel?.querySelector("[data-testimonial-previous]");
    const nextButton = carousel?.querySelector("[data-testimonial-next]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!track || !previousButton || !nextButton || !originalCards.length) return;

    let isVisible = false;
    let autoplayDisabled = false;
    let animationFrame = null;
    let lastFrameTime;

    const cloneCards = () => {
      const before = originalCards.map((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        return clone;
      });

      const after = originalCards.map((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        return clone;
      });

      before.reverse().forEach((clone) => track.prepend(clone));
      after.forEach((clone) => track.append(clone));
    };

    cloneCards();
    const cards = Array.from(track.querySelectorAll(".testimonial-card"));

    const cardPosition = (index) => cards[index].offsetLeft - cards[0].offsetLeft;
    const segmentWidth = () => cardPosition(originalCards.length * 2) - cardPosition(originalCards.length);

    const normalizeLoopPosition = () => {
      const start = cardPosition(originalCards.length);
      const end = cardPosition(originalCards.length * 2);
      const width = segmentWidth();

      if (track.scrollLeft <= start) {
        track.scrollLeft += width;
      } else if (track.scrollLeft >= end) {
        track.scrollLeft -= width;
      }
    };

    const closestCardIndex = () =>
      cards.reduce((closest, _card, index) => {
        const currentDistance = Math.abs(cardPosition(index) - track.scrollLeft);
        const closestDistance = Math.abs(cardPosition(closest) - track.scrollLeft);
        return currentDistance < closestDistance ? index : closest;
      }, originalCards.length);

    const animate = (time) => {
      if (!isVisible || autoplayDisabled || reducedMotion.matches) {
        animationFrame = null;
        lastFrameTime = undefined;
        return;
      }

      const elapsed = Math.min(time - (lastFrameTime || time), 32);
      track.scrollLeft -= elapsed * 0.028;
      normalizeLoopPosition();
      lastFrameTime = time;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (animationFrame || !isVisible || autoplayDisabled || reducedMotion.matches) return;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (!animationFrame) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
      lastFrameTime = undefined;
    };

    const stopAutoplay = () => {
      autoplayDisabled = true;
      carousel.classList.add("is-manual");
      stopAnimation();
    };

    const navigate = (direction) => {
      stopAutoplay();
      const nextIndex = closestCardIndex() + direction;
      track.scrollTo({ left: cardPosition(nextIndex), behavior: "smooth" });
    };

    previousButton.addEventListener("click", () => navigate(-1));
    nextButton.addEventListener("click", () => navigate(1));

    track.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      navigate(event.key === "ArrowRight" ? 1 : -1);
    });

    track.addEventListener("scroll", normalizeLoopPosition, { passive: true });
    window.addEventListener("resize", normalizeLoopPosition);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }, { threshold: 0.35 });

    visibilityObserver.observe(carousel);
    track.scrollLeft = cardPosition(originalCards.length * 2) - 1;
    startAnimation();

    window.addEventListener(
      "pagehide",
      () => {
        stopAnimation();
      },
      { once: true },
    );
  }

  function initDemoForm() {
    const demoSection = document.getElementById("demo");
    const form = demoSection?.querySelector("form");
    if (!demoSection || !form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const message = document.createElement("p");
      message.className = "text-sm font-semibold text-purple-200";
      message.setAttribute("role", "status");
      message.setAttribute("aria-live", "polite");
      message.textContent = "Thanks - we'll be in touch.";

      form.replaceWith(message);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAos();
    initBackToTop();
    initMobileMenu();
    initFeatureTabs();
    initTestimonialCarousel();
    initDemoForm();
  });
})();
