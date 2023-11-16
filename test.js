function transformToBPlusPlus(inputString) {
    // Удаляем пробелы из исходной строки
    const stringWithoutSpaces = inputString.replace(/\s/g, '');

    // Рассчитываем количество символов в каждой строке
    const charactersPerLine = 3;

    // Рассчитываем количество строк, округляя вверх
    const lines = Math.ceil(stringWithoutSpaces.length / charactersPerLine);

    // Заполняем новую строку символами 'B++'
    let transformedString = '';
    for (let i = 0; i < lines; i++) {
        for (let j = 0; j < charactersPerLine; j++) {
            const index = i * charactersPerLine + j;
            transformedString += index < stringWithoutSpaces.length ? stringWithoutSpaces[index] : ' ';
        }
        transformedString += 'B++\n';
    }

    return transformedString;
}

// Пример использования
const inputString = "This is a long string with spaces";
const result = transformToBPlusPlus(inputString);
console.log(result);
