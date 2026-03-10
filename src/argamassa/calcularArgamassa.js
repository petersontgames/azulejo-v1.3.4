/**
 * calcularArgamassa.js — Cálculo de argamassa colante
 * AzulejoCalc v1.3.4
 *
 * Consumos por tipo (NBR 14081):
 *   AC-I   → 4,5 kg/m²  (ambientes internos secos)
 *   AC-II  → 5,5 kg/m²  (uso geral — pisos e paredes)
 *   AC-III → 7,0 kg/m²  (externos, piscinas, fachadas)
 */

/**
 * Calcula quantidade de argamassa.
 *
 * @param {number} area          — área total em m²
 * @param {number} consumoKgM2   — consumo em kg/m² conforme tipo AC
 * @param {number} pesoSacoKg    — peso do saco (20, 25 ou 50 kg)
 * @param {number} precoPorSaco  — R$ por saco (0 = omitir custo)
 * @param {number} [qtdManual]   — sacos informados manualmente (0 = automático)
 * @returns {{
 *   totalKg:   number,
 *   sacosAuto: number,
 *   sacos:     number,
 *   modoSacos: 'auto'|'manual',
 *   custo:     number|null
 * }}
 */
function calcularArgamassa(area, consumoKgM2, pesoSacoKg, precoPorSaco, qtdManual = 0) {
  const totalKg = +(area * consumoKgM2).toFixed(1);
  const sacosAuto = Math.ceil(totalKg / pesoSacoKg);
  const modoSacos = qtdManual > 0 ? 'manual' : 'auto';
  const sacos = qtdManual > 0 ? qtdManual : sacosAuto;
  const custo = precoPorSaco > 0 ? +(sacos * precoPorSaco).toFixed(2) : null;
  return { totalKg, sacosAuto, sacos, modoSacos, custo };
}

export { calcularArgamassa };
