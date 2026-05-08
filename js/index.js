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
const form = document.getElementById("registrationForm");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

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
  };

  // Prepare FormData with sanitized data for Web3Forms
  const web3FormData = new FormData();
  Object.keys(sanitizedData).forEach((key) => {
    web3FormData.append(key, sanitizedData[key]);
  });
  web3FormData.append("access_key", "446b5f13-0bca-4c11-be3b-244b4a9c1363");

  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("Success! Your message has been sent.");
      form.reset();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    alert("Something went wrong. Please try again.");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
