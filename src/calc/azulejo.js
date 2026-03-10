/**
 * azulejo.js — Cálculo de quantidade de peças (azulejo ou piso)
 * AzulejoCalc v1.3.4
 */

/**
 * Área de uma peça em m².
 * @param {number} largCm — largura em centímetros
 * @param {number} altCm  — altura em centímetros
 * @returns {number} área em m²
 */
function calcularAreaAzulejo(largCm, altCm) {
  return (largCm / 100) * (altCm / 100);
}

/**
 * Quantidade mínima sem desperdício.
 * @param {number} area       — área total em m²
 * @param {number} areaAzulejo — área de uma peça em m²
 * @returns {number} unidades (arredondado para cima)
 */
function calcularSemPerda(area, areaAzulejo) {
  return Math.ceil(area / areaAzulejo);
}

/**
 * Aplica percentual de desperdício à quantidade.
 * @param {number} qtd        — quantidade base (sem perda)
 * @param {number} percentual — ex: 10 para 10%
 * @returns {number} unidades com folga (arredondado para cima)
 */
function aplicarPerda(qtd, percentual) {
  return Math.ceil(qtd * (1 + percentual / 100));
}

export { calcularAreaAzulejo, calcularSemPerda, aplicarPerda };
