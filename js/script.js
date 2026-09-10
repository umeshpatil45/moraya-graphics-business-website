/**
 * मोरया ग्राफिक्स (Moraya Graphics) - Master Client-Side JavaScript
 * Pure Vanilla JavaScript (No frameworks, no backend required)
 * Handles: WhatsApp Order System, Navigation, Portfolio Filtering, Lightbox, FAQs, Form Validation
 */

// 1. Business Configuration
const MORAYA_CONFIG = {
  phone: '9561658629',
  countryCode: '91',
  get waNumber() {
    return this.countryCode + this.phone;
  },
  owner: 'पियुष सूर्यवंशी',
  businessName: 'मोरया ग्राफिक्स'
};

// 2. DOM Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initPortfolio();
  initLightbox();
  initFaqAccordion();
  initOrderForms();
  initQuickInquiryForms();
});

// 3. Navigation & Sticky Header
function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// 4. Mobile Navigation Drawer
function initMobileDrawer() {
  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const drawerClose = document.querySelector('.drawer-close');

  if (!menuToggle || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  // Close when clicking outside drawer content
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  // Close drawer when clicking any link inside
  const drawerLinks = drawer.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 5. Reusable WhatsApp URL Generator & Actions
/**
 * Opens general WhatsApp chat with pre-filled greeting
 */
function openWhatsAppGeneral(customMessage) {
  const defaultMsg = 'नमस्कार मोरया ग्राफिक्स, मला तुमच्या डिझाईन/प्रिंटिंग सेवांबद्दल माहिती हवी आहे.';
  const message = customMessage || defaultMsg;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${MORAYA_CONFIG.waNumber}?text=${encoded}`;
  window.open(url, '_blank');
}

/**
 * Opens WhatsApp for a specific service directly
 */
function openWhatsAppForService(serviceName) {
  const message = `नमस्कार मोरया ग्राफिक्स,

मला "${serviceName}" या सेवेसाठी ऑर्डर द्यायची आहे / माहिती हवी आहे.

कृपया मला दर (Pricing) आणि डिझाईन पर्यायांबद्दल माहिती कळवा.`;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${MORAYA_CONFIG.waNumber}?text=${encoded}`;
  window.open(url, '_blank');
}

/**
 * Toast Notification system
 */
function showToast(message, duration = 3000) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// 6. Interactive Order Form Handler
function initOrderForms() {
  const orderForms = document.querySelectorAll('.whatsapp-order-form');
  if (!orderForms.length) return;

  orderForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleOrderFormSubmit(form);
    });
  });
}

function handleOrderFormSubmit(form) {
  const nameInput = form.querySelector('[name="fullName"]');
  const mobileInput = form.querySelector('[name="mobile"]');
  const serviceInput = form.querySelector('[name="service"]');
  const sizeInput = form.querySelector('[name="size"]');
  const quantityInput = form.querySelector('[name="quantity"]');
  const designReqInput = form.querySelector('[name="designReq"]');
  const deliveryDateInput = form.querySelector('[name="deliveryDate"]');
  const notesInput = form.querySelector('[name="notes"]');

  // Basic validation
  let hasError = false;

  if (!nameInput || !nameInput.value.trim()) {
    markInputError(nameInput, 'कृपया आपले पूर्ण नाव टाका');
    hasError = true;
  } else {
    clearInputError(nameInput);
  }

  const mobileVal = mobileInput ? mobileInput.value.trim() : '';
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileVal || !mobileRegex.test(mobileVal.replace(/\D/g, '').slice(-10))) {
    markInputError(mobileInput, 'कृपया वैध १० अंकी मोबाईल नंबर टाका');
    hasError = true;
  } else {
    clearInputError(mobileInput);
  }

  if (hasError) {
    showToast('कृपया आवश्यक माहिती योग्य प्रकारे भरा.');
    return;
  }

  const data = {
    fullName: nameInput.value.trim(),
    mobile: mobileVal,
    service: serviceInput ? serviceInput.value.trim() : 'सर्वसाधारण प्रिंटिंग',
    size: sizeInput ? sizeInput.value.trim() : 'लागू नाही / गरजेनुसार',
    quantity: quantityInput ? quantityInput.value.trim() : '१',
    designReq: designReqInput ? designReqInput.value.trim() : 'नवीन डिझाईन हवी आहे',
    deliveryDate: deliveryDateInput ? deliveryDateInput.value.trim() : 'लवकरात लवकर',
    notes: notesInput ? notesInput.value.trim() : 'काही नाही'
  };

  // Structured Marathi Message as requested
  const message = `नमस्कार मोरया ग्राफिक्स,

मला खालील सेवेसाठी ऑर्डर द्यायची आहे.

सेवा: ${data.service}

माझी माहिती:
नाव: ${data.fullName}
मोबाईल: ${data.mobile}
आकार: ${data.size}
Quantity: ${data.quantity}
Design Requirement: ${data.designReq}
Delivery Date: ${data.deliveryDate}
Additional Requirement: ${data.notes}

कृपया मला किंमत आणि पुढील माहिती कळवा.`;

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${MORAYA_CONFIG.waNumber}?text=${encodedMessage}`;

  showToast('तुमची ऑर्डर माहिती तयार आहे. WhatsApp उघडत आहे...', 3500);

  setTimeout(() => {
    window.open(waUrl, '_blank');
    form.reset();
  }, 1000);
}

function markInputError(input, errorMsg) {
  if (!input) return;
  input.style.borderColor = '#C60000';
  let hint = input.parentElement.querySelector('.form-hint-error');
  if (!hint) {
    hint = document.createElement('div');
    hint.className = 'form-hint form-hint-error';
    hint.style.color = '#C60000';
    input.parentElement.appendChild(hint);
  }
  hint.textContent = errorMsg;
}

function clearInputError(input) {
  if (!input) return;
  input.style.borderColor = '';
  const hint = input.parentElement.querySelector('.form-hint-error');
  if (hint) {
    hint.remove();
  }
}

// 7. Quick Inquiry Form (for Contact page)
function initQuickInquiryForms() {
  const contactForms = document.querySelectorAll('.quick-inquiry-form');
  if (!contactForms.length) return;

  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const msg = form.querySelector('[name="message"]').value.trim();

      if (!name || !phone) {
        showToast('कृपया नाव आणि मोबाईल नंबर टाका.');
        return;
      }

      const text = `नमस्कार मोरया ग्राफिक्स,

