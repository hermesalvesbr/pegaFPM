import { parse } from 'csv-parse'

export default class CsvService {
  public async materializeFromBuffer(
    buffer: ArrayBuffer,
    format: string
  ): Promise<any[]> {
    const records: any[] = []

    const parser = parse({ delimiter: ';' })

    parser.write(this.decoderBuffer(buffer, format))

    await new Promise<void>(resolve => {
      parser.on('readable', function () {
        let record: any
        while ((record = parser.read()) !== null) {
          records.push(record)
        }
        resolve()
      })
    })

    return records
  }

  private decoderBuffer(buffer: ArrayBuffer, format: string) {
    const decoder = new TextDecoder(format)
    return decoder.decode(buffer)
  }
}
