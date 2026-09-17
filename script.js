/**
 * Viren Lahamage — DevOps Portfolio
 * Production JavaScript Engine
 * Handles Navigation, Mobile Drawer, Interactive Resume Console,
 * Dynamic Card Spotlight Glows, Toast Notifications & Form Actions
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileDrawer();
    initResumeTabs();
    initCardSpotlight();
    initCopyActions();
    initContactForm();
    initBackToTop();
  });

  /* ------------------------------------------------------------------------
     1. Navigation Scrollspy & Navbar Styling
     ------------------------------------------------------------------------ */
  function initNavigation() {
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const sections = document.querySelectorAll('section[id]');
    const NAV_OFFSET = 110;

    // Add background tint on scroll
    function handleScroll() {
      if (window.scrollY > 30) {
        navbarWrapper?.classList.add('nav-scrolled');
      } else {
        navbarWrapper?.classList.remove('nav-scrolled');
      }

      // Scrollspy
      let currentSectionId = '';
      const scrollPosition = window.scrollY + NAV_OFFSET;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href')?.replace('#', '');
        if (href === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Smooth Anchor Scrolling with precise navbar offset
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href')?.replace('#', '');
        if (!targetId) return;

        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const targetPosition =
            targetEl.getBoundingClientRect().top + window.pageYOffset - 90;

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth',
          });

          // Update URL hash without jumping
          if (history.pushState) {
            history.pushState(null, '', '#' + targetId);
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Mobile Drawer Navigation
     ------------------------------------------------------------------------ */
  function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const closeBtn = document.getElementById('mobile-drawer-close');
    const drawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-links .drawer-link, .drawer-footer a');

    if (!drawer || !toggleBtn) return;

    function openDrawer() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Interactive Resume Console Tabs
     ------------------------------------------------------------------------ */
  function initResumeTabs() {
    const tabBtns = document.querySelectorAll('.resume-tab-btn');
    const tabPanes = document.querySelectorAll('.resume-tab-pane');

    if (!tabBtns.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        if (!targetId) return;

        // Toggle Buttons
        tabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Toggle Panes
        tabPanes.forEach((pane) => {
          if (pane.id === targetId) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. SaaS Card Mouse-Tracking Spotlight Glow
     ------------------------------------------------------------------------ */
  function initCardSpotlight() {
    const interactiveCards = document.querySelectorAll(
      '.bento-card, .project-card, .skill-category-card, .cert-card'
    );

    interactiveCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. One-Click Copy Actions
     ------------------------------------------------------------------------ */
  function initCopyActions() {
    const copyButtons = document.querySelectorAll('[data-copy]');

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
            // Fallback for non-https/older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }
          showToast(`Copied to clipboard: ${textToCopy}`);
        } catch (err) {
          showToast(`Email: ${textToCopy}`);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. SaaS Contact Form Handling
     ------------------------------------------------------------------------ */
  function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all fields before submitting.');
        return;
      }

      // Visual state during sending
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        showToast('Thank you, ' + name + '! Your message has been sent.');
      }, 900);
    });
  }

  /* ------------------------------------------------------------------------
     7. Back to Top Button
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  /* ------------------------------------------------------------------------
     Toast Notification Helper
     ------------------------------------------------------------------------ */
  let toastTimeout;
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }
})();
