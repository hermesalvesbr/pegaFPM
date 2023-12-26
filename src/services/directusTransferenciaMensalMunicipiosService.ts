require('dotenv').config()
import {
  createDirectus,
  rest,
  createItems,
  authentication,
  DirectusClient,
  AuthenticationClient,
  RestClient,
  deleteItems,
  readItems,
} from '@directus/sdk'
import UtilsService from './utilsService'
import TransferenciaMensalMunicipio from '../interfaces/transferenciaMensalMunicipio'

export default class DirectusTransferenciaMensalMunicipiosService {
  private readonly chunkSize: number = 100
  private readonly requestsAtATime = 4
  private readonly client: DirectusClient<any> &
    AuthenticationClient<any> &
    RestClient<any>
  private readonly token: string = process.env.DIRECTUS_ACESS_TOKEN
    ? process.env.DIRECTUS_ACESS_TOKEN
    : ''
  private readonly colletion: string = 'transferencias_constitucionais'
  private readonly utilsService: UtilsService

  constructor() {
    this.client = createDirectus(
      process.env.DIRECTUS_URL_API ? process.env.DIRECTUS_URL_API : ''
    )
      .with(authentication())
      .with(rest())
    this.client.setToken(this.token)
    this.utilsService = new UtilsService()
  }

  public async getItemByYearAndMonth(
    year: string,
    month: string
  ): Promise<any> {
    return await this.client.request(
      readItems(this.colletion, {
        filter: {
          _and: [
            {
              ano: {
                _eq: year,
              },
            },
            {
              mes: {
                _eq: month,
              },
            },
          ],
        },
      })
    )
  }

  public async createNewItemsTransferenciaMensalMunicipios(items: any) {
    await this.client.request(createItems(this.colletion, items))
  }

  public async deleteItemsTransferenciaMensalMunicipiosByYearAndMonth(
    year: string,
    month: string
  ) {
    await this.client.request(
      deleteItems(this.colletion, {
        filter: {
          _and: [
            {
              ano: {
                _eq: year,
              },
            },
            {
              mes: {
                _eq: month,
              },
            },
          ],
        },
      })
    )
  }

  public async UploadItemsTransferenciaMensalMunicipio(
    itemList: TransferenciaMensalMunicipio[]
  ): Promise<void> {
    let objectTotal: number = itemList.length
    let promisesArray: Promise<void>[] = []
    let progressControl: number = 0

    while (progressControl < itemList.length) {
      for (
        let requestsAtATimeControl = this.requestsAtATime;
        requestsAtATimeControl > 0;
        requestsAtATimeControl--
      ) {
        const chunk = itemList.slice(
          progressControl,
          progressControl + this.chunkSize
        )

        progressControl += this.chunkSize

        if (chunk.length > 0)
          promisesArray.push(
            new Promise<void>(resolve =>
              resolve(this.createNewItemsTransferenciaMensalMunicipios(chunk))
            )
          )
      }

      await Promise.all(promisesArray).catch(error => console.log(error))

      console.log(`Enviados: ${progressControl}/${objectTotal}`)

      await this.utilsService.Delay(200)

      console.log('Enviado com sucesso.')
    }
  }

  public async DeleteAllItemsByYearMonth(
    year: string,
    month: string
  ): Promise<void> {
    let hasItems: any[] = []

    do {
      hasItems = []

      await this.deleteItemsTransferenciaMensalMunicipiosByYearAndMonth(
        year,
        month
      )

      hasItems = await this.getItemByYearAndMonth(year, month)
    } while (hasItems.length > 0)
  }
}
