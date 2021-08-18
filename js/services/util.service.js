export const utilService = {
  makeId,
};

function makeId(length = 5) {
  let txt = '';
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    txt += char.charAt(Math.floor(Math.random() * char.length));
  }

  return txt;
}
