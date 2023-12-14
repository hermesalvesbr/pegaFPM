import Knex from 'knex';

export default class DataBaseContext{

    public readonly knexContext: any;
    private static _instace: DataBaseContext;

    constructor(){
        this.knexContext = this._buildKnexConnection();
    }

    static getInstace() : DataBaseContext{
        if(this._instace)            
            return this._instace;
            
        this._instace = new DataBaseContext();

        return this._instace;
    }

    private _buildKnexConnection(): any {
        return Knex({
            client: process.env.POSTGRES_CLIENT,
            connection: this._buildConnection()
        });
    }

    private _buildConnection(){
       return {
            host: process.env.POSTGRES_DB_URL?? '',
            port: process.env.POSTGRES_DB_PORT?? '',
            user: process.env.POSTGRES_USER?? '',
            password: process.env.POSTGRES_PASSWORD?? '',
            database: process.env.POSTGRES_DB?? ''
        }
    }
}