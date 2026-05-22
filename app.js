const screens = {
  intro: document.getElementById("intro"),
  topics: document.getElementById("topics"),
  quiz: document.getElementById("quiz"),
  error: document.getElementById("error"),
};

const topicGrid = document.getElementById("topicGrid");
const topicBadge = document.getElementById("topicBadge");
const questionText = document.getElementById("questionText");
const choicesBlock = document.getElementById("choicesBlock");
const choicesList = document.getElementById("choicesList");
const answerBlock = document.getElementById("answerBlock");
const answerText = document.getElementById("answerText");
const errorMessage = document.getElementById("errorMessage");

const btnStart = document.getElementById("btnStart");
const btnBackIntro = document.getElementById("btnBackIntro");
const btnChangeTopic = document.getElementById("btnChangeTopic");
const btnShowChoices = document.getElementById("btnShowChoices");
const btnShowAnswer = document.getElementById("btnShowAnswer");
const btnNext = document.getElementById("btnNext");

let topics = [];
let currentTopic = null;
let questions = [];
let deck = [];
let usedIds = new Set();
let currentQuestion = null;

const LETTERS = ["A", "B", "C", "D"];

btnStart.addEventListener("click", () => showScreen("topics"));
btnBackIntro.addEventListener("click", () => showScreen("intro"));
btnChangeTopic.addEventListener("click", () => {
  resetQuizState();
  showScreen("topics");
});
btnShowChoices.addEventListener("click", revealChoices);
btnShowAnswer.addEventListener("click", revealAnswer);
btnNext.addEventListener("click", () => showNextQuestion());

init();

async function init() {
  try {
    const res = await fetch("topics.json");
    if (!res.ok) throw new Error("Failed to load topics");
    topics = await res.json();
    renderTopicGrid();
    showScreen("intro");
  } catch (err) {
    showError(err.message);
  }
}

function renderTopicGrid() {
  topicGrid.innerHTML = "";
  for (const topic of topics) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "topic-card";
    btn.innerHTML = `<span class="topic-card__emoji">${topic.emoji}</span><span>${topic.label}</span>`;
    btn.addEventListener("click", () => startTopic(topic));
    topicGrid.appendChild(btn);
  }
}

async function startTopic(topic) {
  resetQuizState();
  currentTopic = topic;
  topicBadge.textContent = `${topic.emoji} ${topic.label}`;

  try {
    const res = await fetch(topic.file);
    if (!res.ok) throw new Error(`Failed to load ${topic.label} questions`);
    questions = await res.json();
    if (!questions.length) throw new Error("No questions in this topic");

    deck = shuffleArray([...questions]);
    usedIds = new Set();
    showScreen("quiz");
    showNextQuestion();
  } catch (err) {
    showError(err.message);
  }
}

function showNextQuestion() {
  if (!deck.length) {
    deck = shuffleArray([...questions]);
    usedIds.clear();
  }

  let next = deck.pop();
  if (usedIds.has(next.id) && deck.length) {
    const alt = deck.find((q) => !usedIds.has(q.id));
    if (alt) {
      deck = deck.filter((q) => q.id !== alt.id);
      deck.push(next);
      next = alt;
    }
  }

  usedIds.add(next.id);
  currentQuestion = next;
  renderQuestion(next);
}

function renderQuestion(q) {
  questionText.textContent = q.question;
  questionText.parentElement.classList.add("fade-in");
  setTimeout(
    () => questionText.parentElement.classList.remove("fade-in"),
    300
  );

  choicesBlock.classList.add("hidden");
  answerBlock.classList.add("hidden");
  btnShowChoices.classList.remove("hidden");
  btnShowChoices.disabled = false;
  btnShowAnswer.classList.remove("hidden");
  btnNext.classList.add("hidden");

  choicesList.innerHTML = "";
  q.choices.forEach((text, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="choice-letter">${LETTERS[i]}</span><span>${text}</span>`;
    choicesList.appendChild(li);
  });
}

function revealChoices() {
  choicesBlock.classList.remove("hidden");
  btnShowChoices.disabled = true;
  btnShowChoices.classList.add("hidden");
}

function revealAnswer() {
  if (!currentQuestion) return;
  answerText.textContent = currentQuestion.answer;
  answerBlock.classList.remove("hidden");
  btnShowAnswer.classList.add("hidden");
  btnNext.classList.remove("hidden");
}

function resetQuizState() {
  currentTopic = null;
  questions = [];
  deck = [];
  usedIds = new Set();
  currentQuestion = null;
}

function showScreen(name) {
  for (const [key, el] of Object.entries(screens)) {
    el.classList.toggle("screen--active", key === name);
  }
}

function showError(msg) {
  errorMessage.textContent = msg;
  showScreen("error");
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
