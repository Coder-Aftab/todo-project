//get add btn
const addBtn = document.querySelector(".todo__add-btn");

//get the form
const getForm = document.querySelector(".form");

//get save btn
const save = document.querySelector(".btn-save");
//get cancel btn
const cancel = document.querySelector(".btn-cancel");

//get delete

//handle the Add of Todo
addBtn.addEventListener("click", handleCancel);

//handle the cancel of Todo
cancel.addEventListener("click", handleCancel);

//remove form
function handleCancel() {
  getForm.classList.toggle("get-form");
}

//todo data structure to save data
let todoItems = [];

function renderTodo(todoItem) {
  //storing in local storage
  localStorage.setItem("todoData", JSON.stringify(todoItems));
  //console.log(todoItems);
  //get result
  const setTodo = document.querySelector(".todo__items");

  const item = document.querySelector(`[data-key='${todoItem.id}']`);

  // add this if block
  if (todoItem.deleted) {
    //console.log(todoItem.id);
    if (setTodo) {
      // remove the item from the DOM
      item.remove();
    }
    return;
  }
  const node = document.createElement("li");

  node.setAttribute("class", "todo__item");
  node.setAttribute("data-key", todoItem.id);

  const highlightArr = todoItem.text.split(/(\s+)/);

  let updatedText = highlightArr.reduce((acc, cur) => {
    if (cur == todoItem.content) {
      acc += `<span style='color:${todoItem.color}'>${todoItem.content}</span>`;
    } else {
      acc += cur;
    }
    return acc;
  }, ``);

  node.innerHTML = `
  <section class="card card--shadow">
  <p>${todoItem.content}</p>
  <p>${updatedText}</p>
  <div class="form__btn card__btn">
    <a href="#" class="btn btn--secondary btn-update" id=${todoItem.id}>Update</a>
    <button class="btn btn--primary btn-delete" id="${todoItem.id}">Delete</button>

  </div>
</section>`;
  if (item) {
    setTodo.replaceChild(node, item);
  } else {
    setTodo.append(node);
    //push into data structure
  }
}

function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  todoItems = todoItems.filter((item) => item.id != Number(key));
  renderTodo(todo);
}

function updateTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  
  const setForm = Object.values(getForm);
  console.log(todoItems);
  setForm[0].value = todoItems[index].content;
  setForm[1].value = todoItems[index].color;
  setForm[2].value = todoItems[index].text;
  setForm[3].id = todoItems[index].id;
  setForm[4].id = todoItems[index].id;
  handleCancel();
}

function addTodoItem(content, color, text, id) {
  console.log(content, color, text, id);
  let todoItem = {
    content,
    color,
    text,
    id,
  };
  if (id) {
    todoItem.id = id;
    todoItems = todoItems.filter((item) => item.id != Number(id));
  } else {
    todoItem.id = Date.now();
  }

  todoItems.push(todoItem);
  //console.log(todoItem);
  renderTodo(todoItem);
}

let getData = (e) => {
  e.preventDefault();

  addTodoItem(
    ...Object.values(getForm).map((item) => {
      const value = item.value;

      if (item.id) {
        return item.id;
      }
      if (value.includes("#")) {
        item.value = "#e8657b";
      } else {
        item.value = "";
      }
      return value;
    })
  );
  handleCancel();
};

save.addEventListener("click", getData);

document.addEventListener("DOMContentLoaded", (e) => {
  const res = localStorage.getItem("todoData");
  //console.log(res);
  if (res) {
    const data = JSON.parse(res);
    data.forEach((item) => {
      todoItems.push(item);
      renderTodo(item);
    });
  }
});

//get hold of clicked todo
const list = document.querySelector(".todo__items");
list.addEventListener("click", (event) => {
  //update todo
  if (event.target.classList.contains("btn-update")) {
    const itemKey = event.target.id;
    updateTodo(itemKey);
  }

  //delete todo
  if (event.target.classList.contains("btn-delete")) {
    const itemKey = event.target.id;
    //console.log(itemKey);
    deleteTodo(itemKey);
  }
});
