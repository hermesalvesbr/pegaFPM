import TransferenciaMensalMunicipiosService from './src/scheduleservices/transferenciaMensalMunicipiosService'

const transferenciaMensalMunicipiosService =
  new TransferenciaMensalMunicipiosService()

const date = new Date()
const year = date.getFullYear().toString()
const month = (date.getMonth() + 1).toString().padStart(2, '0')

transferenciaMensalMunicipiosService.startProcess(year, month)
