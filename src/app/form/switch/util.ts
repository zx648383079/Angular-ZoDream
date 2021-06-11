export const isTrue = (val: any) => {
    if (typeof val === 'boolean') {
        return val;
    }
    return val > 0;
};