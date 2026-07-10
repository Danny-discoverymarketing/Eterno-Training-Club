const WHATSAPP_NUMBER = "52XXXXXXXXXX";
const whatsappBase = `https://wa.me/${WHATSAPP_NUMBER}`;

const differentiators = [
  {
    title: "No es un gimnasio convencional",
    body:
      "La identidad se basa en fuerza, disciplina y estilo de vida. La propuesta es formar parte de una comunidad enfocada en mejorar fisica y personalmente.",
  },
  {
    title: "Instalaciones nuevas y equipo de alta calidad",
    body:
      "El material promocional muestra instalaciones, pesas, mancuernas y aparatos nuevos, con una experiencia mas cuidada que un gimnasio saturado.",
  },
  {
    title: "Diferentes areas y servicios",
    body:
      "Areas de fuerza, coaches, clases y recuperacion permiten combinar entrenamiento individual, asesoramiento y actividades dirigidas dentro del mismo lugar.",
  },
];

const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const testimonialCard = document.querySelector("#testimonialCard");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

let activeTestimonial = 0;

function makeWhatsAppUrl(message) {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

function closeMenu() {
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

function renderTestimonial() {
  const item = differentiators[activeTestimonial];
  testimonialCard.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.body}</p>
  `;
}

function setWhatsAppLinks() {
  const defaultMessage = "Hola, quiero informacion sobre Eterno Training Club y agendar una visita.";
  document.querySelector("#whatsAppFloat").href = makeWhatsAppUrl(defaultMessage);
  document.querySelector("#contactWhatsApp").href = makeWhatsAppUrl(defaultMessage);
  document.querySelectorAll("[data-plan]").forEach((link) => {
    const plan = link.dataset.plan;
    link.href = makeWhatsAppUrl(`Hola, quiero informacion sobre ${plan} en Eterno Training Club.`);
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function validateField(field) {
  const row = field.closest(".form-row");
  if (!row) return field.checked || field.value.trim().length > 0;

  const error = row.querySelector("small");
  let message = "";

  if (field.validity.valueMissing) message = "Este campo es obligatorio.";
  else if (field.type === "email" && field.validity.typeMismatch) message = "Ingresa un correo valido.";
  else if (field.name === "name" && field.value.trim().length < 2) message = "Ingresa tu nombre completo.";
  else if (field.name === "phone" && field.value.replace(/\D/g, "").length < 8) message = "Ingresa un telefono valido.";
  else if (field.name === "message" && field.value.trim().length < 8) message = "Cuéntanos un poco mas.";

  row.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
  return !message;
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  elements.forEach((item) => observer.observe(item));
}

window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) closeMenu();
});

document.querySelector("#prevTestimonial").addEventListener("click", () => {
  activeTestimonial = (activeTestimonial - 1 + differentiators.length) % differentiators.length;
  renderTestimonial();
});

document.querySelector("#nextTestimonial").addEventListener("click", () => {
  activeTestimonial = (activeTestimonial + 1) % differentiators.length;
  renderTestimonial();
});

document.querySelector("#galleryGrid").addEventListener("click", (event) => {
  const item = event.target.closest(".gallery-item");
  if (!item) return;
  lightboxImage.src = item.dataset.src;
  lightboxImage.alt = `Fotografia de ${item.dataset.title} en Eterno Training Club`;
  lightboxTitle.textContent = item.dataset.title;
  document.body.classList.add("lightbox-open");
  lightbox.showModal();
});

document.querySelector("#lightboxClose").addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll("input:not([type='checkbox']), select, textarea")];
  const fieldsAreValid = fields.map(validateField).every(Boolean);
  const privacy = document.querySelector("#privacy");

  if (!privacy.checked) {
    formStatus.textContent = "Acepta el aviso de privacidad para continuar.";
    formStatus.style.color = "#ef8f8f";
    return;
  }

  if (!fieldsAreValid) {
    formStatus.textContent = "Revisa los campos marcados antes de enviar.";
    formStatus.style.color = "#ef8f8f";
    return;
  }

  const data = new FormData(contactForm);
  const message = `Hola, soy ${data.get("name")}. Me interesa ${data.get("membership")}. Telefono: ${data.get("phone")}. Correo: ${data.get("email")}. Mensaje: ${data.get("message")}`;
  formStatus.textContent = "Solicitud lista. Se abrira WhatsApp para enviar el mensaje.";
  formStatus.style.color = "";
  window.open(makeWhatsAppUrl(message), "_blank", "noopener");
  contactForm.reset();
});

contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
});

document.querySelector("#year").textContent = new Date().getFullYear();

setWhatsAppLinks();
renderTestimonial();
updateHeader();
initReveal();
