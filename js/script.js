//get add btn
const addBtn = document.querySelector(".todo__add-btn");

//get the form
const getForm = document.querySelector(".form");

//get save btn
const save = document.querySelector(".btn-save");

//get cancel btn
const cancel = document.querySelector(".btn-cancel");

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

  //get result
  const setTodo = document.querySelector(".todo__items");

  const item = document.querySelector(`[data-key='${todoItem.id}']`);

  //if todoItem contains deleted remove it from DOM
  if (todoItem.deleted) {
    item.remove();
    if (todoItems.length === 0) setTodo.innerHTML = "";
    //don't do anything just get out of the main function
    return;
  }

  //Main logic starts

  //create new node
  const node = document.createElement("li");

  //add todo_item class
  node.setAttribute("class", "todo__item");
  //add data-key very important
  node.setAttribute("data-key", todoItem.id);
  //separate all the words based on space after
  const highlightArr = todoItem.text.split(/(\s+)/);
  console.log(highlightArr)
  //update the text according to the color
  let updatedText = highlightArr.reduce((acc, cur) => {
    if (cur.includes(todoItem.content)) {
      acc += `${cur.replace(
        `${todoItem.content}`,
        `<span style='color:${todoItem.color};font-weight:500'>${todoItem.content}</span>`
      )}`;
    } else {
      acc += cur;
    }
    return acc;
  }, ``);
  //add the content in the node
  node.innerHTML = `
  <section class="card card--shadow">
  <p>${todoItem.content}</p>
  <p>${updatedText}</p>
  <div class="form__btn card__btn">
    <a href="#" class="btn btn--secondary btn-update" id=${todoItem.id}>Update</a>
    <button class="btn btn--primary btn-delete" id="${todoItem.id}">Delete</button>

  </div>
</section>`;

  //if the item is already present in the DOM replace it else add it
  if (item) {
    setTodo.replaceChild(node, item);
  } else {
    setTodo.append(node);
  }
}
//delete function
function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id == Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  todoItems = todoItems.filter((item) => item.id != Number(key));
  renderTodo(todo);
}

//Update function
function updateTodo(key) {
  const index = todoItems.findIndex((item) => item.id == Number(key));
  const setForm = Object.values(getForm);

  //set the value of todoItem back to form its hardcoded but will do the job
  setForm[0].value = todoItems[index].content;
  setForm[1].value = todoItems[index].color;
  setForm[2].value = todoItems[index].text;
  setForm[3].id = todoItems[index].id;
  setForm[4].id = todoItems[index].id;
  //make the form visible
  handleCancel();
}

//add todoItem
function addTodoItem(content, color, text, id) {
  let todoItem = {
    content,
    color,
    text,
    id,
  };
  //if id is already present in case of update just provide it previous id
  if (id) {
    todoItem.id = id;
    todoItems = todoItems.filter((item) => item.id != Number(id));
  } else {
    todoItem.id = Date.now();
  }
  //push into the todoItems dataStructure
  todoItems.push(todoItem);
  //Show Item on the DOM
  renderTodo(todoItem);
}

//get data from the form and pass to addTodoItem
let getData = (e) => {
  e.preventDefault();

  addTodoItem(
    ...Object.values(getForm).map((item) => {
      const value = item.value;

      if (item.id) {
        const id = item.id;
        item.id = "";
        return id;
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

//call this event went click on save
save.addEventListener("click", getData);

//restore data after refresh
document.addEventListener("DOMContentLoaded", (e) => {
  const res = localStorage.getItem("todoData");
  if (res) {
    const data = JSON.parse(res);
    data.forEach((item) => {
      todoItems.push(item);
      renderTodo(item);
    });
  }
});

//get hold of Whole todoItems
const list = document.querySelector(".todo__items");
//get the event of when click on list
list.addEventListener("click", (event) => {
  //update todo
  if (event.target.classList.contains("btn-update")) {
    const itemKey = event.target.id;
    updateTodo(itemKey);
  }

  //delete todo
  if (event.target.classList.contains("btn-delete")) {
    const itemKey = event.target.id;
    deleteTodo(itemKey);
  }
});
