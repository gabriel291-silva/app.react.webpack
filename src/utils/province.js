const states = [
  { AC: "Acre" },
  { AL: "Alagoas" },
  { AP: "Amapá" },
  { AM: "Amazonas" },
  { BA: "Bahia" },
  { CE: "Ceará" },
  { DF: "Distrito Federal" },
  { ES: "Espírito Santo" },
  { GO: "Goías" },
  { MA: "Maranhão" },
  { MT: "Mato Grosso" },
  { MS: "Mato Grosso do Sul" },
  { MG: "Minas Gerais" },
  { PA: "Pará" },
  { PB: "Paraíba" },
  { PR: "Paraná" },
  { PE: "Pernambuco" },
  { PI: "Piauí" },
  { RJ: "Rio de Janeiro" },
  { RN: "Rio Grande do Norte" },
  { RS: "Rio Grande do Sul" },
  { RO: "Rondônia" },
  { RR: "Roraíma" },
  { SC: "Santa Catarina" },
  { SP: "São Paulo" },
  { SE: "Sergipe" },
  { TO: "Tocantins" },
];

/**
 * Pega o nome completo do estado/provicia
 * @param {String} state
 * @returns String
 */
export const getProvince = (state) => {
  const [provinces] = states.filter((object) => {
    const [key] = Object.keys(object);

    if (key === state) {
      return true;
    }

    return false;
  });

  const [province] = Object.values(provinces);

  return province;
};
