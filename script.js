// Variaveis
const body = document.body
const html = document.querySelector('html')
const btnFoco = document.querySelector('.app__card-button--foco')
const btnCurto = document.querySelector('.app__card-button--curto')
const btnLongo = document.querySelector('.app__card-button--longo')
const btnPersonalizado = document.querySelector('.app__card-button--personalizado')
const btnTempoEdit = document.querySelector('.btn_edit-timer')
const btnFecharTempo = document.querySelector('.fechar-timer')
const btnDefinirTempo = document.querySelector('.definir-timer')
const inputTempo = document.querySelector('.input-timer')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const btns = document.querySelectorAll('.app__card-button')
const toggleMusica = document.querySelector('#alternar-musica')
const btnIniciarPausar = document.querySelector('#start-pause')
const imgBtnIniciarPausar = document.querySelector('.app__card-primary-butto-icon')
const txtBtnIniciarPausar = document.querySelector('#start-pause span')
const tempoNaTela = document.querySelector('#timer')
const personalizadoDiv = document.querySelector('.list-personalizado')
const modalTimer = document.querySelector(".modal-timer")
let intervalo = null
let tempoDecorridoEmSegundos = 10

const audioZerouTemp = new Audio('./sons/beep.mp3')
const audioIniciouTemp = new Audio('./sons/play.wav')
const audioPausouTemp = new Audio('./sons/pause.mp3')
const musica = new Audio('./sons/luna-rise-part-one.mp3')
musica.loop = true
mostrarTempo()

inputTempo.addEventListener('input', () => {
    inputTempo.value = inputTempo.value.replace(/[^0-9:]/g, '');

    if (inputTempo.value.length >= 2 && inputTempo.value.indexOf(':') === -1) {
        inputTempo.value = inputTempo.value.slice(0, 2) + ':' + inputTempo.value.slice(2);
    }

    if (inputTempo.value.slice(-1) === ':' && inputTempo.value.slice(-2, -1) === ':') {
        inputTempo.value = inputTempo.value.slice(0, -1);
    }
})

btnDefinirTempo.addEventListener('click', () => {
    const tempoDividido = inputTempo.value.split(':')
    console.log(tempoDividido[1])
    // if(tempoDividido[1] = undefined)
    if(inputTempo.value = null) {
        alert("Limite de tempo atingido")
        segundos = 3599
    }
    segundos = parseInt(tempoDividido[0]) * 60 + parseInt(tempoDividido[1])
    if(segundos >= 3600) {
        alert("Limite de tempo atingido")
        segundos = 3599
    }
    
    tempoDecorridoEmSegundos = segundos
    mostrarTempo()
    fecharModalTempo()
})

btnFecharTempo.addEventListener('click', () => {
    fecharModalTempo()
})
 
function fecharModalTempo () {
    modalTimer.style.display = "none";
    body.classList.remove("modal-open");
}

btnTempoEdit.addEventListener('click', (event) => {
    event.stopPropagation()
    modalTimer.style.display = "block";
    body.classList.add("modal-open");
})

// Tempo
function mostrarTempo() {
    const tempoTotal = new Date(tempoDecorridoEmSegundos * 1000)
    const tempo = tempoTotal.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempo}`
}

// Contagem
btnIniciarPausar.addEventListener('click', iniciarPausar)

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        audioZerouTemp.play()
        alert('Acabou o tempo!')
        if (html.getAttribute('data-contexto') == 'foco') {
            document.dispatchEvent(new CustomEvent('FocoFinalizado'))
        }
        zerar()
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

function zerar() {
    clearInterval(intervalo)
    imgBtnIniciarPausar.setAttribute('src', './imagens/play_arrow.png')
    txtBtnIniciarPausar.textContent = "Começar"
    intervalo = null
}

function iniciarPausar() {
    if (intervalo) {
        audioPausouTemp.play()
        zerar()
        return 
    }
    audioIniciouTemp.play()
    imgBtnIniciarPausar.setAttribute('src', './imagens/pause.png')
    txtBtnIniciarPausar.textContent = "Pausar"
    intervalo = setInterval(contagemRegressiva, 1000)
}

// Musica
toggleMusica.addEventListener('change', () => {
    if(toggleMusica.checked) {
        musica.play()
    }
    else {
        musica.pause()
    }
})

// Contexto
btnPersonalizado.addEventListener('click', (event) => {
    event.stopPropagation()
    tempoDecorridoEmSegundos = 1500
    alterarContexto('personalizado')
    personalizadoDiv.classList.add('active')
    btnPersonalizado.classList.add('active')
})

btnFoco.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500
    alterarContexto('foco')
    btnFoco.classList.add('active')
})

btnCurto.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300
    alterarContexto('descanso-curto')
    btnCurto.classList.add('active')
})

btnLongo.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    alterarContexto('descanso-longo')
    btnLongo.classList.add('active')
});

function alterarContexto(contexto) {
    mostrarTempo()
    btns.forEach(function (btn) {
        btn.classList.remove('active')
        personalizadoDiv.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    let img = contexto == 'personalizado' ? 'foco' : contexto 
    banner.setAttribute('src', `./imagens/${img}.png`)
    switch(contexto) {
        case "foco": 
            titulo.innerHTML = 'Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>'
            break
        case "descanso-curto":
            titulo.innerHTML = 'Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>'
            break
        case "descanso-longo":
            titulo.innerHTML = 'Hora de voltar à superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>'
            break
        case "personalizado":
            titulo.innerHTML = 'Escreva sua história.<br><strong class="app__title-strong">Escolha o seu tempo.</strong>'
    }
}