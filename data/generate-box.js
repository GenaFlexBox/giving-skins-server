import caseModel from "../model/caseModel.js";

export default async function generateCase(caseItems) {

    const winPrizeIndex = 0;
    let filledLootBox = [];
    let filledLootBoxItem = [];
    const prizeIndex = caseItems.length * 4 + winPrizeIndex;
    const generateId =  () => Date.now().toString(36) + Math.random().toString(36).substring(2);

    const  generateItemBox = () => {
        caseItems.forEach((item) => {
            const prizes = new Array(item.chance).fill(item);
            filledLootBox.push(...prizes);
        });
        const pickedItem = filledLootBox[Math.floor(Math.random() * filledLootBox.length)];
        return pickedItem;
    };

    for (var a = 0; a < 100; a++) {
        filledLootBoxItem.push(generateItemBox());
    }

    const prizeBox = filledLootBoxItem.map((prize) => ({
        rare: prize.rare,
        image: prize.image,
        name: prize.name,
        id: generateId(),
    }));

    const prize =filledLootBoxItem.find((item, index) => index === 72);

    return {
        prize,
        prizeBox
    };
} 