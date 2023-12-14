import TransferenciaMensalMunicipioModel from "../database/models/transferenciaMensalMunicipioModel";
import TransferenciaConstitucionalRepository from "../database/repositories/transferenciaConstitucionaisRepository";

export default class TransferenciaConstitucionalService{
    private readonly chunkSize: number = 1000;
    private readonly transferenciaConstitucionalRepository: TransferenciaConstitucionalRepository;

    constructor(){
        this.transferenciaConstitucionalRepository = new TransferenciaConstitucionalRepository();
    }

    public async insertItemsTransferenciaConstitucional(itemList: TransferenciaMensalMunicipioModel[]): Promise<void>{
        let chunkCount: number = 0;
        let objectTotal: number = itemList.length;

        for (let i = 0; i < itemList.length; i += this.chunkSize) {

            const chunk = itemList.slice(i, i + this.chunkSize);
            chunkCount += chunk.length;        

            try{
                await this.transferenciaConstitucionalRepository.insertTransferenciaConstitucionalListAsync(chunk);
            }catch(error){
                throw error;
            }            

            console.log(`Enviados: ${chunkCount}/${objectTotal}`);

            console.log('Enviado com sucesso.');
        }
    }

    public async deleteTransferenciaConstitucionalListAsyncByYearAndMonth(year: string, month: string){
        await this.transferenciaConstitucionalRepository.deleteTransferenciaConstitucionalListAsyncByYearAndMonth(year, month);
    }
}