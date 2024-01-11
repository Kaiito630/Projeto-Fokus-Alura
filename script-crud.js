const formTarefa = document.querySelector('.app__form-add-task')
const btnAdicionarTarefa = document.querySelector('.app__button--add-task')
const btnCancelar = document.querySelector('.app__form-footer__button--cancel')
const textarea = document.querySelector('.app__form-textarea')
const listaTarefas = document.querySelector('.app__section-task-list')
const tarefaEmAndamento = document.querySelector('.app__section-active-task-description')
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTarefas = document.querySelector('#btn-remover-todas')
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let liTarefaSelecionada = null

btnRemoverConcluidas.onclick = () => removerTarefas(true)

btnRemoverTarefas.onclick = () => removerTarefas(false)

const removerTarefas = (completas) => {
    let seletor = completas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    tarefas = completas ? tarefas.filter(tarefa => !tarefa.completa) : []
    document.querySelectorAll(seletor).forEach(li => {
        li.remove()
    })
    atualizarTarefas()
} 

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        removeClassActiveTask(liTarefaSelecionada)
        tarefaCompleta(liTarefaSelecionada, liTarefaSelecionada.querySelector('button'))
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
}) 

tarefas.forEach((tarefa) => {
    listaTarefas.append(criarElementoTarefa(tarefa))
})

btnAdicionarTarefa.addEventListener('click', () => {
    if(formTarefa.classList.contains('hidden')) {
        formTarefa.classList.remove('hidden')
    }
    else {
        fecharAdicionarTarefa()
    }
})

formTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault()
    const tarefa = {
        titulo: textarea.value
    }
    tarefas.push(tarefa)
    atualizarTarefas()
    listaTarefas.append(criarElementoTarefa(tarefa))
    fecharAdicionarTarefa()
})

btnCancelar.addEventListener('click', () => {
    fecharAdicionarTarefa()
})

function fecharAdicionarTarefa() {
    textarea.value = ''
    formTarefa.classList.add('hidden')
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')
    const button = document.createElement('button')
    button.classList.add('botao-circulo')
    button.setAttribute('width', 24)
    button.setAttribute('height', 24)
    button.innerHTML = 
    `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    button.onclick = (event) => {
        event.stopPropagation()
        if(tarefa.completa) {
            li.classList.remove('app__section-task-list-item-complete')
            btn.setAttribute('disabled', false)
            tarefa.completa = false
            atualizarTarefas()
        }
        else{
            tarefaCompleta(li ,btn)
            tarefa.completa = true
            atualizarTarefas()
        }    
    }
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.titulo
    paragrafo.classList.add('app__section-task-list-item-description')
    const btn = document.createElement('button')
    btn.classList.add('app_button-edit')
    btn.onclick = () => {
        editarTarefas(paragrafo, tarefa)
    }
    const imgbtn = document.createElement('img')
    imgbtn.setAttribute('src', './imagens/edit.png')
    btn.append(imgbtn)
    li.append(button)
    li.append(paragrafo)
    li.append(btn)
    if(tarefa.completa){
        tarefaCompleta(li ,btn)
    }
    else {
        li.onclick = () => {
            if(!tarefa.completa) {
                document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                    removeClassActiveTask(elemento)
                })
                if(tarefaSelecionada == tarefa) {
                    tarefaSelecionada = null
                    liTarefaSelecionada = null
                    tarefaEmAndamento.textContent = ''
                }
                else {
                    tarefaSelecionada = tarefa
                    liTarefaSelecionada = li
                    tarefaEmAndamento.textContent = tarefa.titulo
                    li.classList.add('app__section-task-list-item-active')
                }
            }
        }
    }
    return li
}

function tarefaCompleta(add ,dis) {
    add.classList.add('app__section-task-list-item-complete')
    dis.setAttribute('disabled', 'disabled')
}

function removeClassActiveTask(task) {
    task.classList.remove('app__section-task-list-item-active')
}

function editarTarefas(p, t) {
    const novoTitulo = prompt("Qual o nome da tarefa?")
    if (novoTitulo) {
        p.textContent = novoTitulo
        t.titulo = novoTitulo
        atualizarTarefas()
    }
}

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}