const addBtn = document.querySelector(".todo__add-btn");

const getForm=document.querySelector('.form')

addBtn.onclick = () => {
 getForm.classList.toggle('get-form')
};
