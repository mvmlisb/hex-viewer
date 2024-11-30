type Array<V, A> = {
    forEach(
        callbackfn: (value: V, index: number, array: A) => void,
        thisArg?: any
    ): void;
};

export function map<V, A, R>(
    array: Array<V, A>,
    map: (value: V, index: number) => R
): R[] {
    const result: R[] = [];
    array.forEach((byte, index) => result.push(map(byte, index)));
    return result;
}
