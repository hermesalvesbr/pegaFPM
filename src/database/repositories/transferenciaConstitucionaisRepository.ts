import TransferenciaMensalMunicipioModel from "../models/transferenciaMensalMunicipioModel";
import BaseRepository from "./baseRepository";

export default class TransferenciaConstitucionalRepository extends BaseRepository {
    private readonly _transferenciaConstitucionalTable: string = process.env.POSTGRES_TRANSFERENCIA_CONSTITUCIONAL_TABLE?? '';


    public async insertTransferenciaConstitucionalAsync(transfericiaConstitucionalModel: TransferenciaMensalMunicipioModel) {
        await this.insertAsync(transfericiaConstitucionalModel, this._transferenciaConstitucionalTable);
    }
    
    public async insertTransferenciaConstitucionalListAsync(transfericiaConstitucionalModel: TransferenciaMensalMunicipioModel[]) {    
        await this.insertListAsync(transfericiaConstitucionalModel, this._transferenciaConstitucionalTable);
    }

    public async deleteTransferenciaConstitucionalListAsyncByYearAndMonth(year: string, month: string){
        await this.instaceDataBaseContext.knexContext(this._transferenciaConstitucionalTable).where({ano: year, mes: month}).del();
    }
}