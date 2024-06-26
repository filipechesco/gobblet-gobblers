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

function desenharTabuleiro(tab) {
  for(var row=0; row<3; row++) {
    for(var col=0; col<3; col++) {
      var idCelula = "#" + row.toString() + col.toString();
      $(idCelula).empty();
      if (tab[row][col] != 0) {
        var classes = classesFromValue(tab[row][col]);
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

function avaliarTabuleiro(tab) {
  for (var i=0; i<3; i++) {
    if (tab[i][0] > 0 && tab[i][1] > 0 && tab[i][2] > 0)
      return 1;
    if (tab[i][0] < 0 && tab[i][1] < 0 && tab[i][2] < 0)
      return -1;
    if (tab[0][i] > 0 && tab[1][i] > 0 && tab[2][i] > 0)
      return 1;
    if (tab[0][i] < 0 && tab[1][i] < 0 && tab[2][i] < 0)
      return -1;
  }
  if (tab[0][0] > 0 && tab[1][1] > 0 && tab[2][2] > 0)
    return 1;
  if (tab[0][0] < 0 && tab[1][1] < 0 && tab[2][2] < 0)
    return -1;
  if (tab[0][2] > 0 && tab[1][1] > 0 && tab[2][0] > 0)
    return 1;
  if (tab[0][2] < 0 && tab[1][1] < 0 && tab[2][0] < 0)
    return -1;
  return 0;
}

function reloadView() {
  desenharTabuleiro(tabuleiro);
  var vitoria = avaliarTabuleiro(tabuleiro);
  if (vitoria != 0) {
    $('#mensagem').html(`Jogador ${vitoria == 1 ? "azul" : "vermelho"} venceu!`);
    $('#reiniciar').show();
    jogoAcabou = true;
  }
  else {
    desenharPecasDisponiveis();
    mostrarBotaoIa();
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

function verificaTabuleiroEmBranco(tab) {
  return tab.some(row => row.some(elemento => elemento != 0)) == false;
}

function checaJogadaValida(tab, row, col, peca) {
  var tabuleiroEmBranco = verificaTabuleiroEmBranco(tab);
  // não se pode jogar a peça grande no meio na primeira jogada
  if (tabuleiroEmBranco && row == 1 && col == 1 && peca == 3)
    return false;
  var val = tab[row][col];
  // não se pode cobrir uma peça da mesma cor
  if ((val < 0 && peca < 0) || (val > 0 && peca > 0))
    return false;
  // não se pode cobrir uma peça de tamanho menor ou igual
  if (Math.abs(peca) <= Math.abs(val))
    return false;
  // jogador não tem mais peças deste tamanho
  if ((peca < 0 && !pecasVermelho.includes(peca)) || (peca > 0 && !pecasAzul.includes(peca)))
    return false
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
  var movimentoValido = checaJogadaValida(tabuleiro, row, col, pecaJogada);

  if (!movimentoValido) {
    alert('Jogada inválida!')
    return;
  }

  efetuarJogada(row, col, pecaJogada);
    
  reloadView();
}

function copiarTabuleiro(tab) {
  return tab.map(function(row) {
    return row.slice();
  });
}

$('document').ready(function() {
  reiniciarJogo();
});

/* funções relacionadas ao minimax do jogo */

function listarJogadasValidas(tab, todasPecas) {
  var pecas = todasPecas.slice();
  pecas = pecas.filter(function(elemento) {
    return Math.abs(elemento) != 1;
  });
  pecas = pecas.filter(function(elemento, indice, self) {
    return self.indexOf(elemento) === indice;
  });
  pecas.sort(function(a,b) {
    return Math.abs(a) - Math.abs(b);
  });
  var jogadasValidas = []
  pecas.forEach(peca => {
    for (var row=0; row<3; row++) {
      for (var col=0; col<3; col++) {
        if (checaJogadaValida(tab, row, col, peca))
          jogadasValidas.push([row, col, peca]);
      }
    }
  });
  return jogadasValidas;
}

function minimax(tab, jogador, pecasA, pecasV) {
  var best, vencedor, pecas;

  // valores salvos: row, col, peca, movesToEnd, eval
  if (jogador == 1) {
    best = [-1, -1, 0, 100, -99999];
    pecas = pecasA.slice();
  }
  else {
    best = [-1, -1, 0, 100, +99999];
    pecas = pecasV.slice();
  }

  var movimentos = listarJogadasValidas(tab, pecas);
  
  if (avaliarTabuleiro(tab) != 0 || movimentos.length == 0)
    return [-1, -1, 0, 0, avaliarTabuleiro(tab)];

  if (movimentos.length > 0) {
    movimentos.forEach(movimento => {
      var row = movimento[0];
      var col = movimento[1];
      var peca = movimento[2];
      var tabResultante = copiarTabuleiro(tab);
      tabResultante[row][col] = peca;
      var novasPecas = pecas.slice();
      if (novasPecas.indexOf(peca) >= 0)
        novasPecas.splice(novasPecas.indexOf(peca), 1);
      else
        throw new Error(`Elemento não encontrado no vetor: ${peca} em ${novasPecas}`);

      if (jogador == 1)
        vencedor = minimax(tabResultante, -jogador, novasPecas, pecasV);
      else
        vencedor = minimax(tabResultante, -jogador, pecasA, novasPecas);
      
      if (jogador == 1) {
        // se o resultado é melhor para o jogador (derrota -> empate/vitória, empate -> vitória)
        // se o jogador está ganhando e existe uma maneira mais rápida de ganhar
        // se o jogador está perdendo e existe uma maneira mais lenta de perder
        if (
            (vencedor[4] > best[4])
            || (best[4] == jogador && vencedor[4] == best[4] && vencedor[3] < best[3])
            || (best[4] == -jogador && vencedor[4] == best[4] && vencedor[3] > best[3])
          ) {
          best[0] = row;
          best[1] = col;
          best[2] = peca;
          best[3] = vencedor[3] + 1;
          best[4] = vencedor[4];
        }
      }
      else {
        if (
            (vencedor[4] < best[4])
            || (best[4] == jogador && vencedor[4] == best[4] && vencedor[3] < best[3])
            || (best[4] == -jogador && vencedor[4] == best[4] && vencedor[3] > best[3])
          ) {
          best[0] = row;
          best[1] = col;
          best[2] = peca;
          best[3] = vencedor[3] + 1;
          best[4] = vencedor[4];
        }
      }
    });
  }

  return best;
}

function gerarTextoSugestaoIa(sugestao) {
  var row = sugestao[0];
  var col = sugestao[1];
  var peca = sugestao[2];
  var movesToEnd = sugestao[3];
  var vantagem = sugestao[4];

  switch (Math.abs(peca)) {
    case 1: peca = '\"Pequena\"'; break;
    case 2: peca = '\"Média\"'; break;
    case 3: peca = '\"Grande\"'; break;
    default: peca = '?';
  }

  switch (vantagem) {
    case -1: vantagem = 'vermelho'; break;
    case 0: vantagem = 'neutro'; break;
    case 1: vantagem = 'azul'; break;
    default: vantagem = '?'
  }

  return `Peça ${peca}, linha ${row+1}, coluna ${col+1}<br />Vantagem: ${vantagem} (${movesToEnd} movimentos para o fim)`;
}

function mostrarSugestaoIa(sugestao) {
  $('#botao-ia').hide();
  var textoSugestao = gerarTextoSugestaoIa(sugestao);
  $('#texto-ia').html(textoSugestao).show();
}

function mostrarBotaoIa() {
  $('#botao-ia').hide();
  if (!primeiroMovimento)
    $('#botao-ia').prop('disabled', false).show();
  $('#texto-ia').hide();
}

function calcularMelhorMovimento() {
  $('#botao-ia').prop('disabled', true);

  // var tabCopia, best, row, col, peca, movesToEnd, vantagem;

  var tabCopia = copiarTabuleiro(tabuleiro);

  var best = minimax(tabCopia, proximoJogador, pecasAzul, pecasVermelho);

  // row = best[0];
  // col = best[1];
  // peca = best[2];
  // movesToEnd = best[3];
  // vantagem = best[4];

  // console.log(`Peça ${peca} - linha ${row} - coluna ${col} (vantagem: ${vantagem} - vitória em ${movesToEnd})`)

  mostrarSugestaoIa(best);
}