const addBtn = document.querySelectorAll(".add-btn:not(.solid)");
const saveBtn = document.querySelectorAll(".solid");
const addContainer = document.querySelectorAll(".add-item-container");
const addItem = document.querySelectorAll(".add-item");

// variable to check local Storage loaded
let localLoaded = false;

// Item Lists
const columnLists = document.querySelectorAll(".list-items");
const todoLists = document.getElementById("todo-list");
const progressLists = document.getElementById("progress-list");
const completedLists = document.getElementById("completed-list");




// drag list
let draggingItem;
let currentColumn;

// Items
let todoListArray = [];
let progressListArray = [];
let completedListArray = [];
let totalListArray = [todoListArray,progressListArray,completedListArray];
// Drag Functionality

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns(){
    if(localStorage.getItem("todoListItems")){
        todoListArray = JSON.parse(localStorage.todoListItems);
        progressListArray = JSON.parse(localStorage.progessItems);
        completedListArray = JSON.parse(localStorage.completedItems);
    } else {
        todoListArray = ['Release the course', 'Sit back and relax'];
        progressListArray = ['Work on projects', 'Listen to music'];
        completedListArray = ['Being cool', 'Getting stuff done'];
    }
}

// set Arrays to localStorage
function updateSavedColumns(){
    totalListArray = [todoListArray,progressListArray,completedListArray];
    let listItemNames = ["todoList","progess","completed"];
    listItemNames.forEach((listName,index) => {
        localStorage.setItem(`${listName}Items`,JSON.stringify(totalListArray[index]));
    });
}

// filter the array Elements if it value is null
function filterList(listArray){
    const filteredArray = listArray.filter(item => item !== null);
    return filteredArray;
}


// update or delete the particular element 
function updateItem(column,index){
    const selectedArray = totalListArray[column];
    const selectedColumnEl = columnLists[column].children;
    if(!selectedColumnEl[index].textContent){
        delete selectedArray[index]
    }
    else{
        selectedArray[index] = selectedColumnEl[index].textContent;
    }
    updateDom(); 
}

// making the clicking element editable
function editable(event){
    // setting a clicked element as editable
    event.target.contentEditable = true;
    // setting focus to update the text when focus is out
    event.target.focus();
}

// create Element function
function createElement(columnEl, column, item, index){
    // list item
    const listElement = document.createElement("li");
    listElement.classList.add("list-item");
    listElement.textContent = item;
    listElement.draggable = true;
    listElement.setAttribute("ondragstart","drag(event)");
    // making listElement editable
    listElement.setAttribute("onclick","editable(event)");
    // update the dom when focus out
    listElement.setAttribute("onfocusout",`updateItem(${column},${index})`);
    // Append
    columnEl.appendChild(listElement);
}

// update Dom
function updateDom(){
    // update localStorage
    if(!localLoaded){
        getSavedColumns();
    }
    // update dom of todo-list column
    todoLists.textContent = '';
    // filtering array 
    todoListArray = filterList(todoListArray);
    todoListArray.forEach((item, index) =>{
        createElement(todoLists, 0, item, index)
    })
    // update dom of progress column
    progressLists.textContent = '';
    progressListArray = filterList(progressListArray);
    progressListArray.forEach((item, index) =>{
        createElement(progressLists, 1, item, index)
    })
    // update dom of completed column
    completedLists.textContent = '';
    completedListArray = filterList(completedListArray);
    completedListArray.forEach((item, index) =>{
        createElement(completedLists, 2, item, index)
    })
    // setting localLoaded to true
    localLoaded = true;
    // updating local storage
    updateSavedColumns();
}

// ondragstart function will be called when element is dragged
function drag(event){
    draggingItem = event.target;
}

// column allows for items to drop in
function allowDrop(event){
    event.preventDefault();
}

// drop event occurs when the item is dropped
function drop(event){
    event.preventDefault();
    // remove background color
    columnLists.forEach((column) => {
        column.classList.remove("over");
    });
    // add item to column
    const parent = columnLists[currentColumn];
    parent.appendChild(draggingItem);
    rebuildArray();
}

// calls when a draggable element enters a drop target
function dragEnter(column){
    console.log(column)
    columnLists[column].classList.add("over");
    currentColumn = column;
}

// rebuilding arrays to store current values in local storage
function rebuildArray(){
    // reseting arrays before updating local storage
    todoListArray = [];
    for (let i = 0; i < todoLists.children.length; i++){
        todoListArray.push(todoLists.children[i].textContent);
    }
    progressListArray = [];
    for (let i = 0; i < progressLists.children.length; i++){
        progressListArray.push(progressLists.children[i].textContent);
    }
    completedListArray = [];
    for (let i = 0; i < completedLists.children.length; i++){
        completedListArray.push(completedLists.children[i].textContent);
    }
    // updating local storage
    updateSavedColumns();
}

// Event listener for buttons and container

// show add item input box
function showInputBox(column){
    addBtn[column].style.display = "none";
    saveBtn[column].style.display = "flex";
    addContainer[column].style.display = "flex";  
}

// add item to column
function addToColumn(column){
    const item = addItem[column].textContent;
    const selectedArray = totalListArray[column];
    if(item.length){
    selectedArray.push(item);
    addItem[column].textContent = "";
    updateDom();
    }
}

// hide add item input box
function hideInputBox(column){
    addBtn[column].style.display = "flex";
    saveBtn[column].style.display = "none";
    addContainer[column].style.display = "none";
    addToColumn(column);
}

updateDom();

