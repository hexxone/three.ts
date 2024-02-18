export class ObjectHelper {


    /**
     * Deep copy function for TypeScript.
     * @see Source project, ts-deeply https://github.com/ykdr2017/ts-deepcopy
     * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
     * @param {T} source source value to be copied.
     * @returns {T} new source Type
     */
    public static deepCopy<T>(source: T): T {
        if (source === null) {
            return source;
        }
        if (source instanceof Date) {
            return new Date(source.getTime()) as any;
        }
        // First part is for array and second part is for Realm.Collection
        // if (target instanceof Array || typeof (target as any).type === 'string') {
        if (typeof source === 'object') {
            if (typeof source[Symbol.iterator] === 'function') {
                const cp = [] as any[];

                if ((source as any as any[]).length > 0) {
                    for (const arrayMember of source as any as any[]) {
                        cp.push(ObjectHelper.deepCopy(arrayMember));
                    }
                }

                return cp as any as T;
            }
            const targetKeys = Object.keys(source);
            const cp = {};

            if (targetKeys.length > 0) {
                for (const key of targetKeys) {
                    cp[key] = ObjectHelper.deepCopy(source[key]);
                }
            }

            return cp as T;
        }

        // Means that object is atomic
        return source;
    }

}
