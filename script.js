
// Elementos HTML
const inputTarefa = document.getElementById("inputTarefa");
const btnAdicionar = document.getElementById("btnAdicionar");
const listaTarefas = document.getElementById("listaTarefas");
const contador = document.getElementById("contador");
const btnLimpar = document.getElementById("btnLimpar");
const filtros = document.querySelectorAll(".filtro");

// Lista de tarefas
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";

// Salvar tarefas no LocalStorage
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Adicionar tarefa
function adicionarTarefa() {
    const texto = inputTarefa.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa!");
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false
    };

    tarefas.push(novaTarefa);

    inputTarefa.value = "";

    salvarTarefas();
    renderizarTarefas();
}

// Excluir tarefa
function excluirTarefa(id) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);

    salvarTarefas();
    renderizarTarefas();
}

// Concluir tarefa
function concluirTarefa(id) {
    tarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            tarefa.concluida = !tarefa.concluida;
        }

        return tarefa;
    });

    salvarTarefas();
    renderizarTarefas();
}

// Editar tarefa
function editarTarefa(id) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id);

    const novoTexto = prompt("Editar tarefa:", tarefa.texto);

    if (novoTexto === null) {
        return;
    }

    if (novoTexto.trim() === "") {
        alert("A tarefa não pode ficar vazia!");
        return;
    }

    tarefa.texto = novoTexto.trim();

    salvarTarefas();
    renderizarTarefas();
}

// Atualizar contador
function atualizarContador() {
    const total = tarefas.length;

    const concluidas = tarefas.filter(
        tarefa => tarefa.concluida
    ).length;

    contador.textContent =
        `Total: ${total} | Concluídas: ${concluidas}`;
}

// Mostrar tarefas na tela
function renderizarTarefas() {
    listaTarefas.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual === "pendentes") {
            return !tarefa.concluida;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida;
        }

        return true;
    });

    tarefasFiltradas.forEach(tarefa => {

        const item = document.createElement("li");
        item.classList.add("tarefa");

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        const texto = document.createElement("span");
        texto.textContent = tarefa.texto;

        const acoes = document.createElement("div");
        acoes.classList.add("acoes");

        const btnConcluir = document.createElement("button");
        btnConcluir.textContent = tarefa.concluida ? "↩" : "✓";
        btnConcluir.classList.add("btnConcluir");

        btnConcluir.addEventListener("click", () => {
            concluirTarefa(tarefa.id);
        });

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✎";
        btnEditar.classList.add("btnEditar");

        btnEditar.addEventListener("click", () => {
            editarTarefa(tarefa.id);
        });

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "X";
        btnExcluir.classList.add("btnExcluir");

        btnExcluir.addEventListener("click", () => {
            excluirTarefa(tarefa.id);
        });

        acoes.appendChild(btnConcluir);
        acoes.appendChild(btnEditar);
        acoes.appendChild(btnExcluir);

        item.appendChild(texto);
        item.appendChild(acoes);

        listaTarefas.appendChild(item);
    });

    atualizarContador();
}

// Filtrar tarefas
filtros.forEach(botao => {
    botao.addEventListener("click", () => {

        filtroAtual = botao.dataset.filtro;

        filtros.forEach(filtro => {
            filtro.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        renderizarTarefas();
    });
});

// Evento de adicionar
btnAdicionar.addEventListener("click", adicionarTarefa);

// Adicionar usando Enter
inputTarefa.addEventListener("keydown", evento => {
    if (evento.key === "Enter") {
        adicionarTarefa();
    }
});

// Limpar todas as tarefas
btnLimpar.addEventListener("click", () => {

    if (tarefas.length === 0) {
        return;
    }

    const confirmar = confirm("Deseja excluir todas as tarefas?");

    if (confirmar) {
        tarefas = [];

        salvarTarefas();
        renderizarTarefas();
    }
});

// Inicializar aplicação
renderizarTarefas();
