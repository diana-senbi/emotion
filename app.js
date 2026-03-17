const video = document.getElementById("video");
const startCameraBtn = document.getElementById("startCameraBtn");
const stopCameraBtn = document.getElementById("stopCameraBtn");
const emotionResult = document.getElementById("emotionResult");
const emotionMessage = document.getElementById("emotionMessage");
const emotionButtons = document.querySelectorAll(".emotion-btn");
const moodDiaryList = document.getElementById("moodDiaryList");
const clearDiaryBtn = document.getElementById("clearDiaryBtn");
const dailyWarmText = document.getElementById("dailyWarmText");
const newWarmTextBtn = document.getElementById("newWarmTextBtn");
const messageForm = document.getElementById("messageForm");
const recipientName = document.getElementById("recipientName");
const messageText = document.getElementById("messageText");
const messagePreview = document.getElementById("messagePreview");
const previewName = document.getElementById("previewName");
const previewText = document.getElementById("previewText");
const wallForm = document.getElementById("wallForm");
const wallText = document.getElementById("wallText");
const wallList = document.getElementById("wallList");

let currentStream = null;

const emotionMessages = {
  "қуаныш": "Бүгінгі жақсы көңіл күйің ұзаққа созылсын 🤍",
  "мұң": "Өзіңе аздап тынығуға мүмкіндік бер. Бәрі біртіндеп реттеледі.",
  "шаршау": "Сен көп күш жұмсап жүрсің. Кішкене демалыс та маңызды.",
  "қобалжу": "Баяу тыныс алып көр. Сен ойлағаннан да мықтысың.",
  "тыныштық": "Ішкі тыныштығың саған жақсы шешімдер сыйласын.",
  "таңғалу": "Жаңа сезімдер мен жақсы сәттер саған қуаныш әкелсін."
};

const warmTexts = [
  "Өзіңе жұмсақ қара. Әр күнің бірдей болмауы қалыпты.",
  "Кішкентай қадамдар да үлкен жолдың бөлігі.",
  "Сенің барыңның өзі маңызды 🤍",
  "Бүгін өзіңе жылы сөз айтуды ұмытпа.",
  "Шаршадың ба? Онда сәл демалып ал. Бұл да қамқорлық.",
  "Жүрегің тыныштық тапсын, күнің мейірімге толсын.",
  "Кейде баяулау — әлсіздік емес, өзіңді түсіну.",
  "Сен ойлағаннан да күштірексің."
];

const bodyClassMap = {
  "қуаныш": "joy",
  "мұң": "sad",
  "шаршау": "tired",
  "қобалжу": "anxious",
  "тыныштық": "calm",
  "таңғалу": "surprised"
};

function getTimeString() {
  const now = new Date();
  return now.toLocaleString("kk-KZ");
}

function setEmotion(emotion) {
  emotionResult.textContent = emotion;
  emotionMessage.textContent = emotionMessages[emotion] || "Жылы күндер көп болсын 🤍";
  updateBackground(emotion);
  saveMood(emotion);
}

function updateBackground(emotion) {
  document.body.classList.remove("joy", "sad", "tired", "anxious", "calm", "surprised");
  const cssClass = bodyClassMap[emotion];
  if (cssClass) {
    document.body.classList.add(cssClass);
  }
}

function saveMood(emotion) {
  const diary = JSON.parse(localStorage.getItem("moodDiary") || "[]");
  diary.unshift({
    emotion,
    time: getTimeString()
  });

  const limitedDiary = diary.slice(0, 8);
  localStorage.setItem("moodDiary", JSON.stringify(limitedDiary));
  renderDiary();
}

function renderDiary() {
  const diary = JSON.parse(localStorage.getItem("moodDiary") || "[]");
  moodDiaryList.innerHTML = "";

  if (diary.length === 0) {
    moodDiaryList.innerHTML = "<li>Әзірше эмоциялар сақталған жоқ.</li>";
    return;
  }

  diary.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.emotion} — ${item.time}`;
    moodDiaryList.appendChild(li);
  });
}

function setRandomWarmText() {
  const randomText = warmTexts[Math.floor(Math.random() * warmTexts.length)];
  dailyWarmText.textContent = randomText;
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Бұл браузер камераны қолдамайды.");
    return;
  }

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    video.srcObject = currentStream;

    setTimeout(() => {
      autoMockEmotion();
    }, 2000);
  } catch (error) {
    alert("Камера ашылмады. Рұқсат беріп қайта көр.");
    console.error(error);
  }
}

function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    currentStream = null;
  }
}

function autoMockEmotion() {
  const emotions = ["қуаныш", "мұң", "шаршау", "қобалжу", "тыныштық", "таңғалу"];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  setEmotion(randomEmotion);
}

function renderWall() {
  const wallMessages = JSON.parse(localStorage.getItem("wallMessages") || "[]");
  wallList.innerHTML = "";

  if (wallMessages.length === 0) {
    wallList.innerHTML = `<div class="wall-item">Мұнда әлі жылы сөз жоқ. Алғашқы болып жаз 🤍</div>`;
    return;
  }

  wallMessages.forEach(text => {
    const div = document.createElement("div");
    div.className = "wall-item";
    div.textContent = text;
    wallList.appendChild(div);
  });
}

startCameraBtn.addEventListener("click", startCamera);
stopCameraBtn.addEventListener("click", stopCamera);

emotionButtons.forEach(button => {
  button.addEventListener("click", () => {
    const emotion = button.dataset.emotion;
    setEmotion(emotion);
  });
});

clearDiaryBtn.addEventListener("click", () => {
  localStorage.removeItem("moodDiary");
  renderDiary();
});

newWarmTextBtn.addEventListener("click", setRandomWarmText);

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = recipientName.value.trim();
  const text = messageText.value.trim();

  if (!name || !text) return;

  previewName.textContent = name;
  previewText.textContent = text;
  messagePreview.classList.remove("hidden");

  recipientName.value = "";
  messageText.value = "";
});

wallForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = wallText.value.trim();
  if (!text) return;

  const wallMessages = JSON.parse(localStorage.getItem("wallMessages") || "[]");
  wallMessages.unshift(text);
  localStorage.setItem("wallMessages", JSON.stringify(wallMessages.slice(0, 12)));

  wallText.value = "";
  renderWall();
});

renderDiary();
setRandomWarmText();
renderWall();
