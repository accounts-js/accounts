declare var document: Document;

export function getCookie(cname) {
  const name = cname + "=";
  const cookies = document.cookie.split(';');
  for(let cookie of cookies) {
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
      }
  }
  return undefined;
}