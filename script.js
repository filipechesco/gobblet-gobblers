var tabuleiro;
var primeiroMovimento;
var proximoJogador;
var jogoAcabou;
var qtdeGrande = 2
var qtdeMedio = 3
var qtdePequeno = 3
var pecasInicial = Array(qtdeGrande).fill(3).concat(Array(qtdeMedio).fill(2), Array(qtdePequeno).fill(1));
var pecasAzul;
var pecasVermelho;

function classesFromValue(value) {
  var classes = '';
  if (value > 0)
    classes = 'azul ';
  if (value < 0)
    classes = 'vermelho ';
  if (Math.abs(value) == 3)
    classes += 'grande'
  if (Math.abs(value) == 2)
    classes += 'medio'
  if (Math.abs(value) == 1)
    classes += 'pequeno'
  return classes;
}

function valueFromClasses(classes) {
  var value;
  if (classes.includes('grande'))
    value = 3;
  if (classes.includes('medio'))
    value = 2;
  if (classes.includes('pequeno'))
    value = 1;
  if (classes.includes('vermelho'))
    return -value;
  return value;
}

function desenharTabuleiro() {
  for(var row=0; row<3; row++) {
    for(var col=0; col<3; col++) {
      var idCelula = "#" + row.toString() + col.toString();
      $(idCelula).empty();
      if (tabuleiro[row][col] != 0) {
        var classes = classesFromValue(tabuleiro[row][col]);
        var peca = $('<div></div>').attr('class', classes);
        $(idCelula).append(peca);
      }
    }
  }
  var pecaSelecionada = $('.selected');
  pecaSelecionada.each(function() {
    $(this).removeClass('selected');
  });
}

function contarQtdePecas(pecas, peca) {
  return pecas.filter(function(elemento) {
    return elemento === peca
  }).length;
}

function desenharPecasDisponiveis() {
  if (proximoJogador == 1) {
    $('#peca-grande').empty()
    if (pecasAzul.includes(3)) {
      var divGrande = $(`<div>${contarQtdePecas(pecasAzul, 3)}</div>`).addClass(classesFromValue(3));
      $('#peca-grande').html(divGrande);
    }
    $('#peca-medio').empty()
    if (pecasAzul.includes(2)) {
      var divMedio = $(`<div>${contarQtdePecas(pecasAzul, 2)}</div>`).addClass(classesFromValue(2));
      $('#peca-medio').html(divMedio);
    }
    $('#peca-pequeno').empty();
    if (pecasAzul.includes(1)) {
      var divPequeno = $(`<div>${contarQtdePecas(pecasAzul, 1)}</div>`).addClass(classesFromValue(1));
      $('#peca-pequeno').html(divPequeno);
    }
  }
  if (proximoJogador == -1) {
    $('#peca-grande').empty()
    if (pecasVermelho.includes(-3)) {
      var divGrande = $(`<div>${contarQtdePecas(pecasVermelho, -3)}</div>`).addClass(classesFromValue(-3));
      $('#peca-grande').append(divGrande);
    }
    $('#peca-medio').empty()
    if (pecasVermelho.includes(-2)) {
      var divMedio = $(`<div>${contarQtdePecas(pecasVermelho, -2)}</div>`).addClass(classesFromValue(-2));
      $('#peca-medio').append(divMedio);
    }
    $('#peca-pequeno').empty();
    if (pecasVermelho.includes(-1)) {
      var divPequeno = $(`<div>${contarQtdePecas(pecasVermelho, -1)}</div>`).addClass(classesFromValue(-1));
      $('#peca-pequeno').append(divPequeno);
    }
  }
}

function checaVitoria() {
  for (var i=0; i<3; i++) {
    if (tabuleiro[i][0] > 0 && tabuleiro[i][1] > 0 && tabuleiro[i][2] > 0)
      return 1;
    if (tabuleiro[i][0] < 0 && tabuleiro[i][1] < 0 && tabuleiro[i][2] < 0)
      return -1;
    if (tabuleiro[0][i] > 0 && tabuleiro[1][i] > 0 && tabuleiro[2][i] > 0)
      return 1;
    if (tabuleiro[0][i] < 0 && tabuleiro[1][i] < 0 && tabuleiro[2][i] < 0)
      return -1;
  }
  if (tabuleiro[0][0] > 0 && tabuleiro[1][1] > 0 && tabuleiro[2][2] > 0)
    return 1;
  if (tabuleiro[0][0] < 0 && tabuleiro[1][1] < 0 && tabuleiro[2][2] < 0)
    return -1;
  if (tabuleiro[0][2] > 0 && tabuleiro[1][1] > 0 && tabuleiro[2][0] > 0)
    return 1;
  if (tabuleiro[0][2] < 0 && tabuleiro[1][1] < 0 && tabuleiro[2][0] < 0)
    return -1;
  return 0;
}

