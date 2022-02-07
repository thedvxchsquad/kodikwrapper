export const ArrayAsObject = (example: {
  [x: string | symbol | number]: number;
}) => {
  return function (enterArray: any[]) {
    const obj: any = {};
    for (const [key, value] of Object.entries(example)) {
      obj[key] = enterArray[value];
    }
    return obj;
  };
};
