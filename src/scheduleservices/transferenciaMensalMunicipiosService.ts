import TransferenciasConstitucionaisMunicipiosPage from '../pageObject/transferenciaMensalMunicipio/transferenciasConstitucionaisMunicipiosPage'
import CsvService from '../services/csvService'
import DirectusTransferenciaMensalMunicipiosService from '../services/directusTransferenciaMensalMunicipiosService'
import DirectusTransferenciaService from '../services/directusTransferenciaService'
import DownloadService from '../services/downloadService'
import MapperService from '../services/mapperService'
import puppeteer from 'puppeteer'

export default class TransferenciaMensalMunicipiosService {
  public async startProcess(year: string, month: string): Promise<void> {
    const downloadService = new DownloadService()
    const csvService = new CsvService()
    const mapService = new MapperService()
    const directusTransferenciaMensalMunicipiosService =
      new DirectusTransferenciaMensalMunicipiosService()
    const directusTransferenciaService = new DirectusTransferenciaService()
    const fileNamePrefix = 'Transferencia_Mensal_Municipios_@'
    const yearMonth = `${year}${month}`
    const fileName = fileNamePrefix.replace('@', `${yearMonth}`)

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const transferenciasConstitucionaisMunicipiosPage =
      new TransferenciasConstitucionaisMunicipiosPage(page)
    await transferenciasConstitucionaisMunicipiosPage.openPage()

    console.log(`Obtendo tamanho atual do arquivo: ${fileName}`)
    const currentFileSize =
      await transferenciasConstitucionaisMunicipiosPage.getFileSizeByYearMonth(
        fileName
      )
    console.log(`Tamanho obtido: ${currentFileSize}`)

    console.log(`Comparando o tamanho do arquivo atual com o anterior...`)
    if (
      !(await directusTransferenciaService.theFileSizeHasChanged(
        fileName,
        currentFileSize
      ))
    )
      throw new Error('Não houve alteração no arquivo.')

    console.log(`Comparação realizado com sucesso.`)

    console.log(`Obtendo o link de download para o arquivo: ${fileName}...`)
    const downloadLink =
      await transferenciasConstitucionaisMunicipiosPage.GetLinkTransferenciasMensalMunicipioFileByYearAndMonth(
        yearMonth
      )
    await browser.close()
    console.log(`Link obtido com sucesso.`)

    console.log(`Realizado o download...`)
    const buffer = await downloadService.DownloadFile(downloadLink)
    console.log(`Download realizado com sucesso.`)

    console.log(`Preparando o dados para envio...`)
    const arrayFromFileData = await csvService.materializeFromBuffer(
      buffer,
      'iso-8859-1'
    )

    arrayFromFileData.shift()
    const objectList =
      mapService.MapTranferenciaMensalMunicipioCsvFileToInteface(
        arrayFromFileData
      )
    console.log(`Dados preparados.`)

    console.log(`Deletando os dados anteriores...`)
    await directusTransferenciaMensalMunicipiosService.DeleteAllItemsByYearMonth(
      year,
      month
    )
    console.log(`Dados anteriores deletados com sucesso.`)

    console.log(`Iniciando o upload dos dados...`)
    await directusTransferenciaMensalMunicipiosService.UploadItemsTransferenciaMensalMunicipio(
      objectList
    )
    console.log(`Upload realizado com sucesso`)

    console.log(`Atualizando os meta dados do arquivo: ${fileName}...`)
    await directusTransferenciaService.deleteItemByFileName(fileName)

    await directusTransferenciaService.createNewItem({
      nome_do_arquivo: fileName,
      tamanho: currentFileSize,
    })
    console.log(`Meta dados atualizados com sucesso.`)
  }
}
