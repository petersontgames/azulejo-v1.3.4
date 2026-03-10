/**
 * estado.js — Estado global da aplicação (UI)
 * AzulejoCalc v1.3.4
 *
 * Centraliza todas as variáveis de estado que a UI precisa
 * para coordenar recálculos entre os módulos.
 */

const estado = {
  // Modo do app
  modo: 'azulejo',          // 'azulejo' | 'piso'

  // Tamanho da peça atual
  tileW: 20,
  tileH: 20,

  // Ambientes ativos (1 é sempre ativo, o resto é opcional)
  ambientesCount: 1,       // 1 a 4

  // Argamassa
  argConsumoKgM2: 4.5,     // AC-I padrão
  argSacoKg: 20,      // saco de 20 kg padrão
};

export { estado };
