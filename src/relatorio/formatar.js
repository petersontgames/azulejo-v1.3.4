/**
 * formatar.js — Funções de formatação numérica para pt-BR
 * AzulejoCalc v1.3.4
 */

/**
 * Formata número em pt-BR.
 * @param {number} n        — número
 * @param {number} decimais — casas decimais (padrão 0)
 */
function fNum(n, decimais = 0) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  });
}

/** Formata valor em Reais. */
function fBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export { fNum, fBRL };
