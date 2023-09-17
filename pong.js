// Variáveis gerais
let gameWidth;
let gameHeight;

// Variáveis de modo de jogo
let singleplayerGame = false; // Variável para rastrear se o jogo está no modo singleplayer
let multiplayerGame = false; // Variável para rastrear se o jogo está no modo multiplayer

// Variáveis de tamanho da bola
let bolaEixoX = 600;
let bolaEixoY = 300;
let diametroBola = 10;
let raioBola = diametroBola / 2;

// Variáveis de velocidade da Bola
let velocidadeEixoX = 5;
let velocidadeEixoY = 5;

// Variáveis do tamanho da raquete do lado esquerdo
let raqueteEixoXLeft = 5;
let raqueteEixoYLeft = 200;

// Variáveis do tamanho da raquete do lado direito
let raqueteEixoXRight = 1185;
let raqueteEixoYRight = 200;

// Dimensões das raquetes
let raqueteLargura = 10;
let raqueteAltura = 100;

// Velocidade da raquete da direita
let velocidadeRaqueteRight;

// Colisão Raquete
let collideBolaRaquete = false;

// Pontos do placar
let pontosLeft = 0;
let pontosRight = 0;

// Sons do Jogo
let pontoSom;
let raqueteTouchSom;

// Variáveis específicas do modo multiplayer
let chanceDeErrar = 0;
let bugDelta = 5;

function preload() {
  pontoSom = loadSound("soundtrack/ponto.mp3");
  raqueteTouchSom = loadSound("soundtrack/raquete_touch.mp3");
}

function setup() {
  // Cria uma área de renderização inicial de 1200x600 no centro da tela
  createGameCanvas();
  bolaEixoX = gameWidth / 2;
  bolaEixoY = gameHeight / 2;
  raqueteEixoYLeft = gameHeight / 2 - raqueteAltura / 2;
  raqueteEixoXRight = gameWidth - raqueteLargura - 5;
  raqueteEixoYRight = gameHeight / 2 - raqueteAltura / 2;
  window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
  });

  // Atualiza as dimensões do canvas quando a janela é redimensionada
  window.addEventListener("resize", function () {
    createGameCanvas();
  });
}

function createGameCanvas() {
  gameWidth = Math.min(1200, windowWidth); // Limita o tamanho máximo a 1200 pixels
  gameHeight = Math.min(600, windowHeight); // Limita o tamanho máximo a 600 pixels

  const canvas = createCanvas(gameWidth, gameHeight);
  const x = (windowWidth - gameWidth) / 2;
  const y = (windowHeight - gameHeight) / 2;
  canvas.position(x, y);
}

// Funções sendo aplicadas
function draw() {
  background(0);
  if (singleplayerGame) {
    singleplayerMostrarBola();
    singleplayerEixoBola();
    singleplayerColisaoBola();
    singleplayerRaqueteMovimentoLeft();
    singleplayerRaqueteMovimentoRight();
    // Raquete esquerda
    singleplayerRaqueteShape(raqueteEixoXLeft, raqueteEixoYLeft);
    // Raquete direita;
    singleplayerRaqueteShape(raqueteEixoXRight, raqueteEixoYRight);
    // Biblioteca do p5
    singleplayerLibraryCollide2d(raqueteEixoXLeft, raqueteEixoYLeft);
    singleplayerLibraryCollide2d(raqueteEixoXRight, raqueteEixoYRight);
    calculaChanceDeErrar();
    // Placar do jogo
    singleplayerPlacarPong();
    singleplayerMarcarPontos();
  } else if (multiplayerGame) {
    multiplayerMostrarBola();
    multiplayerEixoBola();
    multiplayerColisaoBola();
    multiplayerRaqueteMovimentoLeft();
    multiplayerRaqueteMovimentoRight();
    // Raquete esquerda
    multiplayerRaqueteShape(raqueteEixoXLeft, raqueteEixoYLeft);
    // Raquete direita;
    multiplayerRaqueteShape(raqueteEixoXRight, raqueteEixoYRight);
    // Biblioteca do p5
    multiplayerLibraryCollide2d(raqueteEixoXLeft, raqueteEixoYLeft);
    multiplayerLibraryCollide2d(raqueteEixoXRight, raqueteEixoYRight);
    // Placar do jogo
    multiplayerPlacarPong();
    multiplayerMarcarPontos();
  }
}

// Função para configurar o modo singleplayer
function setupSingleplayer() {
  singleplayerGame = true; // Definir a variável para indicar que estamos no modo singleplayer
  multiplayerGame = false; // Certificar-se de que o modo multiplayer está desligado
  document.querySelector('canvas').style.display = 'block'; // Mostrar o canvas
  setup(); // Chamar a função setup() do p5.js para iniciar o jogo
}

// Função para configurar o modo multiplayer
function setupMultiplayer() {
  multiplayerGame = true; // Definir a variável para indicar que estamos no modo multiplayer
  singleplayerGame = false; // Certificar-se de que o modo singleplayer está desligado
  document.querySelector('canvas').style.display = 'block'; // Mostrar o canvas
  setup(); // Chamar a função setup() do p5.js para iniciar o jogo
}


