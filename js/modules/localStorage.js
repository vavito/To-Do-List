export function salvarTarefas() {
    const tarefas = [];
    const todosOsItens = document.querySelectorAll(".task-container li");

    todosOsItens.forEach(item => {
        tarefas.push({
            texto: item.textContent,
            concluida: item.classList.contains("finished-task-text")
        });
    });

    localStorage.setItem("minhas_tarefas", JSON.stringify(tarefas));
}

export function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("minhas_tarefas");
    // Se não houver nada, retornamos um array vazio
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
}