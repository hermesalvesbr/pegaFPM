import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();

// Acessar o site do Tesouro Nacional
await page.goto(
  "https://www.tesourotransparente.gov.br/ckan/dataset/transferencias-constituci onais-para-municipios"
);

// Obter a lista de arquivos CSV
const links = await page.evaluate(() => {
  return document.querySelectorAll(".dataset-file a");
});

// Baixar cada arquivo CSV
for (const link of links) {
  const filename = link.getAttribute("href").split("/").pop();
  const file = await page.waitForFileDownload(filename);
  console.log(`Download de ${filename} concluído.`);
}

// Fechar o navegador
await browser.close();