///////////////// SINGLEPLAYER /////////////////

// Função de mostrar a Bola
function singleplayerMostrarBola() {
  circle(bolaEixoX, bolaEixoY, diametroBola);
}

// Função velocidade padrão e direção da Bola
function singleplayerEixoBola() {
  bolaEixoX += velocidadeEixoX;
  bolaEixoY += velocidadeEixoY;
}

// Função reconhecimento da borda da tela
function singleplayerColisaoBola() {
  if (bolaEixoX + raioBola > width || bolaEixoX - raioBola < 0) {
    velocidadeEixoX *= -1; // Inverte para a direção oposta quando encosta nos limites da largura da borda (Esquerda e Direita)
  }

  if (bolaEixoY + raioBola > height || bolaEixoY - raioBola < 0) {
    velocidadeEixoY *= -1; // inverte para a direção oposta quanto encosta nos limites da altura da borda (Cima e Baixo)
  }
}

// Função do tamanho da raquete
function singleplayerRaqueteShape(x, y) {
  rect(x, y, raqueteLargura, raqueteAltura);
}

// Função de movimentação da raquete do lado esquerdo no modo singleplayer
function singleplayerRaqueteMovimentoLeft() {
  if (keyIsDown(87)) {
    raqueteEixoYLeft -= 5; // 5 unidades para cima
  }

  if (keyIsDown(83)) {
    raqueteEixoYLeft += 5; // 5 unidades para baixo
  }
  // Limite da raquete do lado esquerdo
  raqueteEixoYLeft = constrain(raqueteEixoYLeft, 0, height - raqueteAltura);
}

// Função de movimentação da raquete do lado direito no modo singleplayer
function singleplayerRaqueteMovimentoRight() {
  velocidadeRaqueteRight =
    bolaEixoY - raqueteEixoYRight - raqueteAltura / 2 - 50;
    raqueteEixoYRight += velocidadeRaqueteRight + chanceDeErrar;
    calculaChanceDeErrar();

  // Limite da raquete do lado esquerdo
  raqueteEixoYRight = constrain(raqueteEixoYRight, 0, 500);
}

// Função de colisão entre a bola e a raquete - Biblioteca
function singleplayerLibraryCollide2d(x, y) {
  collideBolaRaquete = collideRectCircle(
    x,
    y,
    raqueteLargura,
    raqueteAltura,
    bolaEixoX,
    bolaEixoY,
    raioBola
  );
  if (collideBolaRaquete) {
    velocidadeEixoX *= -1;
    chanceDeErrar += bugDelta;
    raqueteTouchSom.play();
  }
}

// Função para calcular a chance de errar no modo singleplayer
function calculaChanceDeErrar() {
  if (pontosLeft >= pontosRight) {
    // Quando você estiver em desvantagem (pontosDoOponente é maior ou igual a meusPontos)
    if (chanceDeErrar >= 95) {
      chanceDeErrar = 95; // Limite superior para 5% de chance de acertar (95% de chance de errar)
    }
    if (chanceDeErrar <= 5) {
      chanceDeErrar = 5; // Limite inferior para 95% de chance de acertar (5% de chance de errar)
    }
  } else {
    // Quando o jogador esquerdo estiver na vantagem (mais pontos que o jogador direito)
    if (chanceDeErrar >= 20) {
      chanceDeErrar = 20; // Limite superior para 80% de chance de acertar (20% de chance de errar)
    }
    if (chanceDeErrar <= 80) {
      chanceDeErrar = 80; // Limite inferior para 20% de chance de acertar (80% de chance de errar)
    }
  }
}

// Função de mostrar o placar do jogo no modo singleplayer
function singleplayerPlacarPong() {
  const scoreBoxWidth = 50;
  const scoreBoxHeight = 30;
  const padding = 0;

  const centerX = width / 2;
  const centerY = scoreBoxHeight + padding * 2; // Aumente este valor para descer mais os retângulos

  textAlign(CENTER, CENTER);
  textFont("bold");
  textSize(16);
  fill("gray");

  // Placar do jogador esquerdo
  fill("gray");
  rect(centerX - scoreBoxWidth - padding, centerY - scoreBoxHeight / 2, scoreBoxWidth, scoreBoxHeight, 5, 0, 0, 5);
  fill(255); // Cor do texto em branco
  text(pontosLeft, centerX - scoreBoxWidth / 2 - padding, centerY); // Centraliza o texto no rect

  // Placar do jogador direito
  fill("gray");
  rect(centerX + padding, centerY - scoreBoxHeight / 2, scoreBoxWidth, scoreBoxHeight, 0, 5, 5, 0);
  fill(255); // Cor do texto em branco
  text(pontosRight, centerX + padding + scoreBoxWidth / 2, centerY); // Centraliza o texto no rect
}

