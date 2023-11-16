import axios from 'axios'
import cheerio from 'cheerio'

async function getTitleFromPage(url: string): Promise<string> {
  try {
    // Faz a requisição HTTP
    const response = await axios.get(url)

    // Carrega o HTML da página usando Cheerio
    const $ = cheerio.load(response.data)

    // Extrai o título da página
    const pageTitle = $('title').text()

    return pageTitle
  } catch (error) {
    console.error('Erro ao obter o título da página:', error.message)
    throw error
  }
}
async function scrapePage(url: string): Promise<void> {
  try {
    // Faz a requisição HTTP
    const response = await axios.get(url)

    // Carrega o HTML da página usando Cheerio
    const $ = cheerio.load(response.data)

    // Encontra todos os itens de recurso na lista
    $('.resource-item').each((index, element) => {
      const $element = $(element)

      // Extrai informações do item de recurso
      const fileName = $element.find('.heading').text().trim()
      const fileSizeMatch = /\(([\d.,]+)\s+(\w+)[iI][bB]\)/.exec(
        $element.find('.heading').html(),
      )
      const fileSize = fileSizeMatch ? fileSizeMatch[1] : 'N/A'
      const fileSizeUnit = fileSizeMatch ? fileSizeMatch[2] : 'N/A'
      const fileLink = $element.find('.resource-url-analytics').attr('href')

      // Imprime as informações
      console.log('Nome do Arquivo:', fileName)
      console.log('Tamanho do Arquivo:', fileSize, fileSizeUnit)
      console.log('Link para Download:', fileLink)
      console.log('---')
    })
  } catch (error) {
    console.error('Erro ao fazer scraping da página:', error.message)
  }
}

// URL da página
const url =
  'https://www.tesourotransparente.gov.br/ckan/dataset/transferencias-constitucionais-para-municipios'

scrapePage(url)

getTitleFromPage(url)
  .then((title) => {
    console.log('Título da página:', title)
  })
  .catch((error) => {
    console.error('Erro geral:', error.message)
  })
