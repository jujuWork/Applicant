const form = document.getElementById("registrationForm") as HTMLFormElement;

const requiredFields: string[] = [
  "lastName",
  "firstName",
  "telephone",
  "address",
  "age",
  "email",
  "license",
];

// VALIDATING IF ON YOUR INPUT
function validateField(fieldId: string): boolean {
  const input = document.getElementById(fieldId) as
    | HTMLInputElement
    | HTMLSelectElement;

  if (!input) return false;

  const isEmpty: boolean = input.value.trim() === "";

  if (isEmpty) {
    input.style.border = "2px solid red";
    return false;
  } else {
    input.style.border = "2px solid green";
    return true;
  }
}

// Validating the input fields
function validateForm(fields: string[]): boolean {
  return fields.every((field) => validateField(field));
}

form.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();

  const isValid: boolean = validateForm(requiredFields);

  if (isValid) {
    form.submit();
  } else {
    console.warn("Form validation failed: missing or invalid fields");
  }
});
