const accordion = document.querySelector("[data-accordion]");
const form = document.querySelector("#contact-form");
const success = document.querySelector("#form-success");
const newMessageButton = document.querySelector("#new-message");

const fields = {
  name: {
    element: document.querySelector("#name"),
    error: document.querySelector("#name-error"),
    validate(value) {
      if (value.length < 2) {
        return "נא לכתוב שם מלא, לפחות שתי אותיות.";
      }
      if (!/[\p{L}]/u.test(value)) {
        return "השם צריך לכלול אותיות.";
      }
      return "";
    },
  },
  email: {
    element: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate(value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value)) {
        return "נא להזין כתובת אימייל תקינה.";
      }
      return "";
    },
  },
  phone: {
    element: document.querySelector("#phone"),
    error: document.querySelector("#phone-error"),
    validate(value) {
      if (!value) {
        return "";
      }
      const digits = value.replace(/\D/g, "");
      if (digits.length < 9 || digits.length > 13 || !/^[+\d][\d\s()-]*$/.test(value)) {
        return "מספר הטלפון נראה לא שלם. אפשר להשאיר את השדה ריק.";
      }
      return "";
    },
  },
  topic: {
    element: document.querySelector("#topic"),
    error: document.querySelector("#topic-error"),
    validate(value) {
      if (!value) {
        return "נא לבחור נושא לפנייה.";
      }
      return "";
    },
  },
  message: {
    element: document.querySelector("#message"),
    error: document.querySelector("#message-error"),
    validate(value) {
      if (value.length < 10) {
        return "ההודעה קצרה מדי. כתבו לפחות משפט קצר.";
      }
      if (value.length > 600) {
        return "ההודעה ארוכה מדי. עד 600 תווים יספיקו.";
      }
      return "";
    },
  },
};

function setFieldError(field, message) {
  const wrapper = field.element.closest(".field");
  field.error.textContent = message;
  field.error.hidden = !message;
  wrapper.classList.toggle("is-invalid", Boolean(message));
  field.element.setAttribute("aria-invalid", message ? "true" : "false");
  if (message) {
    field.element.setAttribute("aria-describedby", field.error.id);
  } else {
    field.element.removeAttribute("aria-describedby");
  }
}

function validateField(field) {
  const message = field.validate(field.element.value.trim());
  setFieldError(field, message);
  return !message;
}

accordion.addEventListener("click", (event) => {
  const trigger = event.target.closest(".faq-trigger");
  if (!trigger || !accordion.contains(trigger)) {
    return;
  }

  const item = trigger.closest(".faq-item");
  const panel = item.querySelector(".faq-panel");
  const willOpen = !item.classList.contains("is-open");

  accordion.querySelectorAll(".faq-item").forEach((other) => {
    const otherTrigger = other.querySelector(".faq-trigger");
    const otherPanel = other.querySelector(".faq-panel");
    const open = other === item && willOpen;
    other.classList.toggle("is-open", open);
    otherTrigger.setAttribute("aria-expanded", String(open));
    otherPanel.hidden = !open;
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const invalid = Object.values(fields).filter((field) => !validateField(field));
  if (invalid.length) {
    invalid[0].element.focus();
    return;
  }

  form.hidden = true;
  success.hidden = false;
  success.focus?.();
});

Object.values(fields).forEach((field) => {
  field.element.addEventListener("input", () => {
    if (field.element.getAttribute("aria-invalid") === "true") {
      validateField(field);
    }
  });
  field.element.addEventListener("change", () => {
    if (field.element.getAttribute("aria-invalid") === "true") {
      validateField(field);
    }
  });
});

newMessageButton.addEventListener("click", () => {
  form.reset();
  Object.values(fields).forEach((field) => setFieldError(field, ""));
  success.hidden = true;
  form.hidden = false;
  fields.name.element.focus();
});
