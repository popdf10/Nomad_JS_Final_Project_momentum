const clock = document.querySelector(".jsClock"),
  nameForm = document.querySelector(".jsForm"),
  nameInput = nameForm.querySelector("input"),
  name = document.querySelector(".jsName"),
  todoForm = document.querySelector(".jsTodoForm"),
  todoInput = todoForm.querySelector("input"),
  ul = document.querySelector(".jsTodoList"),
  body = document.querySelector("body"),
  weather = document.querySelector(".jsWeather");

const API_KEY = "93b68b9758640a51e06e939a99732de1";

const NAME_LS = "name";
const SHOWING_CN = "showing";
const TODO_LS = "todo";
const IMG_NUM = 3;
const COORDS_LS = "coords";

let toDos = [];

function getTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  clock.innerText = `${hours < 10 ? `0${hours}` : hours} : ${
    minutes < 10 ? `0${minutes}` : minutes
  } : ${seconds < 10 ? `0${seconds}` : seconds}`;
}

function loadName() {
  const userName = localStorage.getItem(NAME_LS);
  if (userName === null) {
    nameForm.classList.add(SHOWING_CN);
    nameForm.addEventListener("submit", handleSubmitName);
  } else {
    paintName(userName);
  }
}

function handleSubmitName(event) {
  event.preventDefault();
  const userName = nameInput.value;
  localStorage.setItem("name", userName);
  paintName(userName);
}

function paintName(text) {
  nameForm.classList.remove(SHOWING_CN);
  name.classList.add(SHOWING_CN);
  name.innerText = `Welcome ${text}!`;
}

function loadToDo() {
  const loadedToDos = localStorage.getItem(TODO_LS);
  if (loadedToDos !== null) {
    const parsedToDos = JSON.parse(loadedToDos);
    parsedToDos.forEach(function (toDo) {
      paintToDo(toDo.text);
    });
  }
}

function paintToDo(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = Date.now();
  delBtn.innerText = "✔";
  delBtn.addEventListener("click", handleClickDel);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.id = newId;
  ul.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId,
  };
  toDos.push(toDoObj);
  saveToDos();
}

function handleClickDel(event) {
  const delLi = event.target.parentNode;
  ul.removeChild(delLi);
  const cleanToDos = toDos.filter(function (todo) {
    return todo.id !== parseInt(delLi.id);
  });
  toDos = cleanToDos;
  saveToDos();
}

function saveToDos() {
  localStorage.setItem(TODO_LS, JSON.stringify(toDos));
}

function handleSubmitToDo(event) {
  event.preventDefault();
  const inputToDo = todoInput.value;
  paintToDo(inputToDo);
  todoInput.value = "";
}

function getRandom() {
  const number = Math.floor(Math.random() * IMG_NUM);
  return number;
}

function paintImg(number) {
  const img = new Image();
  img.src = `images/${number + 1}.jpg`;
  body.appendChild(img);
  img.classList.add("bgImage");
}

function saveLocation(coordsObj) {
  localStorage.setItem(COORDS_LS, JSON.stringify(coordsObj));
}

function handleSuccessLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    latitude,
    longitude,
  };
  saveLocation(coordsObj);
  getWeather(latitude, longitude);
}

function handleError() {
  console.log("Can't Access GeoLocation.");
}

function getWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const temperature = json.main.temp;
      const place = json.name;
      weather.innerText = `${place}: ${temperature}°C`;
    });
}

function loadLocation() {
  const loadedLocation = localStorage.getItem(COORDS_LS);
  if (loadedLocation === null) {
    navigator.geolocation.getCurrentPosition(
      handleSuccessLocation,
      handleError
    );
  } else {
    const parsedLocation = JSON.parse(loadedLocation);
    getWeather(parsedLocation.latitude, parsedLocation.longitude);
  }
}

function init() {
  getTime();
  setInterval(getTime, 1000);
  loadName();
  loadToDo();
  todoForm.addEventListener("submit", handleSubmitToDo);
  const randNum = getRandom();
  paintImg(randNum);
  loadLocation();
}

init();