माझे नाव: ${name}
मोबाईल: ${phone}
मेसेज: ${msg || 'मला तुमच्या सेवांबद्दल अधिक माहिती हवी आहे.'}

कृपया संपर्क साधावा.`;

      const url = `https://wa.me/${MORAYA_CONFIG.waNumber}?text=${encodeURIComponent(text)}`;
      showToast('माहिती तयार आहे. WhatsApp उघडत आहे...', 2500);
      setTimeout(() => {
        window.open(url, '_blank');
        form.reset();
      }, 800);
    });
  });
}

// 8. Portfolio Category Filter
function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  if (!filterBtns.length || !portfolioItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// 9. Lightbox Modal Functionality
function initLightbox() {
  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
        <div class="lightbox-img-wrap">
          <img src="" alt="Portfolio Showcase" id="lightbox-img">
        </div>
        <div class="lightbox-footer">
          <div class="lightbox-info">
            <h3 id="lightbox-title"></h3>
            <p id="lightbox-category"></p>
          </div>
          <button class="btn btn-whatsapp btn-sm" id="lightbox-wa-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.26 15.01 3.81 13.48 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.04 8.02 12.2C8.14 12.37 9.73 14.96 12.25 15.96C14.35 16.79 14.78 16.62 15.23 16.58C15.68 16.54 16.68 15.99 16.89 15.4C17.1 14.82 17.1 14.32 17.04 14.22C16.97 14.12 16.81 14.06 16.56 13.93C16.31 13.81 15.1 13.22 14.87 13.14C14.65 13.06 14.48 13.01 14.32 13.26C14.15 13.51 13.68 14.06 13.54 14.22C13.4 14.39 13.26 14.41 13.01 14.28C12.76 14.16 11.96 13.9 11.01 13.05C10.27 12.39 9.77 11.57 9.63 11.32C9.48 11.07 9.61 10.93 9.74 10.81C9.85 10.7 9.99 10.52 10.12 10.37C10.24 10.22 10.29 10.11 10.37 9.95C10.45 9.78 10.41 9.64 10.35 9.52C10.29 9.39 9.79 8.18 9.59 7.68C9.39 7.19 9.19 7.26 9.03 7.25C8.89 7.24 8.71 7.33 8.53 7.33Z"/>
            </svg>
            या डिझाईनबद्दल विचारा
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const lightboxImg = modal.querySelector('#lightbox-img');
  const lightboxTitle = modal.querySelector('#lightbox-title');
  const lightboxCategory = modal.querySelector('#lightbox-category');
  const lightboxClose = modal.querySelector('.lightbox-close');
  const lightboxWaBtn = modal.querySelector('#lightbox-wa-btn');

  const openLightbox = (src, title, category) => {
    lightboxImg.src = src;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    lightboxWaBtn.onclick = () => {
      const msg = `नमस्कार मोरया ग्राफिक्स,

मला तुमच्या पोर्टफोलिओमधील "${title}" (${category}) या डिझाईनसारखे काम करून हवे आहे.

कृपया याबद्दल दर आणि पुढील माहिती कळवा.`;
      const url = `https://wa.me/${MORAYA_CONFIG.waNumber}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    };
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || (card.querySelector('.portfolio-title') ? card.querySelector('.portfolio-title').textContent : 'पोर्टफोलिओ डिझाईन');
      const category = card.getAttribute('data-category') || '';
      if (img) {
        openLightbox(img.src, title, category);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// 10. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Optional: close other accordion items in the same container
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
      }

      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}
