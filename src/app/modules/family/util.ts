
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const formatYear = (year: number) => {
    return [TIAN_GAN[(year - 3) % 10], DI_ZHI[(year - 3) % 12]];
};