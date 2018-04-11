declare var document: Document;

export function setCookie(name, value, maxAge){
  document.cookie = `${name}=${value};max-age=${maxAge}`
}