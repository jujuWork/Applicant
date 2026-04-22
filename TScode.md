// ============================================================
// STEP 1 — Define what our form data looks like (a "type")
// This just tells TypeScript what fields we expect
// ============================================================

type FormData = {
lastName: string;
firstName: string;
telephone: string;
address: string;
age: number;
email: string;
visa: string;
license: string;
};

// ============================================================
// STEP 2 — SANITIZE (clean the inputs before using them)
// We remove dangerous characters the user might have typed
// ============================================================

// Cleans normal text fields — removes HTML tags and dangerous symbols
function cleanText(value: string): string {
let clean = value.replace(/<[^>]\*>/g, ""); // remove anything like <script>
clean = clean.replace(/[<>"'`]/g, ""); // remove leftover dangerous chars
clean = clean.trim(); // remove extra spaces at start/end
return clean;
}

// Cleans phone numbers — only keeps digits and phone symbols like + - ( )
function cleanPhone(value: string): string {
return value.replace(/[^\d\s\+\-\(\)]/g, "").trim();
}

// Cleans email — lowercases it and removes spaces
function cleanEmail(value: string): string {
return value.toLowerCase().trim();
}

// Cleans age — only keeps numbers, no letters or symbols
function cleanAge(value: string): string {
return value.replace(/[^\d]/g, "");
}

// ============================================================
// STEP 3 — VALIDATE (check if the inputs are correct)
// Returns an object with any error messages found
// ============================================================

function validateForm(data: FormData): Record<string, string> {
// This will store our errors: { fieldName: "error message" }
const errors: Record<string, string> = {};

// --- Last Name ---
if (data.lastName === "") {
errors.lastName = "Last name is required.";
} else if (data.lastName.length < 2) {
errors.lastName = "Last name must be at least 2 characters.";
}

// --- First Name ---
if (data.firstName === "") {
errors.firstName = "First name is required.";
} else if (data.firstName.length < 2) {
errors.firstName = "First name must be at least 2 characters.";
}

// --- Telephone ---
if (data.telephone === "") {
errors.telephone = "Telephone is required.";
} else if (data.telephone.length < 7) {
errors.telephone = "Telephone number is too short.";
}

// --- Address ---
if (data.address === "") {
errors.address = "Address is required.";
} else if (data.address.length < 5) {
errors.address = "Address must be at least 5 characters.";
}

// --- Age ---
if (isNaN(data.age)) {
errors.age = "Age is required.";
} else if (data.age < 0 || data.age > 120) {
errors.age = "Age must be between 0 and 120.";
}

// --- Email ---
const emailIsValid = data.email.includes("@") && data.email.includes(".");
if (data.email === "") {
errors.email = "Email is required.";
} else if (!emailIsValid) {
errors.email = "Please enter a valid email address.";
}

// visa and license are optional, so no required check needed

return errors; // will be empty {} if everything is valid
}

// ============================================================
// STEP 4 — SHOW / CLEAR ERRORS on the page
// ============================================================

// Removes all error messages currently shown on the form
function clearErrors(): void {
const errorMessages = document.querySelectorAll(".field-error");
errorMessages.forEach((el) => el.remove());

const errorInputs = document.querySelectorAll(".input-error");
errorInputs.forEach((el) => el.classList.remove("input-error"));
}

// Shows an error message below a specific input field
function showError(fieldName: string, message: string): void {
const input = document.querySelector(`[name="${fieldName}"]`);
if (!input) return; // stop if the input doesn't exist

// Highlight the input in red
input.classList.add("input-error");

// Create a small red message and place it after the input
const errorSpan = document.createElement("span");
errorSpan.className = "field-error";
errorSpan.textContent = message;
input.insertAdjacentElement("afterend", errorSpan);
}

// ============================================================
// STEP 5 — READ values from the form inputs
// ============================================================

function getInputValue(fieldName: string): string {
const input = document.querySelector<HTMLInputElement>(`[name="${fieldName}"]`);
return input ? input.value : ""; // return empty string if not found
}

// ============================================================
// STEP 6 — SUBMIT HANDLER (runs when user clicks Submit)
// ============================================================

async function handleSubmit(event: Event): Promise<void> {
event.preventDefault(); // stop the page from refreshing

clearErrors(); // wipe any old error messages

// --- Read raw values from each input ---
const raw = {
lastName: getInputValue("lastName"),
firstName: getInputValue("firstName"),
telephone: getInputValue("telephone"),
address: getInputValue("address"),
age: getInputValue("age"),
email: getInputValue("email"),
visa: getInputValue("visa"),
license: getInputValue("license"),
};

// --- Clean / sanitize the values ---
const cleaned: FormData = {
lastName: cleanText(raw.lastName),
firstName: cleanText(raw.firstName),
telephone: cleanPhone(raw.telephone),
address: cleanText(raw.address),
age: Number(cleanAge(raw.age)), // convert string "25" to number 25
email: cleanEmail(raw.email),
visa: cleanText(raw.visa),
license: cleanText(raw.license),
};

// --- Validate the cleaned values ---
const errors = validateForm(cleaned);

// If there are any errors, show them and stop
if (Object.keys(errors).length > 0) {
for (const fieldName in errors) {
showError(fieldName, errors[fieldName]);
}
return; // stop here — don't submit
}

// --- If no errors, send the data to the server ---
try {
const form = document.getElementById("registrationForm") as HTMLFormElement;

    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleaned), // convert object to JSON string
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    form.reset(); // clear the form
    alert("Registration submitted successfully!");

} catch (error) {
console.error("Something went wrong:", error);
alert("Submission failed. Please try again.");
}
}

// ============================================================
// STEP 7 — ATTACH the handler to the form
// Waits for the page to fully load before looking for the form
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("registrationForm");

if (form) {
form.addEventListener("submit", handleSubmit);
} else {
console.error("Could not find the form on the page.");
}
});

/\* ============================================================
SUGGESTED CSS — paste into your stylesheet
============================================================

.input-error {
border: 1px solid #e53e3e;
background-color: #fff5f5;
}

.field-error {
display: block;
color: #e53e3e;
font-size: 0.8rem;
margin-top: 2px;
margin-bottom: 6px;
}

============================================================ \*/
