export default class DownloadService {
  public async DownloadFile(downloadLink: string): Promise<ArrayBuffer> {
    return await fetch(downloadLink)
      .then(async data => {
        const buffer = await data.arrayBuffer().catch(error => {
          throw error
        })

        return buffer
      })
      .catch(error => {
        throw error
      })
  }
}
