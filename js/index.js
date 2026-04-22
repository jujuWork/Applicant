const form = document.getElementById("registrationForm");
const requiredFields = [
    "lastName",
    "firstName",
    "telephone",
    "address",
    "age",
    "email",
    "license",
];
// VALIDATING IF ON YOUR INPUT
function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input)
        return false;
    const isEmpty = input.value.trim() === "";
    if (isEmpty) {
        input.style.border = "2px solid red";
        return false;
    }
    else {
        input.style.border = "2px solid green";
        return true;
    }
}
// Validating the input fields
function validateForm(fields) {
    return fields.every((field) => validateField(field));
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isValid = validateForm(requiredFields);
    if (isValid) {
        form.submit();
    }
    else {
        console.warn("Form validation failed: missing or invalid fields");
    }
});
export {};
//# sourceMappingURL=index.js.map