export const formatNumber = (num) => {
    if (num >= 1000000) return `${Math.floor(num / 1000000)}Tr`;
    if (num >= 1000) return `${Math.floor(num / 1000)}N`;
    return num;
};
