/* Configure these values after creating an EmailJS service and template. */
const EMAIL_CONFIG = {
  publicKey: "EajJFtIklRIS3_KSC",
  serviceId: "service_qeuyy2n",
  templateId: "template_5dysrd6"
};

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const dialog = document.querySelector(".inquiry-dialog");
const closeDialogButton = document.querySelector(".dialog-close");
const inquiryForm = document.querySelector("#inquiry-form");
const formStatus = document.querySelector(".form-status");
const submitButton = inquiryForm.querySelector(".submit-button");
const submitLabel = inquiryForm.querySelector(".submit-label");
let lastFocusedElement = null;

document.querySelector("#current-year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

function openInquiry(button) {
  lastFocusedElement = document.activeElement;
  if (button.dataset.service) {
    inquiryForm.elements.service.value = button.dataset.service;
  }
  if (!dialog.open) {
    dialog.showModal();
    document.body.classList.add("dialog-open");
    dialog.querySelector("input[name='full_name']").focus();
  }
}

document.querySelectorAll("[data-open-inquiry]").forEach((button) => {
  button.addEventListener("click", () => openInquiry(button));
});

function closeInquiry() {
  if (dialog.open) {
    dialog.close();
    document.body.classList.remove("dialog-open");
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }
}

closeDialogButton.addEventListener("click", closeInquiry);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeInquiry();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
});

function setFormStatus(message, isError) {
  formStatus.textContent = message;
  formStatus.classList.toggle("is-error", isError);
}

function validateForm() {
  let firstInvalidField = null;
  inquiryForm.querySelectorAll("[required]").forEach((field) => {
    const error = field.parentElement.querySelector(".field-error");
    let message = "";
    if (!field.value.trim()) {
      message = field.name === "message" ? "Please tell us a little about your project." : "Please enter your full name.";
      if (field.name === "email") message = "Please enter your email address.";
    } else if (field.type === "email" && !field.validity.valid) {
      message = "Please enter a valid email address.";
    }
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
    if (message && !firstInvalidField) firstInvalidField = field;
  });
  if (firstInvalidField) {
    firstInvalidField.focus();
    setFormStatus("Please check the highlighted fields.", true);
    return false;
  }
  return true;
}

inquiryForm.querySelectorAll("[required]").forEach((field) => {
  field.addEventListener("input", () => {
    field.removeAttribute("aria-invalid");
    const error = field.parentElement.querySelector(".field-error");
    if (error) error.textContent = "";
    if (!formStatus.classList.contains("is-error")) return;
    setFormStatus("", false);
  });
});

function emailIsConfigured() {
  return window.emailjs
    && EMAIL_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY"
    && EMAIL_CONFIG.serviceId !== "YOUR_EMAILJS_SERVICE_ID"
    && EMAIL_CONFIG.templateId !== "YOUR_EMAILJS_TEMPLATE_ID";
}

inquiryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  if (!emailIsConfigured()) {
    setFormStatus("This inquiry form is not connected yet. Please contact the site owner to complete the EmailJS setup.", true);
    return;
  }

  submitButton.disabled = true;
  submitButton.classList.add("is-loading");
  submitLabel.textContent = "Sending request";
  setFormStatus("", false);

  const formData = new FormData(inquiryForm);
  const templateParams = {
    full_name: formData.get("full_name").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    company: formData.get("company").trim(),
    service: formData.get("service"),
    message: formData.get("message").trim()
  };

  try {
    await window.emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams, {
      publicKey: EMAIL_CONFIG.publicKey
    });
    inquiryForm.reset();
    inquiryForm.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
    inquiryForm.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; });
    setFormStatus("Thank you — your request has been sent. We’ll be in touch soon.", false);
  } catch (error) {
    console.error("EmailJS inquiry submission failed:", error);
    setFormStatus("We couldn’t send your request right now. Please try again in a moment.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");
    submitLabel.textContent = "Submit Request";
  }
});

const testimonialTrack = document.querySelector(".testimonial-track");
const testimonialCards = [...testimonialTrack.children];
let testimonialIndex = 0;

function visibleTestimonials() {
  if (window.matchMedia("(max-width: 600px)").matches) return 1;
  if (window.matchMedia("(max-width: 880px)").matches) return 2;
  return 3;
}

function updateTestimonials() {
  const gap = parseFloat(getComputedStyle(testimonialTrack).gap) || 0;
  const cardWidth = testimonialCards[0].getBoundingClientRect().width;
  const maxIndex = Math.max(0, testimonialCards.length - visibleTestimonials());
  testimonialIndex = Math.min(testimonialIndex, maxIndex);
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * (cardWidth + gap)}px)`;
}

document.querySelector("[data-testimonial-prev]").addEventListener("click", () => {
  testimonialIndex = testimonialIndex === 0 ? testimonialCards.length - visibleTestimonials() : testimonialIndex - 1;
  updateTestimonials();
});
document.querySelector("[data-testimonial-next]").addEventListener("click", () => {
  const maxIndex = Math.max(0, testimonialCards.length - visibleTestimonials());
  testimonialIndex = testimonialIndex >= maxIndex ? 0 : testimonialIndex + 1;
  updateTestimonials();
});
window.addEventListener("resize", updateTestimonials);

const companyCarousel = document.querySelector("[data-company-carousel]");
const companySlides = [...companyCarousel.querySelectorAll("[data-company-slide]")];
const companyDots = [...companyCarousel.querySelectorAll("[data-company-dot]")];
let companySlideIndex = 0;

function showCompanySlide(index) {
  companySlideIndex = (index + companySlides.length) % companySlides.length;
  companySlides.forEach((slide, slideIndex) => {
    slide.hidden = slideIndex !== companySlideIndex;
  });
  companyDots.forEach((dot, dotIndex) => {
    dot.setAttribute("aria-current", String(dotIndex === companySlideIndex));
  });
}

companyCarousel.querySelector("[data-company-previous]").addEventListener("click", () => {
  showCompanySlide(companySlideIndex - 1);
});
companyCarousel.querySelector("[data-company-next]").addEventListener("click", () => {
  showCompanySlide(companySlideIndex + 1);
});
companyDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showCompanySlide(Number(dot.dataset.companyDot));
  });
});
