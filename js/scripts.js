"use strict";

import { salvarTarefas, carregarTarefas } from './modules/localStorage.js';

const addTaskForm = document.querySelector("#add-task-form");
const addTaskInput = document.querySelector("#add-task-input");
const taskList = document.querySelector("#task-list");
const taskListSearchbar = document.querySelector(".task-list-searchbar");
const tarefasIniciais = carregarTarefas(); 

tarefasIniciais.forEach(tarefa => {
    adicionarTarefaNaTela(tarefa.texto, tarefa.concluida);
});

// Aqui criamos uma função para verificar se existem tarefas cadastradas
function verificarTarefas() {
    const tarefas = document.querySelectorAll(".task-container");

    // caso tenha 1 ou mais tarefas, retorna 1. Do contrário retorna 0
    if (tarefas.length >= 1) {
        return 1;
    }
    else {
        return 0;
    }
}

function adicionarTarefaNaTela(taskText, concluida = false) {
    if (taskText === "") return;

    const taskListInfo = document.querySelector(".task-list-info");
    taskListInfo.classList.add("hidden");

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    const taskTextElement = document.createElement("li");
    taskTextElement.textContent = taskText;
    
    // Se a tarefa vier do localStorage como concluída, aplicamos a classe
    if (concluida) {
        taskTextElement.classList.add("finished-task-text");
    }

    const taskBtnContainer = document.createElement("div");
    taskBtnContainer.classList.add("task-btn-container");

    const completeTaskBtn = document.createElement("button");
    completeTaskBtn.type = "button";
    completeTaskBtn.classList.add("complete-task-btn");
    
    const editTaskBtn = document.createElement("button");
    editTaskBtn.type = "button";
    editTaskBtn.classList.add("edit-task-btn");
    editTaskBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    
    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.type = "button";
    deleteTaskBtn.classList.add("delete-task-btn");
    deleteTaskBtn.innerHTML = `<i class="fa-solid fa-x"></i>`;

    // Se estiver concluída, não precisa do botão editar
    if (concluida) editTaskBtn.remove();

    taskBtnContainer.append(editTaskBtn, deleteTaskBtn);
    taskContainer.append(completeTaskBtn, taskTextElement, taskBtnContainer);
    taskList.appendChild(taskContainer);
}

addTaskForm.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = addTaskInput.value.trim();
    
    if (texto !== "") {
        adicionarTarefaNaTela(texto);
        salvarTarefas();
        addTaskInput.value = "";
    }
});

taskList.addEventListener("click", (evento) => {
    // COMPLETE
    const completeBtn = evento.target.closest(".complete-task-btn");

    if (completeBtn) {
        const taskContainer = completeBtn.closest(".task-container");
        const taskTextElement = taskContainer.querySelector("li");

        taskTextElement.classList.add("finished-task-text");

        const editBtn = taskContainer.querySelector(".edit-task-btn");
        editBtn.remove();
        salvarTarefas();
    }

    // DELETE
    const deleteBtn = evento.target.closest(".delete-task-btn");

    if (deleteBtn) {
        const taskContainer = deleteBtn.closest(".task-container");
        taskContainer.remove();
        
        if (verificarTarefas() === 0) {
            const taskListInfo = document.querySelector(".task-list-info");
            taskListInfo.classList.remove("hidden");
        }
        
        salvarTarefas();
        return;
    }

    // EDIT
    const editBtn = evento.target.closest(".edit-task-btn");

    if (!editBtn) {
        return;
    }

    const taskContainer = editBtn.closest(".task-container");
    const taskTextElement = taskContainer.querySelector("li");

    taskTextElement.setAttribute("contenteditable", "true");
    taskTextElement.focus();

    taskTextElement.addEventListener("blur", () => {
        taskTextElement.removeAttribute("contenteditable");

        if (taskTextElement.textContent.trim() === "") {
            taskTextElement.textContent = "Tarefa sem nome";
        }

        salvarTarefas();
    }, { once: true });
})

taskListSearchbar.addEventListener("keyup", () => {
    const searchbarTxt = taskListSearchbar.value.toLowerCase().trim();
    const tasks = taskList.querySelectorAll("li");

    tasks.forEach(task => {
        const taskContainer = task.closest(".task-container");

        if (task.textContent.toLowerCase().includes(searchbarTxt)) {
            taskContainer.classList.remove("hidden");
        } else {
            taskContainer.classList.add("hidden");
        }
    })
})