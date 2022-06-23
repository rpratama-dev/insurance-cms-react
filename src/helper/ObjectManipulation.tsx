export type ReplaceType<Type, ToType> = Type extends object
  ? ReplaceTypes<Type, ToType>
  : Type extends number
  ? ToType
  : Type extends boolean
  ? ToType
  : Type extends null
  ? ToType
  : Type;

export type ReplaceTypes<ObjType extends object, ToType> = {
  [KeyType in keyof ObjType]: ReplaceType<ObjType[KeyType], ToType>;
};

class ObjectManipulation {
  static replaceNestedValues<T extends object>(obj: T, nextVal: string): ReplaceTypes<T, string> {
    // ** Method ini digunakan untuk mengganti semua nilai nested object menjadi string kosong
    // ** Saat ini digunakan untuk handle error validator
    const result = Object.keys(obj).reduce((a, k) => {
      const acc = a as any;
      const key = k as keyof T;
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        acc[key] = this.replaceNestedValues(value as any, nextVal);
      } else if (!value || value) {
        acc[key] = nextVal;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {}) as ReplaceTypes<T, string>;

    return result;
  }

  static setObjectByString<T extends object>(obj: T, keyString: string, newVal: string): T {
    // ** Method ini digunakan untuk mengganti value nested object
    // ** Saat ini digunakan untuk handle error validator
    keyString = keyString.replace(/\[(\w+)\]/g, '.$1'); // ubah indexs ke properties
    keyString = keyString.replace(/^\./, ''); // strip a leading dot
    const pathArray = keyString.split('.');
    const lastNode = pathArray[pathArray.length - 1];
    let node = obj as any;
    pathArray.forEach((path, index) => {
      node = index === pathArray.length - 1 ? node : !node[path] ? (node[path] = {}) : node[path];
    });
    node[lastNode] = newVal;
    return obj;
  }
}

export default ObjectManipulation;
