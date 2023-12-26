import PuppeteerPageObjectBase from '../puppeteerPageObjectBase'
import { Page } from 'puppeteer'
import dotenv from 'dotenv'
dotenv.config()
export default class TransferenciasConstitucionaisMunicipiosPage extends PuppeteerPageObjectBase {
  private TRANSFERENCIAS_URL: string = process.env.TRANSFERENCIAS_URL || ''
  private readonly transferenciasConstitucionaisMunicipiosUrl: string =
    this.TRANSFERENCIAS_URL
  private readonly transferenciasMensalMunicipioFileSelector: string =
    '.resource-item'
  private readonly transferenciasMensalMunicipioDownloadFileSelector: string =
    '.resource-url-analytics'
  private readonly sizeFileRegexPatern = /([\d,.]+\sMiB)/i
  private readonly onlyNumbersWithCommaRegexPatern = /([\d,]+)/

  constructor(page: Page) {
    super(page)
  }

  public async openPage() {
    await this.OpenPage(this.transferenciasConstitucionaisMunicipiosUrl)
  }

  public async GetLinkTransferenciasMensalMunicipioFileByYearAndMonth(
    yearMonth: string
  ): Promise<string> {
    const fileInfo = await this.getInformationFromFilesByYearAndMonth(yearMonth)

    return fileInfo.downloadLink
  }

  public async getFileSizeByYearMonth(yearMonth: string): Promise<number> {
    await this.Delay(3000)

    const fileInfo = await this.getInformationFromFilesByYearAndMonth(yearMonth)

    const fileSizeWithUnitOfMeasurement = fileInfo.description.match(
      this.sizeFileRegexPatern
    )[0]
    const fileSize = fileSizeWithUnitOfMeasurement
      .match(this.onlyNumbersWithCommaRegexPatern)[0]
      .replace(',', '.')

    return Number(fileSize)
  }

  public async getInformationFromFilesByYearAndMonth(
    fileName: string
  ): Promise<any> {
    await this.Delay(3000)

    const elements = await this.GetElements(
      this.transferenciasMensalMunicipioFileSelector
    )
    const filesInfo = await Promise.all(
      elements.map(async element => {
        return {
          description: await element.$eval('a', element =>
            element.textContent?.replace('\n', ' ').replace(/\s+/gi, ' ')
          ),
          downloadLink: await element.$eval(
            this.transferenciasMensalMunicipioDownloadFileSelector,
            element => element.getAttribute('href')
          ),
        }
      })
    )

    const fileInfo = filesInfo.find(fileInfo =>
      fileInfo.description?.toLowerCase().includes(fileName.toLowerCase())
    )

    if (!fileInfo) throw new Error(`Não foi encontado o arquivo: ${fileName}.`)

    if (!fileInfo.downloadLink)
      throw new Error(`O link do arquivo: ${fileName}, não esta disponivel.`)

    return fileInfo
  }
}
