export const StringUtils = {
  center(str: string, width: number, fillChar: string = " ") {
    const lengthToAdd = width - str.length;

    if (lengthToAdd <= 0) return str;

    const lengthStart = str.length + Math.floor(lengthToAdd / 2);

    return str.padStart(lengthStart, fillChar).padEnd(width, fillChar);
  },
};
