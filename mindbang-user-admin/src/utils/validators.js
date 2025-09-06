// utils/validators.js
export const validateUser = ({ username, email, roles }) => {
  const errors = [];
  if (!username) errors.push('Username requerido');
  if (!email.includes('@')) errors.push('Email inválido');
  if (!roles) errors.push('Rol requerido');
  return errors;
};

export const isValidURL = (url) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocolo
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // dominio
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // puerto y path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}
