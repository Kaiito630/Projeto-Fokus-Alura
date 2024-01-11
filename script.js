// Variaveis
const html = document.querySelector('html')
const btnFoco = document.querySelector('.app__card-button--foco')
const btnCurto = document.querySelector('.app__card-button--curto')
const btnLongo = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const btns = document.querySelectorAll('.app__card-button')
const toggleMusica = document.querySelector('#alternar-musica')
const btnIniciarPausar = document.querySelector('#start-pause')
const imgBtnIniciarPausar = document.querySelector('.app__card-primary-butto-icon')
const txtBtnIniciarPausar = document.querySelector('#start-pause span')
const tempoNaTela = document.querySelector('#timer')

let intervalo = null
let tempoDecorridoEmSegundos = 10

const audioZerouTemp = new Audio('./sons/beep.mp3')
const audioIniciouTemp = new Audio('./sons/play.wav')
const audioPausouTemp = new Audio('./sons/pause.mp3')
const musica = new Audio('./sons/luna-rise-part-one.mp3')
musica.loop = true
mostrarTempo()

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
        alert('Acabou o tempoooo!')
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
btnFoco.addEventListener('click', () => {
    // tempoDecorridoEmSegundos = 1500
    alterarContexto('foco')
    btnFoco.classList.add('active')
})

btnCurto.addEventListener('click', () => {
    // tempoDecorridoEmSegundos = 300
    alterarContexto('descanso-curto')
    btnCurto.classList.add('active')
})

btnLongo.addEventListener('click', () => {
    // tempoDecorridoEmSegundos = 900
    alterarContexto('descanso-longo')
    btnLongo.classList.add('active')
});

function alterarContexto(contexto) {
    mostrarTempo()
    btns.forEach(function (btn) {
        btn.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `./imagens/${contexto}.png`)
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
    }
}