// Função de marcar os pontos quando encosta na borda da tela no modo singleplayer
function singleplayerMarcarPontos() {
  const limiteEsquerdo = bolaEixoX - raioBola < 0; // Limite esquerdo da tela
  const limiteDireito = bolaEixoX + raioBola > width; // Limite direito da tela

  if (limiteDireito) {
    pontosLeft += 1;
    pontoSom.play();
    bugDelta *= 1;

  } 
  if (limiteEsquerdo) {
    pontosRight += 1;
    pontoSom.play();
    chanceDeErrar = 0;
  }
}

///////////////// MULTIPLAYER /////////////////

// Função de mostrar a Bola
function multiplayerMostrarBola() {
  circle(bolaEixoX, bolaEixoY, diametroBola);
}

// Função velocidade padrão e direção da Bola
function multiplayerEixoBola() {
  bolaEixoX += velocidadeEixoX;
  bolaEixoY += velocidadeEixoY;
}

// Função reconhecimento da borda da tela
function multiplayerColisaoBola() {
  if (bolaEixoX + raioBola > width || bolaEixoX - raioBola < 0) {
    velocidadeEixoX *= -1; // Inverte para a direção oposta quando encosta nos limites da largura da borda (Esquerda e Direita)
  }

  if (bolaEixoY + raioBola > height || bolaEixoY - raioBola < 0) {
    velocidadeEixoY *= -1; // inverte para a direção oposta quanto encosta nos limites da altura da borda (Cima e Baixo)
  }
}

// Função do tamanho da raquete
function multiplayerRaqueteShape(x, y) {
  rect(x, y, raqueteLargura, raqueteAltura);
}

// Função de movimentação da raquete do lado esquerdo no modo multiplayer
function multiplayerRaqueteMovimentoLeft() {
  if (keyIsDown(87)) {
    raqueteEixoYLeft -= 5; // 5 unidades para cima
  }

  if (keyIsDown(83)) {
    raqueteEixoYLeft += 5; // 5 unidades para baixo
  }
  // Limite da raquete do lado esquerdo
  raqueteEixoYLeft = constrain(raqueteEixoYLeft, 0, height - raqueteAltura);
}

// Função de movimentação da raquete do lado direito no modo multiplayer
function multiplayerRaqueteMovimentoRight() {
  if (keyIsDown(UP_ARROW)) {
    raqueteEixoYRight -= 5; // 5 unidades para cima
  }

  if (keyIsDown(DOWN_ARROW)) {
    raqueteEixoYRight += 5; // 5 unidades para baixo
  }
  // Limite da raquete do lado esquerdo
  raqueteEixoYRight = constrain(raqueteEixoYRight, 0, height - raqueteAltura);
}

// Função de colisão entre a bola e a raquete - Biblioteca
function multiplayerLibraryCollide2d(x, y) {
  collideBolaRaquete = collideRectCircle(
    x,
    y,
    raqueteLargura,
    raqueteAltura,
    bolaEixoX,
    bolaEixoY,
    raioBola
  );
  if (collideBolaRaquete) {
    velocidadeEixoX *= -1;
    chanceDeErrar += bugDelta;
    raqueteTouchSom.play();
  }
}
// Função de mostrar o placar do jogo no modo multiplayer
function multiplayerPlacarPong() {
  const scoreBoxWidth = 50;
  const scoreBoxHeight = 30;
  const padding = 0;

  const centerX = width / 2;
  const centerY = scoreBoxHeight + padding * 2; // Aumente este valor para descer mais os retângulos

  textAlign(CENTER, CENTER);
  textFont("bold");
  textSize(16);
  fill("gray");

  // Placar do jogador esquerdo
  fill("gray");
  rect(centerX - scoreBoxWidth - padding, centerY - scoreBoxHeight / 2, scoreBoxWidth, scoreBoxHeight, 5, 0, 0, 5);
  fill(255); // Cor do texto em branco
  text(pontosLeft, centerX - scoreBoxWidth / 2 - padding, centerY); // Centraliza o texto no rect

  // Placar do jogador direito
  fill("gray");
  rect(centerX + padding, centerY - scoreBoxHeight / 2, scoreBoxWidth, scoreBoxHeight, 0, 5, 5, 0);
  fill(255); // Cor do texto em branco
  text(pontosRight, centerX + padding + scoreBoxWidth / 2, centerY); // Centraliza o texto no rect
}

// Função de marcar os pontos quando encosta na borda da tela no modo multiplayer
function multiplayerMarcarPontos() {
  const limiteEsquerdo = bolaEixoX - raioBola < 0; // Limite esquerdo da tela
  const limiteDireito = bolaEixoX + raioBola > width; // Limite direito da tela

  if (limiteDireito) {
    pontosLeft += 1;
    pontoSom.play();
    bugDelta *= 1;

  } 
  if (limiteEsquerdo) {
    pontosRight += 1;
    pontoSom.play();
    chanceDeErrar = 0;
  }
}
