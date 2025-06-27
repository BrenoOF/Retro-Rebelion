class Jogo {
    constructor() {
        this.tempoTotal = 20;
        this.tempoDecorrido = 0;
        this.inimigosEliminados = 0;
        this.balasDisponiveis = 5;
        this.vidaJogador = 3;
        this.intervalosAtaque = {};
        this.divsNaves = [];
        this.intervaloTemporizador = null;
        this.intervaloBala = null;
    }

    iniciar() {
        this.divsNaves = Array.from(document.querySelectorAll('.encaixar'));
        this.configurarInimigos();
        this.atualizarPenteBala();
        this.iniciarTemporizador();
        this.iniciarRecarregamentoBala();
        this.adicionarEventos();
    }

    configurarInimigos() {
        const inimigos = document.querySelectorAll('.inimigo-1, .inimigo-2, .inimigo-3');
        inimigos.forEach(inimigo => {
            inimigo.addEventListener('click', (event) => this.handleInimigoClick(event));
            if (inimigo.classList.contains('img-inimigos')) {
                this.iniciarAtaqueInimigo(inimigo);
            }
        });
    }

    iniciarTemporizador() {
        const timerInput = document.getElementById('timerInput');
        this.intervaloTemporizador = setInterval(() => {
            const minutos = Math.floor(this.tempoTotal / 60);
            const segundos = this.tempoTotal % 60;
            timerInput.value = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            this.tempoTotal--;
            this.tempoDecorrido++;

            if (this.tempoTotal < 0) {
                this.finalizarJogo();
            }
        }, 2000);
    }

    finalizarJogo() {
        clearInterval(this.intervaloTemporizador);
        clearInterval(this.intervaloBala);
        Object.values(this.intervalosAtaque).forEach(intervalo => clearInterval(intervalo));
        sessionStorage.setItem('tempoDecorrido', this.formatarTempo(this.tempoDecorrido));
        sessionStorage.setItem('pontuacao', this.inimigosEliminados.toString());
        window.location.href = '../../screens/views/gameover.html';
    }

    formatarTempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
    }

    adicionarEventos() {
        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('img-inimigos')) return;
            if (this.balasDisponiveis > 0) {
                this.balasDisponiveis--;
                this.atualizarPenteBala();
            }
        });
    }

    atualizarPenteBala() {
        const balas = document.querySelectorAll('.img-bala');
        balas.forEach((bala, index) => {
            bala.src = index < this.balasDisponiveis ? '../../assets/img/bala-carregada.png' : '../../assets/img/bala-descarregada.png';
        });
    }

    iniciarRecarregamentoBala() {
        this.intervaloBala = setInterval(() => this.recarregarBala(), 3000);
    }

    recarregarBala() {
        if (this.balasDisponiveis < 5) {
            this.balasDisponiveis++;
            this.atualizarPenteBala();
        }
    }

    perderVida() {
        if (this.vidaJogador <= 0) return;

        const coracoes = document.querySelectorAll('.img-coracao');
        coracoes[this.vidaJogador - 1].src = '../../assets/img/barra-tiravida.png';
        this.vidaJogador--;

        if (this.vidaJogador <= 0) {
            this.finalizarJogo();
        }
    }

    iniciarAtaqueInimigo(inimigo) {
        const numeroInimigo = inimigo.className.match(/inimigo-(\d+)/)[1];
        const id = inimigo.getAttribute('data-id') || Math.random().toString(36).substr(2, 9);
        inimigo.setAttribute('data-id', id);

 if (this.intervalosAtaque[id]) {
            clearInterval(this.intervalosAtaque[id]);
        }

        this.intervalosAtaque[id] = setInterval(() => {
            if (!inimigo.classList.contains('suma')) {
                const gifOriginal = `../../assets/img/personagens_e_naves/personagem${numeroInimigo}.gif`;
                const gifAtaque = '../../assets/img/personagens_e_naves/personagem-atira-1.gif';

                inimigo.src = gifAtaque;

                setTimeout(() => {
                    this.perderVida();
                    inimigo.src = gifOriginal;
                }, 1000);
            }
        }, 5000);
    }

    handleInimigoClick(event) {
        if (this.balasDisponiveis <= 0) return;

        this.balasDisponiveis--;
        this.atualizarPenteBala();

        const inimigoClicado = event.target;
        if (!inimigoClicado.classList.contains('img-inimigos')) return;

        const idInimigoClicado = inimigoClicado.getAttribute('data-id');
        if (idInimigoClicado && this.intervalosAtaque[idInimigoClicado]) {
            clearInterval(this.intervalosAtaque[idInimigoClicado]);
        }

        inimigoClicado.style.pointerEvents = 'none';
        const numeroInimigo = inimigoClicado.className.match(/inimigo-(\d+)/)[1];

        const divsDisponiveis = this.divsNaves.filter(div => {
            const inimigoNaDiv = div.querySelector(`.inimigo-${numeroInimigo}`);
            return inimigoNaDiv && inimigoNaDiv !== inimigoClicado;
        });

        if (divsDisponiveis.length === 0) {
            inimigoClicado.style.pointerEvents = 'auto';
            return;
        }

        const novaDiv = divsDisponiveis[Math.floor(Math.random() * divsDisponiveis.length)];
        const inimigoNaNovaDiv = novaDiv.querySelector(`.inimigo-${numeroInimigo}`);

        inimigoClicado.src = '../../assets/img/personagens_e_naves/morte.gif';
        this.incrementarInimigosEliminados();
        this.adicionarTempo();

        requestAnimationFrame(() => {
            inimigoClicado.classList.remove('img-inimigos');
            inimigoClicado.classList.add('suma');

            setTimeout(() => {
                inimigoClicado.src = `../../assets/img/personagens_e_naves/personagem${numeroInimigo}.gif`;
                inimigoNaNovaDiv.classList.remove('suma');
                inimigoNaNovaDiv.classList.add('img-inimigos');
                inimigoClicado.style.pointerEvents = 'auto';
                inimigoNaNovaDiv.style.pointerEvents = 'auto';

                this.iniciarAtaqueInimigo(inimigoNaNovaDiv);
            }, 1000);
        });
    }

    incrementarInimigosEliminados() {
        this.inimigosEliminados += 100;
    }

    adicionarTempo() {
        this.tempoTotal += 10;
        const spanAdd = document.getElementById('add');
        spanAdd.style.display = 'block';
        spanAdd.classList.add('aparecer');
        setTimeout(() => {
            spanAdd.classList.remove('aparecer');
            spanAdd.style.display = 'none';
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const jogo = new Jogo();
    jogo.iniciar();
});