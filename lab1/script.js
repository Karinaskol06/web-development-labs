// Масив об'єктів з подіями програми
const events = [
  {
    time: "11:00",
    title: "Реєстрація учасників",
    location: "Хол навчального корпусу № 2",
    category: "Організаційне",
  },
  {
    time: "11:30",
    title: "Презентація факультету",
    location: "Актова зала",
    category: "Презентація",
  },
  {
    time: "12:15",
    title: "Знайомство з освітніми програмами",
    location: "Аудиторія 203",
    category: "Презентація",
  },
  {
    time: "13:00",
    title: "Демонстрація студентських проєктів",
    location: "Лабораторія 305",
    category: "Практика",
  },
  {
    time: "14:00",
    title: "Запитання та відповіді",
    location: "Актова зала",
    category: "Спілкування",
  },
  {
    time: "14:30",
    title: "Екскурсія університетом",
    location: "Початок у холі",
    category: "Екскурсія",
  },
];

// Масив із зареєстрованими учасниками
// const бо новий масив не присвоюється, а тільки змінюється вміст існуючого
const participants = [];

// Посилання на DOM-елементи
// знаходимо html елементи за id та зберігаємо їх у змінних
const programList = document.querySelector("#program-list");
const programStatus = document.querySelector("#program-status");
const categoryFilter = document.querySelector("#category-filter");
const eventSearch = document.querySelector("#event-search");
const registrationForm = document.querySelector("#registration-form");
const formMessage = document.querySelector("#form-message");
const participantList = document.querySelector("#participant-list");
const participantCount = document.querySelector("#participant-count");
const eventSelect = document.querySelector("#event-select");

// Створення випадаючого списку категорій
function renderCategories() {
  // Проходимось по категоріям, дістаємо назви і прибираємо дублікати
  // (загортаємо в Set) і перетворюємо в масив
  const categories = [...new Set(events.map((event) => event.category))];

  for (const category of categories) {
    // Створює в пам'яті новий тег (пункт списку)
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  }
}

// Список з подіями для форми реєстрації
function renderEventOptions() {
  for (const event of events) {
    const option = document.createElement("option");
    option.value = event.title;
    option.textContent = `${event.time} — ${event.title}`;
    eventSelect.append(option);
  }
}

// Створення одного рядка таблиці програми
function createProgramRow(event) {
  const row = document.createElement("tr"); // створюємо рядок

  const timeCell = document.createElement("th"); // комірка для часу
  timeCell.scope = "row"; // для доступності та браузерів
  const time = document.createElement("time"); // створюємо новий html тег
  time.dateTime = event.time; // додаємо атрибут datetime
  time.textContent = event.time; // додаємо текстовий вміст всередину тегу
  timeCell.append(time); // вкладаємо створений тег в комірку таблиці

  const titleCell = document.createElement("td");
  titleCell.textContent = event.title;

  const locationCell = document.createElement("td");
  locationCell.textContent = event.location;

  const categoryCell = document.createElement("td");
  categoryCell.textContent = event.category;

  // Збираємо всі комірки в рядок таблиці
  row.append(timeCell, titleCell, locationCell, categoryCell);
  // Повертаємо готовий рядок
  return row;
}

// Вивід програми на сторінку
function renderProgram(items) {
  // Очищаємо список перед виводом нових даних
  programList.replaceChildren();

  // Проходимось по масиву і додаємо рядки подій
  for (const event of items) {
    programList.append(createProgramRow(event));
  }

  if (items.length > 0) {
    programStatus.textContent = `Знайдено подій: ${items.length}`;
  } else {
    programStatus.textContent = "За заданими умовами подій не знайдено.";
  }

  // Додаємо або прибираємо клас is-empty в залежності від наявності подій
  programStatus.classList.toggle("is-empty", items.length === 0);
}

// Фільтрація та пошук
function filterProgram() {
  const selectedCategory = categoryFilter.value; // вибране значення
  const query = eventSearch.value.trim().toLowerCase(); // обрізаємо пробіли, в нижній регістр

  // Створюємо новий масив з подіями, які відповідають фільтру та пошуку
  const filtered = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchesQuery = event.title.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  renderProgram(filtered);
}

// Вивід списку зареєстрованих учасників списком <ul>
function renderParticipants() {
  participantList.replaceChildren();

  // Проходимось по масиву учасників і додаємо їх до списку
  for (const participant of participants) {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    const info = document.createElement("span");

    // Встановлюємо текстовий вміст тегів
    name.textContent = participant.name;
    info.textContent = ` — ${participant.event}`;
    item.append(name, info);
    participantList.append(item);
  }

  participantCount.textContent = participants.length;
}

// Повідомлення під формою
function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`; // додаємо клас (error or success) для стилізації
}

function clearFormMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

// Допоміжні функції для підсвічування помилок
function clearFieldErrors(...inputs) {
  for (const input of inputs) {
    input.classList.remove("field-error");
  }
}

function setFieldError(input, message) {
  input.classList.add("field-error");
  input.focus();
  showFormMessage(message, "error");
}

// Обробка форми реєстрації
function handleSubmit(submitEvent) {
  submitEvent.preventDefault();

  // Дістаємо значення полів форми
  const nameInput = registrationForm.elements.fullName;
  const emailInput = registrationForm.elements.email;
  const phoneInput = registrationForm.elements.phone;
  const consentInput = registrationForm.elements.consent;

  clearFormMessage();
  clearFieldErrors(
    nameInput,
    emailInput,
    phoneInput,
    eventSelect,
    consentInput,
  );

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const selectedEvent = eventSelect.value;

  if (name.length < 2) {
    setFieldError(nameInput, "Укажіть ім’я довжиною щонайменше два символи.");
    return;
  }

  if (email.length === 0 || !emailInput.checkValidity()) {
    setFieldError(emailInput, "Укажіть коректну адресу електронної пошти.");
    return;
  }

  if (phone.length < 7) {
    setFieldError(phoneInput, "Укажіть коректний номер телефону.");
    return;
  }

  if (selectedEvent === "") {
    setFieldError(eventSelect, "Оберіть один захід зі списку.");
    return;
  }

  if (!consentInput.checked) {
    setFieldError(consentInput, "Потрібна згода на обробку введених даних.");
    return;
  }

  participants.push({ name, event: selectedEvent });
  renderParticipants();
  registrationForm.reset();
  showFormMessage("Реєстрацію успішно додано до списку учасників.", "success");
}

// Підписка на події для фільтрації та пошуку і для обробки форми
categoryFilter.addEventListener("change", filterProgram);
eventSearch.addEventListener("input", filterProgram);
registrationForm.addEventListener("submit", handleSubmit);

// Початковий рендер (категорії, події та учасники)
renderCategories();
renderEventOptions();
renderProgram(events);
renderParticipants();