function reloadView() {
  desenharTabuleiro();
  var vitoria = checaVitoria();
  if (vitoria != 0) {
    $('#mensagem').html(`Jogador ${vitoria == 1 ? "azul" : "vermelho"} venceu!`);
    $('#reiniciar').show();
    jogoAcabou = true;
  }
  else {
    desenharPecasDisponiveis();
  }
}

function reiniciarJogo() {
  tabuleiro = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  primeiroMovimento = true;
  proximoJogador = 1;
  pecasAzul = pecasInicial.slice();
  pecasVermelho = pecasInicial.map(function(valor){return -valor;});
  jogoAcabou = false;
  $('#mensagem').empty();
  $('#move-list').empty();
  reloadView();
}

function selecionarPeca(peca) {
  var selecionados = $('.selected');
  selecionados.each(function () {
    $(this).removeClass('selected');
  });
  var pecaSelecionada = $(peca).children();
  if (pecaSelecionada.length == 1)
    pecaSelecionada.addClass('selected');
}

function checaJogadaValida(row, col, peca) {
  // não se pode começar com uma peça no meio do tabuleiro
  if (primeiroMovimento && row == 1 && col == 1 && peca == 3)
    return false;
  var val = tabuleiro[row][col];
  // não se pode cobrir uma peça da mesma cor
  if ((val < 0 && peca < 0) || (val > 0 && peca > 0))
    return false;
  // não se pode cobrir uma peça de tamanho menor ou igual
  if (Math.abs(peca) <= Math.abs(val))
    return false;
  // jogador não tem mais peças deste tamanho
  if ((peca < 0 && !pecasVermelho.includes(peca)) || (peca > 0 && !pecasAzul.includes(peca)))
    return false
  // jogador está tentando jogar peças do oponente
  if ((peca < 0 && proximoJogador > 0) || (peca > 0 && proximoJogador < 0))
    return false;
  return true;
}

function salvarMovimento(row, col, peca) {
  var cor, tamanho;
  switch (Math.abs(peca)) {
    case 1: tamanho = 'PEQ'; break;
    case 2: tamanho = 'MED'; break;
    case 3: tamanho = 'GDE'; break;
  }
  cor = (peca < 0) ? 'red' : 'blue';
  var corSpan = $('<span></span>').css('color', cor).html(`<strong>${tamanho}</strong>`);
  var movimento = $('<li></li>').append(corSpan).append(` => ${row+1}x${col+1}`);
  $('#move-list').append(movimento);
}

function removerPeca(peca) {
  if (peca > 0)
    pecasAzul.splice(pecasAzul.indexOf(peca), 1);
  if (peca < 0)
    pecasVermelho.splice(pecasVermelho.indexOf(peca), 1);
}

function efetuarJogada(row, col, peca) {
  tabuleiro[row][col] = peca;
  primeiroMovimento = false;
  proximoJogador *= -1;
  removerPeca(peca);
  salvarMovimento(row, col, peca);
}

function posicionar(posicao) {
  if (jogoAcabou) {
    alert('O jogo acabou!');
    return;
  }
  var pecaSelecionada = $('.selected');
  if (pecaSelecionada.length == 0) {
    alert('Você deve selecionar uma peça para jogar!');
    return;
  }
  if (pecaSelecionada.length > 1) {
    alert('Mais de uma peça selecionada!');
    return;
  }
  var pecaJogada = valueFromClasses(pecaSelecionada.attr('class'));
  var posicaoId = $(posicao).attr('id');
  var row = parseInt(posicaoId.substring(0, 1));
  var col = parseInt(posicaoId.substring(1));
  var movimentoValido = checaJogadaValida(row, col, pecaJogada);

  if (!movimentoValido) {
    alert('Jogada inválida!')
    return;
  }

  efetuarJogada(row, col, pecaJogada);
    
  reloadView();
}

$('document').ready(function() {
  reiniciarJogo();
});
