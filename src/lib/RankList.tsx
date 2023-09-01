const getRank = (lastTenWPMAvg: number) => {
    if (lastTenWPMAvg === -1) {
        return "UNRANKED";
    }
    if (lastTenWPMAvg < 10) {
        return "BRONZE 1";
    }
    if (lastTenWPMAvg < 16) {
        return "BROZNE 2";
    }
    if (lastTenWPMAvg < 22) {
        return "BRONZE 3";
    }
    if (lastTenWPMAvg < 28) {
        return "SILVER 1";
    }
    if (lastTenWPMAvg < 34) {
        return "SILVER 2";
    }
    if (lastTenWPMAvg < 40) {
        return "SILVER 3";
    }
    if (lastTenWPMAvg < 46) {
        return "GOLD 1";
    }
    if (lastTenWPMAvg < 52) {
        return "GOLD 2";
    }
    if (lastTenWPMAvg < 58) {
        return "GOLD 3";
    }
    if (lastTenWPMAvg < 64) {
        return "PLATINUM 1";
    }
    if (lastTenWPMAvg < 70) {
        return "PLATINUM 2";
    }
    if (lastTenWPMAvg < 76) {
        return "PLATINUM 3";
    }
    if (lastTenWPMAvg < 82) {
        return "DIAMOND 1";
    }
    if (lastTenWPMAvg < 88) {
        return "DIAMOND 2";
    }
    if (lastTenWPMAvg < 94) {
        return "DIAMOND 3";
    }
    if (lastTenWPMAvg < 100) {
        return "MASTER 1";
    }
    if (lastTenWPMAvg < 106) {
        return "MASTER 2";
    }
    if (lastTenWPMAvg < 112) {
        return "Master 3";
    }
    if (lastTenWPMAvg < 118) {
        return "GRAND MASTER 1";
    }
    if (lastTenWPMAvg < 124) {
        return "GRAND MASTER 2";
    }
    if (lastTenWPMAvg < 130) {
        return "GRAND MASTER 3";
    }
    if (lastTenWPMAvg >= 130) {
        return "LEGEND";
    }
};

const getUrl = (lastTenWPMAvg: number) => {
    if (lastTenWPMAvg === -1) {
        return "/images/ranks/unranked.png";
    }
    if (lastTenWPMAvg < 10) {
        return "/images/ranks/bronze-1.png";
    }
    if (lastTenWPMAvg < 16) {
        return "/images/ranks/bronze-2.png";
    }
    if (lastTenWPMAvg < 22) {
        return "/images/ranks/bronze-3.png";
    }
    if (lastTenWPMAvg < 28) {
        return "/images/ranks/silver-1.png";
    }
    if (lastTenWPMAvg < 34) {
        return "/images/ranks/silver-2.png";
    }
    if (lastTenWPMAvg < 40) {
        return "/images/ranks/silver-3.png";
    }
    if (lastTenWPMAvg < 46) {
        return "/images/ranks/gold-1.png";
    }
    if (lastTenWPMAvg < 52) {
        return "/images/ranks/gold-2.png";
    }
    if (lastTenWPMAvg < 58) {
        return "/images/ranks/gold-3.png";
    }
    if (lastTenWPMAvg < 64) {
        return "/images/ranks/platinum-1.png";
    }
    if (lastTenWPMAvg < 70) {
        return "/images/ranks/platinum-2.png";
    }
    if (lastTenWPMAvg < 76) {
        return "/images/ranks/platinum-3.png";
    }
    if (lastTenWPMAvg < 82) {
        return "/images/ranks/diamond-1.png";
    }
    if (lastTenWPMAvg < 88) {
        return "/images/ranks/diamond-2.png";
    }
    if (lastTenWPMAvg < 94) {
        return "/images/ranks/diamond-3.png";
    }
    if (lastTenWPMAvg < 100) {
        return "/images/ranks/master-1.png";
    }
    if (lastTenWPMAvg < 106) {
        return "/images/ranks/master-2.png";
    }
    if (lastTenWPMAvg < 112) {
        return "/images/ranks/master-3.png";
    }
    if (lastTenWPMAvg < 118) {
        return "/images/ranks/grandmaster-1.png";
    }
    if (lastTenWPMAvg < 124) {
        return "/images/ranks/grandmaster-2.png";
    }
    if (lastTenWPMAvg < 130) {
        return "/images/ranks/grandmaster-3.png";
    }
    if (lastTenWPMAvg >= 130) {
        return "/images/ranks/legend.png";
    }
};

export { getRank, getUrl };
