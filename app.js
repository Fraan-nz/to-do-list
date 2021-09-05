//Elements
const btnClean = document.getElementById("clean");
const dateElement = document.getElementById("date");
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const hours = document.querySelector(".header__hours");
const minutes = document.querySelector(".header__minutes");
const header = document.querySelector(".header");
//classes
const checkIcon = "fa-check-circle";
const uncheckIcon = "fa-circle";
const lineThrough = "lineThrough";
//Date
const options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();
//Variables
let id = 0;
let list = [];
let hour = 0;
let minute = 0;
let number = 0;

//Get localStorage
let localData = localStorage.getItem("Tareas");

//Show date
dateElement.innerHTML = today.toLocaleDateString("sp-AR", options);

//Add task to the list
const addNewTask = (task, id, done, deleted) => {
	if (deleted) return;
	const taskDone = done ? checkIcon : uncheckIcon;
	const textLine = done ? lineThrough : "";
	const taskItem = `  
    <li class="app__item">
		<span class="app__check" stat="complete" id="${id}">
			<i class="far ${taskDone}"></i>
		</span>
        <p class="app__task ${textLine}">${task}</p>
        <span class="app__delete" stat="delete" id="${id}">
			<i class="far fa-trash-alt"></i>
		</span>
    </li> `;
	taskList.insertAdjacentHTML("beforeend", taskItem);
};

//Enter event
document.addEventListener("keyup", (e) => {
	if (e.key == "Enter") {
		const task = taskInput.value;
		if (task) {
			addNewTask(task, id, false, false);
			list.push({
				text: task,
				id: id,
				done: false,
				deleted: false,
			});
			localStorage.setItem("Tareas", JSON.stringify(list));
			id++;
		}
		taskInput.value = "";
	}
});
//Click event
addButton.addEventListener("click", () => {
	const task = taskInput.value;
	if (task) {
		addNewTask(task, id, false, false);
		list.push({
			text: task,
			id: id,
			done: false,
			deleted: false,
		});
		localStorage.setItem("Tareas", JSON.stringify(list));
		id++;
	}
	taskInput.value = "";
});

//Complete task
const completeTask = (elem) => {
	elem.childNodes[1].classList.toggle(checkIcon);
	elem.childNodes[1].classList.toggle(uncheckIcon);
	elem.parentNode.querySelector(".app__task").classList.toggle(lineThrough);
	list[elem.id].done = list[elem.id].done ? false : true;
};

//Remove task
const removeTask = (elem) => {
	elem.parentNode.parentNode.removeChild(elem.parentNode);
	list[elem.id].deleted = true;
};

//Target elem
taskList.addEventListener("click", function (event) {
	const elem = event.target;
	const elemStat = elem.attributes.stat.value;
	if (elemStat == "complete") {
		completeTask(elem);
	} else if (elemStat == "delete") {
		removeTask(elem);
	}
	localStorage.setItem("Tareas", JSON.stringify(list));
});

//Load list localstorage
const loadList = (arr) => {
	arr.forEach((element) => {
		addNewTask(element.text, element.id, element.done, element.deleted);
	});
};

if (localData) {
	list = JSON.parse(localData);
	id = list.length;
	loadList(list);
} else {
	list = [];
	id = 0;
}

//Clean button
btnClean.addEventListener("click", () => {
	localStorage.clear();
	location.reload();
});

//Add "0" to hours and minutes
const addZero = (n) => {
	if (n.toString().length < 2) return "0".concat(n);
	return n;
};
//Reloj
const reloj = () => {
	const time = new Date();
	hour = addZero(time.getHours());
	minute = addZero(time.getMinutes());
	hours.textContent = hour;
	minutes.textContent = minute;
	if (number != hour) {
		bgImage();
	}
	number = hour;
};

//Background
const bgImage = () => {
	if (hour >= 11 && hour < 18) {
		header.style.backgroundImage = "url(./images/day.png)";
		document.body.classList.add("day");
	} else if ((hour >= 18 && hour < 21) || (hour >= 6 && hour < 11)) {
		header.style.backgroundImage = "url(./images/dawn-sunset.png)";
		document.body.classList.add("dawn-sunset");
	} else if ((hour >= 21 && hour <= 24) || (hour >= 0 && hour < 6)) {
		header.style.backgroundImage = "url(./images/night.png)";
		document.body.classList.add("night");
	}
};

bgImage();
reloj();
setInterval(reloj, 1000);
