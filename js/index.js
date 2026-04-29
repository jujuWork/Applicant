// Import Vercel Analytics
import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
inject();

// Sanitization function
function sanitizeInput(value, type = "text") {
  let sanitized = value.trim();

  if (type === "text") {
    // Remove HTML tags and dangerous characters
    sanitized = sanitized.replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
  } else if (type === "email") {
    sanitized = sanitized.toLowerCase().trim();
  } else if (type === "number") {
    sanitized = sanitized.replace(/[^\d]/g, "");
  }

  return sanitized;
}

// Validation function
function validateForm(formData) {
  const errors = {};
  const requiredFields = [
    "lastName",
    "firstName",
    "telephone",
    "address",
    "age",
    "email",
  ];

  requiredFields.forEach((field) => {
    const value = formData.get(field).trim();
    if (!value) {
      errors[field] =
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });

  return errors;
}

// Display error messages
function displayErrors(errors) {
  // Clear previous errors
  document.querySelectorAll(".field-error").forEach((el) => el.remove());
  document
    .querySelectorAll(".input-error")
    .forEach((el) => el.classList.remove("input-error"));

  // Show new errors
  Object.keys(errors).forEach((fieldName) => {
    const input = document.querySelector(`input[name="${fieldName}"]`);
    if (input) {
      input.classList.add("input-error");
      const errorDiv = document.createElement("span");
      errorDiv.classList.add("field-error");
      errorDiv.textContent = errors[fieldName];
      input.parentElement.insertBefore(errorDiv, input.nextSibling);
    }
  });
}

// Form submission handler
document
  .getElementById("registrationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Validate required fields
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      displayErrors(errors);
      return;
    }

    // Clear previous errors if validation passes
    document.querySelectorAll(".field-error").forEach((el) => el.remove());
    document
      .querySelectorAll(".input-error")
      .forEach((el) => el.classList.remove("input-error"));

    // Sanitize each field
    const sanitizedData = {
      lastName: sanitizeInput(formData.get("lastName"), "text"),
      firstName: sanitizeInput(formData.get("firstName"), "text"),
      telephone: sanitizeInput(formData.get("telephone"), "number"),
      address: sanitizeInput(formData.get("address"), "text"),
      age: parseInt(sanitizeInput(formData.get("age"), "number")),
      email: sanitizeInput(formData.get("email"), "email"),
      visa: sanitizeInput(formData.get("visa"), "text"),
      license: sanitizeInput(formData.get("license"), "text"),
    };

    // Send to n8n webhook
    try {
      const response = await fetch("YOUR_N8N_WEBHOOK_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });
      console.log("Success:", response);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form");
    }
  });
