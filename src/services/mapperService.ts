import TransferenciaMensalMunicipioModel from '../database/models/transferenciaMensalMunicipioModel';
import TransferenciaMensalMunicipio from '../interfaces/transferenciaMensalMunicipio';
const { v4: uuidv4 } = require('uuid');

export default class MapperService {
    public MapTranferenciaMensalMunicipioCsvFileToInteface(csvFile: any): TransferenciaMensalMunicipio[]{
        return csvFile.map((file: any[]) => {
            return {
                'municipio': file[0],
                'uf': file[1],
                'ano': file[2],
                'mes': file[3],
                '1odecendio': file[4],
                '2odecendio': file[5],
                '3odecendio': file[6],
                'item_transferencia': file[7],
                'transferencia': file[8]                                
            } as TransferenciaMensalMunicipio;
        })
    }

    public MapTranferenciaMensalMunicipioCsvFileToTransferenciaConstitucionalModel(csvFile: any): TransferenciaMensalMunicipioModel[]{
        return csvFile.map((file: any[]) => {
            return {
                'id': uuidv4(),
                'municipio': file[0],
                'uf': file[1],
                'ano': file[2],
                'mes': file[3],
                '1odecendio': file[4],
                '2odecendio': file[5],
                '3odecendio': file[6],
                'item_transferencia': file[7],
                'transferencia': file[8]                                
            } as TransferenciaMensalMunicipioModel;
        })
    }
}

