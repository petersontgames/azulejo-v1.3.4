/**
 * calcularCaixas.js — Estimativa de caixas necessárias
 * AzulejoCalc v1.3.4
 *
 * Estimativas de m²/cx por tamanho (mercado BR):
 *   ≤ 20 cm → 1,00 m²/cx
 *   ≤ 30 cm → 1,44 m²/cx
 *   ≤ 45 cm → 2,00 m²/cx
 *   > 45 cm → 2,88 m²/cx
 */

/**
 * Estima m² por caixa com base no tamanho da peça.
 * @param {number} larguraCm — largura do azulejo em cm
 * @returns {number}
 */
function estimarM2PorCaixa(larguraCm) {
  if (larguraCm <= 20) return 1.00;
  if (larguraCm <= 30) return 1.44;
  if (larguraCm <= 45) return 2.00;
  return 2.88;
}

/**
 * Calcula número de caixas.
 * @param {number} qtd         — unidades com perda
 * @param {number} areaAzulejo — m² por peça
 * @param {number} larguraCm   — largura da peça (para cálculo auto)
 * @param {number} [cxM2]      — m²/cx manual informado (0 = automático)
 * @returns {{ caixas: number, box: number, modo: 'auto'|'manual' }}
 */
function calcularCaixas(qtd, areaAzulejo, larguraCm, cxM2 = 0) {
  const modo = cxM2 > 0 ? 'manual' : 'auto';
  const box = cxM2 > 0 ? cxM2 : estimarM2PorCaixa(larguraCm);
  const caixas = Math.ceil((qtd * areaAzulejo) / box);
  return { caixas, box, modo };
}

/**
 * Custo total dos azulejos.
 * @param {number} caixas        — número de caixas
 * @param {number} precoPorCaixa — R$ por caixa (0 = omitir)
 * @returns {number|null} null se preço não informado
 */
function calcularCustoAzulejo(caixas, precoPorCaixa) {
  if (!precoPorCaixa || precoPorCaixa <= 0) return null;
  return +(caixas * precoPorCaixa).toFixed(2);
}

export { estimarM2PorCaixa, calcularCaixas, calcularCustoAzulejo };
