const fs = require('fs');

async function setImports(data) {
  const imports = data.reduce((accumulator, game) => {
    game.gameCards.forEach((card) => {
      const importLine = `const ${card.name} = await require("${card.fileFullPath}");\n`;
      accumulator.push(importLine);
    });
    return accumulator;
  }, []);

  const importArr = data.flatMap((game) =>
    game.gameCards.map((card) => card.name)
  );

  const importCode = `${imports.join('')}

const importArr = [${importArr.join(', ')}];
export default importArr;`;

  ////console.log("IN setImports -- jsCode: ", importCode);
  fs.writeFileSync('../src/helpers/importCardFullPath.js', importCode);
}

// Read JSON data from the file
const jsonDataPath = './Cards.json';
const jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf-8'));

setImports(jsonData);
