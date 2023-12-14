import DataBaseContext from "../databaseContext";

export default class BaseRepository{

    protected instaceDataBaseContext: DataBaseContext;

    constructor(){
        this.instaceDataBaseContext = DataBaseContext.getInstace();
    }

    protected async insertAsync(entity: any, table: string){
        await this.instaceDataBaseContext.knexContext(table)
        .insert(entity);
    }

    protected async insertListAsync(enity: any[], table: string){
        await this.instaceDataBaseContext.knexContext.insert(enity).into(table);
    }
}