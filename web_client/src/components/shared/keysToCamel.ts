const toCamel = (string: string) => string.replace(/([-_][a-z])/gi, ($1) => $1
  .toUpperCase()
  .replace('-', '')
  .replace('_', ''));

const isObject = (args: any) => args === Object(args) && !Array.isArray(args) && typeof args !== 'function';

export const keysToCamel = function (o: any): Object {
  if (isObject(o)) {
    const n: any = {};

    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  } else if (Array.isArray(o)) {
    return o.map((i: any) => {
      return keysToCamel(i);
    });
  }

  return o;
};