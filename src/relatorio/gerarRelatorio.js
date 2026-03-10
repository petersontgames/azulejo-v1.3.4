/**
 * gerarRelatorio.js — Geração do relatório em texto para o terminal
 * AzulejoCalc v1.3.4
 */

import { fNum, fBRL } from './formatar.js';

/**
 * Gera o relatório completo como string de texto.
 *
 * @param {object} params
 * @param {string} params.modo          — 'azulejo' | 'piso'
 * @param {number} params.comp
 * @param {number} params.larg
 * @param {number} params.comp2
 * @param {number} params.larg2
 * @param {number} params.tileW
 * @param {number} params.tileH
 * @param {number} params.perda
 * @param {number} params.preco
 * @param {number} params.area
 * @param {number} params.azul          — área por peça (m²)
 * @param {number} params.semPerda
 * @param {number} params.comPerda
 * @param {number} params.caixas
 * @param {number} params.box           — m²/cx usado
 * @param {number|null} params.custo
 * @param {object} params.argamassa
 * @param {object} params.maoDeObra
 * @returns {string}
 */
function gerarRelatorio(params) {
  const {
    modo, tileW, tileH, perda, preco,
    area, azul, semPerda, comPerda,
    caixas, box, boxModo, custo,
    argamassa, maoDeObra, perAmb,
  } = params;

  const sep1 = '═'.repeat(46);
  const sep2 = '─'.repeat(46);
  const icon = modo === 'piso' ? '🪵' : '🏠';
  const label = modo === 'piso' ? 'PISO/CALC v1.3.4' : 'AZULEJO/CALC v1.3.4';

  let s = '';
  s += sep1 + '\n';
  s += `  ${icon}  ${label}\n`;
  s += sep1 + '\n\n';

  for (let i = 1; i <= 4; i++) {
    const c = params[`comp${i}`];
    const l = params[`larg${i}`];
    if (c > 0 && l > 0) {
      const a = perAmb[i - 1];
      s += `  Ambiente ${i}: ${c.toFixed(2)}m × ${l.toFixed(2)}m  → ${fNum(a, 2)} m²\n`;
    }
  }

  s += '\n';
  s += `  Peça    : ${tileW} cm × ${tileH} cm\n`;
  s += `  Tamanho m²: ${fNum(azul, 4)} m²\n`;
  s += `  Perda   : ${perda}%\n\n`;
  s += sep2 + '\n\n';
  s += `  Área TOTAL combinada    : ${fNum(area, 2)} m²\n\n`;
  s += sep2 + '\n\n';
  s += `  Total Peças (sem perda) : ${fNum(semPerda)} unidades\n`;
  s += `  Total Peças (com perda) : ${fNum(comPerda)} unidades\n\n`;
  s += `  Metragem por Caixa      : ${fNum(box, 2)} m²/cx (${boxModo})\n`;
  s += `  TOTAL DE CAIXAS         : ${caixas} caixas\n\n`;

  s += sep2 + '\n\n';
  s += `  Preço por caixa         : ${fBRL(preco || 0)}\n`;
  s += `  INVESTIMENTO REVEST.    : ${fBRL(custo || 0)}\n\n`;

  if (argamassa) {
    s += sep2 + '\n';
    s += '  ARGAMASSA\n\n';
    s += `  Consumo estimado        : ${argamassa.consumoKgM2} kg/m²\n`;
    s += `  Consumo total           : ${fNum(argamassa.totalKg, 1)} kg\n`;
    s += `  Metragem do Saco        : ${argamassa.pesoSaco} kg\n`;
    s += `  QUANTIDADE DE SACOS     : ${argamassa.sacos} sacos\n`;
    if (argamassa.modoSacos === 'manual') {
      s += `  (Ajuste manual · Sugerido: ${argamassa.sacosAuto})\n`;
    }
    s += `  INVESTIMENTO ARGAMASSA  : ${fBRL(argamassa.custo || 0)}\n\n`;
  }

  if (maoDeObra) {
    s += sep2 + '\n';
    s += '  MÃO DE OBRA\n\n';
    s += `  Taxa por m²             : ${fBRL(maoDeObra.taxaM2 || 0)}/m²\n`;
    s += `  Subtotal m²             : ${fBRL(maoDeObra.valorM2 || 0)}\n`;
    s += `  Taxa fixa adicional     : ${fBRL(maoDeObra.fixo || 0)}\n`;
    s += `  INVESTIMENTO MÃO OBRA   : ${fBRL(maoDeObra.total || 0)}\n`;
    if (maoDeObra.obs) s += `  Obs: ${maoDeObra.obs}\n`;
    s += '\n';
  }

  const custoTotal = (custo || 0) + (argamassa?.custo || 0) + (maoDeObra?.total || 0);
  s += sep1 + '\n';
  s += `  💰 INVESTIMENTO TOTAL    : ${fBRL(custoTotal)}\n`;
  s += sep1 + '\n\n';
  s += '  ✅ Arredondamentos sempre para CIMA (segurança)\n';

  return s;
}

export { gerarRelatorio };
