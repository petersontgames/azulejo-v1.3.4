/**
 * calcularMaoDeObra.js — Cálculo de mão de obra
 * AzulejoCalc v1.3.4
 */

/**
 * Calcula custo de mão de obra (R$/m² + valor fixo).
 *
 * @param {number} area   — área total em m²
 * @param {number} taxaM2 — valor por m² em R$ (0 = não aplicar)
 * @param {number} [fixo] — valor fixo adicional em R$ (0 = não aplicar)
 * @param {string} [obs]  — observação livre (ex: "inclui rejunte")
 * @returns {{
 *   valorM2:  number,
 *   fixo:     number,
 *   total:    number,
 *   obs:      string,
 *   temCusto: boolean
 * }}
 */
function calcularMaoDeObra(area, taxaM2, fixo = 0, obs = '') {
  const valorM2 = taxaM2 > 0 ? +(area * taxaM2).toFixed(2) : 0;
  const total = +(valorM2 + fixo).toFixed(2);
  const temCusto = taxaM2 > 0 || fixo > 0;
  return { valorM2, fixo, total, obs, temCusto };
}

export { calcularMaoDeObra };
