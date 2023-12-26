import TransferenciaMensalMunicipio from '../interfaces/transferenciaMensalMunicipio';

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
}

