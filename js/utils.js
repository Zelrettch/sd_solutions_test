"use strict";
// INPUT HANDLING
export function validateInput(input) {
  const regex = /^[A-Za-z0-9]+=[A-Za-z0-9]+$/;
  return regex.test(input);
}

export function parseInput(input) {
  const [key, value] = input.split("=");
  return { key: key.trim(), value: value.trim() };
}

// LIST HANDLING
let elementsList = [];

export function addPair({ key, value }) {
  const existingRecord = localStorage.getItem(key);
  if (existingRecord) {
    return false;
  }
  localStorage.setItem(key, value);
  const el = createListElement(key, value);
  elementsList.push(el);
  return true;
}

function createListElement(key, value) {
  const el = document.createElement("li");
  el.textContent = `${key}=${value}`;
  el.dataset.key = key;
  el.dataset.value = value;
  return el;
}

export function loadHtmlElements() {
  const pairs = [...Object.entries(localStorage)];
  const elems = pairs.map((el) => {
    return createListElement(...el);
  });
  elementsList.push(...elems);
}

export function getSortedList(option) {
  return elementsList.sort((a, b) => {
    if (option === "value") {
      return a.dataset.value.localeCompare(b.dataset.value);
    } else {
      return a.dataset.key.localeCompare(b.dataset.key);
    }
  });
}

export function deletePair(key) {
  localStorage.removeItem(key);
  elementsList = elementsList.filter((el) => el.dataset.key !== key);
}

// XML HANDLING
export function generateXML() {
  const pairs = [...Object.entries(localStorage)];
  const p = pairs
    .map((el) => {
      return `<span>
      ${generateXmlLine(el[0], el[1])}
    </span>`;
    })
    .join("<br>");
  return p;
}

function generateXmlLine(key, value) {
  const str = `<pair><key>${key}</key><value>${value}</value></pair>`;
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
