export const formatDomain = (v?: string): string => {
    if (!v) {
        return '';
    }
    const i = v.indexOf('//');
    const s = i < 0 ? 0 : (i + 2);
    const j = v.indexOf('/', s + 1);
    return j < 0 ? v.substring(s) : v.substring(s, j);
};