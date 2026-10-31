"use strict";
// Two data objects keep product information and validation requirements organized.
const bakeryProducts = {
  signature: { name: "Signature Loaf", description: "Golden artisan bread with a soft center" },
  pastries: { name: "Fresh Pastries", description: "Freshly baked treats for any time of day" },
  cakes: { name: "Celebration Cakes", description: "Cakes for birthdays and special occasions" }
};
const fieldRules = {
  "customer-name": { label: "Full name", min: 2 },
  "customer-email": { label: "Email address" },
  "request-type": { label: "Request type" },
  "item-details": { label: "Item details", min: 5 }
};
const FAVORITE_KEY = "northStarBakeryFavorite";
function showFavorite(value, restored = false) {
  const status = document.getElementById("favorite-status");
  if (!status) return;
  const item = bakeryProducts[value];
  status.textContent = item ? `${restored ? "Remembered" : "Saved"} favorite: ${item.name} — ${item.description}.` : "No favorite saved yet.";
}
function initializeFavorites() {
  const select = document.getElementById("favorite-item");
  if (!select) return;
  let saved = "";
  try { saved = localStorage.getItem(FAVORITE_KEY) || ""; } catch (error) { console.warn("Storage unavailable", error); }
  if (bakeryProducts[saved]) { select.value = saved; showFavorite(saved, true); }
  document.getElementById("save-favorite").addEventListener("click", () => {
    const value = select.value;
    if (!bakeryProducts[value]) { document.getElementById("favorite-status").textContent = "Please choose a product before saving."; return; }
    try { localStorage.setItem(FAVORITE_KEY, value); showFavorite(value); }
    catch (error) { document.getElementById("favorite-status").textContent = "Your selection is visible, but this browser blocked saving it."; }
  });
  document.getElementById("clear-favorite").addEventListener("click", () => {
    try { localStorage.removeItem(FAVORITE_KEY); } catch (error) { console.warn("Storage unavailable", error); }
    select.value = ""; showFavorite("");
  });
}
function validateField(input) {
  const rule = fieldRules[input.id];
  const error = document.getElementById(`${input.id}-error`);
  if (!rule || !error) return true;
  const value = input.value.trim();
  let message = "";
  if (!value) message = `${rule.label} is required.`;
  else if (rule.min && value.length < rule.min) message = `${rule.label} must contain at least ${rule.min} characters.`;
  else if (input.id === "customer-email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Enter a valid email address (example: name@example.com).";
  error.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
  input.setAttribute("aria-describedby", error.id);
  return !message;
}
function initializeContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const inputs = Object.keys(fieldRules).map(id => document.getElementById(id));
  inputs.forEach(input => { input.addEventListener("input", () => validateField(input)); input.addEventListener("change", () => validateField(input)); });
  form.addEventListener("submit", event => {
    event.preventDefault(); // Demo site: never send data to a server.
    const results = inputs.map(validateField);
    const status = document.getElementById("form-status");
    if (results.some(valid => !valid)) { status.textContent = "Please correct the highlighted fields before continuing."; inputs[results.indexOf(false)].focus(); }
    else status.textContent = "Your request looks good! This is a class demonstration; no message was sent.";
  });
}
document.addEventListener("DOMContentLoaded", () => { initializeFavorites(); initializeContactForm(); });
