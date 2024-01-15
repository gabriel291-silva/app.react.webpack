/**
 * Cria a mascara de CEP para input
 * @param {HTMLInputElement} input
 */
export function mask_cep(input) {
  let value = input.currentTarget.value;
  let result = value.replace(/\D/g, "");

  result = result.replace(/^(\d{5})(\d{1})/, "$1-$2");

  input.currentTarget.value = result;
}
