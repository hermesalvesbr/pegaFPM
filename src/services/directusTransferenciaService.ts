require('dotenv').config()
import {
  AuthenticationClient,
  DirectusClient,
  RestClient,
  authentication,
  createDirectus,
  createItem,
  deleteItems,
  readItems,
  rest,
} from '@directus/sdk'
import Transferencia from '../interfaces/transferencia'

export default class DirectusTransferenciaService {
  private readonly client: DirectusClient<any> &
    AuthenticationClient<any> &
    RestClient<any>
  private readonly token: string = process.env.DIRECTUS_ACESS_TOKEN
    ? process.env.DIRECTUS_ACESS_TOKEN
    : ''
  private readonly colletion: string = 'transferencias'

  constructor() {
    this.client = createDirectus(
      process.env.DIRECTUS_URL_API ? process.env.DIRECTUS_URL_API : ''
    )
      .with(authentication())
      .with(rest())
    this.client.setToken(this.token)
  }

  public async createNewItem(item: Transferencia) {
    await this.client.request(createItem(this.colletion, item))
  }

  public async deleteItemByFileName(fileName: string) {
    await this.client.request(
      deleteItems(this.colletion, {
        filter: {
          nome_do_arquivo: {
            _eq: fileName,
          },
        },
      })
    )
  }

  public async getItemsByFileName(fileName: string): Promise<any[]> {
    return await this.client.request(
      readItems(this.colletion, {
        filter: {
          nome_do_arquivo: {
            _eq: fileName,
          },
        },
      })
    )
  }

  public async theFileSizeHasChanged(
    fileName: string,
    currentFileSize: number
  ): Promise<boolean> {
    const previousFile = await this.getItemsByFileName(fileName)

    if (
      (previousFile.length == 0 && currentFileSize > 0) ||
      currentFileSize > previousFile[0].tamanho
    )
      return true

    return false
  }
}
