export function parseEnum<T>(val: any, type: any): T {
    if (typeof val == 'string') {
        return type[val];
    }
    return val;
}