/**
 * lerInputs.js — Leitura centralizada dos campos do DOM
 * AzulejoCalc v1.3.4
 *
 * Todas as leituras de getElementById + parseFloat/parseInt
 * ficam aqui, evitando repetição em cada módulo de recálculo.
 */

import { estado } from './estado.js';

/**
 * Lê as medidas do ambiente (1, 2, 3 e 4).
 * @returns {{ comp1, larg1, comp2, larg2, comp3, larg3, comp4, larg4 }}
 */
function lerMedidas() {
  return {
    comp1: parseFloat(document.getElementById('comp').value) || 0,
    larg1: parseFloat(document.getElementById('larg').value) || 0,
    comp2: parseFloat(document.getElementById('comp2').value) || 0,
    larg2: parseFloat(document.getElementById('larg2').value) || 0,
    comp3: parseFloat(document.getElementById('comp3').value) || 0,
    larg3: parseFloat(document.getElementById('larg3').value) || 0,
    comp4: parseFloat(document.getElementById('comp4').value) || 0,
    larg4: parseFloat(document.getElementById('larg4').value) || 0,
  };
}

/**
 * Lê o percentual de perda do slider.
 * @returns {number}
 */
function lerPerda() {
  return parseFloat(document.getElementById('perda').value) || 0;
}

/**
 * Lê o preço por caixa.
 * @returns {number} 0 se vazio
 */
function lerPreco() {
  const raw = document.getElementById('preco').value.trim();
  return raw !== '' ? parseFloat(raw) : 0;
}

/**
 * Lê o m²/cx manual (campo cxM2).
 * @returns {number} 0 se vazio (= automático)
 */
function lerCxM2() {
  return parseFloat(document.getElementById('cxM2').value) || 0;
}

/**
 * Lê os campos de argamassa.
 * @returns {{ precoSaco, qtdManual }}
 */
function lerArgamassa() {
  return {
    precoSaco: parseFloat(document.getElementById('precoArgamassa').value) || 0,
    qtdManual: parseInt(document.getElementById('argQtdManual').value) || 0,
  };
}

/**
 * Lê os campos de mão de obra.
 * @returns {{ taxaM2, fixo, obs }}
 */
function lerMaoDeObra() {
  return {
    taxaM2: parseFloat(document.getElementById('maoM2').value) || 0,
    fixo: parseFloat(document.getElementById('maoFixo').value) || 0,
    obs: document.getElementById('maoObs').value.trim(),
  };
}

export { lerMedidas, lerPerda, lerPreco, lerCxM2, lerArgamassa, lerMaoDeObra };
