// FORM SUBMISSION FOR n8n

const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const json = Object.fromEntries(data.entries());

  await fetch("YOUR_WEBHOOK_URL", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  alert("Application Sent!");
});
