"use strict";

import {
  validateInput,
  addPair,
  parseInput,
  getSortedList,
  loadHtmlElements,
  deletePair,
  generateXML,
} from "./utils.js";

const ERROR_MESSAGE = "Input should match the format <name>=<value>";

const elements = {
  inputForm: document.getElementById("input-form"),
  pairInput: document.getElementById("pair-input"),
  pairsList: document.getElementById("pairs-list"),
  addBtn: document.getElementById("add-btn"),
  sortNameBtn: document.getElementById("sort-name-btn"),
  sortValueBtn: document.getElementById("sort-value-btn"),
  deleteBtn: document.getElementById("delete-btn"),
  showXMLBtn: document.getElementById("show-xml-btn"),
  inputError: document.getElementById("input-error"),
  xmlBlock: document.getElementById("xml-block"),
};

// ADDING LOGIC
function showErrorMessage(message) {
  elements.inputError.textContent = message;
  elements.inputError.classList.remove("hidden");
}

function hideErrorMessage() {
  elements.inputError.classList.add("hidden");
}

function handleAdding(e) {
  e.preventDefault();
  const input = elements.pairInput.value;
  if (!validateInput(input)) {
    showErrorMessage(ERROR_MESSAGE);
    return;
  }

  const parsedInput = parseInput(input);
  if (!addPair(parsedInput)) {
    showErrorMessage(`Key "${parsedInput.key}" already exists.`);
    return;
  }

  elements.pairInput.value = "";
  hideErrorMessage();
  renderList();
}

elements.addBtn.addEventListener("click", handleAdding);
elements.inputForm.addEventListener("submit", handleAdding);

// RENDERING LOGIC
let sortOption = "key";

function renderList() {
  const items = getSortedList(sortOption);
  elements.pairsList.innerHTML = "";
  elements.pairsList.append(...items);
  renderXML();
}

elements.sortNameBtn.addEventListener("click", () => {
  sortOption = "key";
  renderList();
});

elements.sortValueBtn.addEventListener("click", () => {
  sortOption = "value";
  renderList();
});

// DELETING LOGIC
const [selected, setSelected] = (() => {
  let selectedList = [];
  const setSelected = (newSelected) => {
    if (selectedList.includes(newSelected)) {
      selectedList = selectedList.filter((el) => el !== newSelected);
      newSelected?.classList.remove("selected");
      return;
    }
    newSelected?.classList.add("selected");
    selectedList.push(newSelected);
  };
  return [selectedList, setSelected];
})();

elements.pairsList.addEventListener("click", (event) => {
  const t = event.target;
  if (t.tagName !== "LI") return;
  setSelected(t);
});

elements.deleteBtn.addEventListener("click", () => {
  selected.forEach((el) => {
    deletePair(el.dataset.key);
  });
  renderList();
});

// XML LOGIC
let xmlMode = false;

elements.showXMLBtn.addEventListener("click", () => {
  if (!xmlMode) {
    elements.pairsList.classList.add("hidden");
    elements.xmlBlock.classList.remove("hidden");
    xmlMode = !xmlMode;
    return;
  }
  elements.pairsList.classList.remove("hidden");
  elements.xmlBlock.classList.add("hidden");
  xmlMode = !xmlMode;
});

function renderXML() {
  const xml = generateXML();
  elements.xmlBlock.innerHTML = xml;
}

loadHtmlElements();
renderList();
