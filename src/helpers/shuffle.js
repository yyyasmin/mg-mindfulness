export const shuffle = (array) => {
    const shuffledArray = [...array]; // Create a copy of the original array to avoid modifying it directly

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Swap elements at i and randomIndex
        [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }

    for (let i=0; i < shuffledArray.length;  i++) {
        shuffledArray[i].id = i
    }

    return shuffledArray;
};
