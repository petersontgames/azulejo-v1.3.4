/**
 * defaults.js — Valores padrão e constantes globais
 * AzulejoCalc v1.3.4
 */

const TAMANHOS_PADRAO = [
  { largura: 20, altura: 20, label: '20×20', cxM2Auto: 1.00 },
  { largura: 30, altura: 30, label: '30×30', cxM2Auto: 1.44 },
  { largura: 40, altura: 40, label: '40×40', cxM2Auto: 2.00 },
  { largura: 45, altura: 45, label: '45×45', cxM2Auto: 2.00 },
  { largura: 60, altura: 60, label: '60×60', cxM2Auto: 2.88 },
  { largura: 80, altura: 80, label: '80×80', cxM2Auto: 2.88 },
  { largura: 60, altura: 120, label: '60×120', cxM2Auto: 2.88 },
  { largura: 90, altura: 90, label: '90×90', cxM2Auto: 2.88 },
];

const TIPOS_ARGAMASSA = [
  { sigla: 'AC-I', consumoKgM2: 4.5, desc: 'Interna · ambientes secos' },
  { sigla: 'AC-II', consumoKgM2: 5.5, desc: 'Uso geral · pisos e paredes' },
  { sigla: 'AC-III', consumoKgM2: 7.0, desc: 'Externa · piscinas · fachadas' },
];

const PESOS_SACO_KG = [20, 25, 50];

const CONFIG_PADRAO = {
  modo: 'azulejo',
  comp: 0,
  larg: 0,
  comp2: 0,
  larg2: 0,
  comp3: 0,
  larg3: 0,
  comp4: 0,
  larg4: 0,
  azulejoLargura: 20,
  azulejoAltura: 20,
  percentualPerda: 0,
  precoPorCaixa: 0,
  cxM2: 0,
  argConsumoKgM2: 4.5,
  argPesoSaco: 20,
  argPrecoPorSaco: 0,
  argQtdManual: 0,
  maoTaxaM2: 0,
  maoFixo: 0,
  maoObs: '',
};

export { TAMANHOS_PADRAO, TIPOS_ARGAMASSA, PESOS_SACO_KG, CONFIG_PADRAO };
