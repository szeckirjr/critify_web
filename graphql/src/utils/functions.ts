const translate = {
  à: 'a',
  á: 'a',
  â: 'a',
  ä: 'a',
  å: 'a',
  ã: 'a',
  æ: 'a',
  ç: 'c',
  è: 'e',
  é: 'e',
  ê: 'e',
  ë: 'e',
  ì: 'i',
  í: 'i',
  î: 'i',
  ï: 'i',
  ð: 'd',
  ñ: 'n',
  ò: 'o',
  ó: 'o',
  ô: 'o',
  õ: 'o',
  ö: 'o',
  ü: 'u',
  ù: 'u',
  ú: 'u',
  û: 'u',
  ý: 'y',
  ÿ: 'y',
  À: 'A',
  Á: 'A',
  Â: 'A',
  Ä: 'A',
  Å: 'A',
  Ç: 'C',
  È: 'E',
  É: 'E',
  Ê: 'E',
  Ë: 'E',
  Ì: 'I',
  Í: 'I',
  Î: 'I',
  Ï: 'I',
  Ð: 'D',
  Ñ: 'N',
  Ò: 'O',
  Ó: 'O',
  Ô: 'O',
  Õ: 'O',
  Ö: 'O',
  Ü: 'U',
  Ù: 'U',
  Ú: 'U',
  Û: 'U',
  Ý: 'Y',
  Ÿ: 'Y',
};

export function getCleanName(name: string): string {
  if (!name) return '';
  const accents = /[àáâäåãæçèéêëìíîïðñòóôõöüùúûýÿÀÁÂÄÅÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖÜÙÚÛÝŸ]/g;
  return name
    .toString()
    .toLowerCase()
    .replace(accents, (match) => translate[match as keyof typeof translate])
    .replace(/[.+]/g, '')
    .replace(/[^a-zA-Z_0-9+]/g, '-')
    .replace(/--+/g, '-');
}

// export function checkSameArtistName(
//   artistName1: string,
//   artistName2: string,
// ): boolean {
//   return getCleanArtistName(artistName1) === getCleanArtistName(artistName2)
// }

export const numDaysBetween = (d1: Date, d2: Date) => {
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return diff / (1000 * 60 * 60 * 24);
};