/**
 * area.js — Cálculo de área do(s) ambiente(s)
 * AzulejoCalc v1.3.4
 */

/**
 * Área simples de um ambiente.
 * @param {number} comp — comprimento em metros
 * @param {number} larg — largura em metros
 * @returns {number} área em m²
 */
function calcularArea(comp, larg) {
  return comp * larg;
}

/**
 * Área total somando vários ambientes.
 * @param {Object} medidas — Objeto com { comp1, larg1, comp2, larg2, ... }
 * @param {number} count — Quantos ambientes considerar
 * @returns {{ area, perAmb: number[] }}
 */
function calcularAreaTotal(medidas, count) {
  const perAmb = [];
  let area = 0;
  for (let i = 1; i <= count; i++) {
    const a = calcularArea(medidas[`comp${i}`] || 0, medidas[`larg${i}`] || 0);
    perAmb.push(a);
    area += a;
  }
  return { area, perAmb };
}

export { calcularArea, calcularAreaTotal };
