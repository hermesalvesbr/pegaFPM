require('dotenv').config();
import cron from 'node-cron';
import TransferenciaMensalMuniciosService from './src/scheduleservices/transferenciaMensalMuniciosService';

cron.schedule('0 0 * * *', async () => {
        const transferenciaMensalMuniciosService = new TransferenciaMensalMuniciosService();
        const date = new Date();

        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString();

        console.log('Iniciando fluxo para obter as transferencias mensais de municipios...');
        
        try{
            await transferenciaMensalMuniciosService.startProcess(year, month);
        }catch(error){
            console.log(error);
        }
        
        console.log('Finalizado o fluxo para obter as transferencias mensais de municipios.');
    },
    {
        name: 'transferencia-mensal-mucipios',
        scheduled: true,
        timezone: 'America/Sao_Paulo',
        runOnInit: true
    }
);

// cron.schedule('* * * * *', async () => {
//         const transferenciaMensalMuniciosService = new TransferenciaMensalMuniciosService();

//         const anosEMesesRetroativos = 
//         [
//             {year: '2023', month: '04'},
//             {year: '2023', month: '05'},
//             {year: '2023', month: '06'},
//             {year: '2023', month: '07'},
//             {year: '2023', month: '08'},
//             {year: '2023', month: '09'},
//             {year: '2023', month: '10'},
//             {year: '2023', month: '11'}
//         ]

//         console.log('Iniciando fluxo para obter as transferencias mensais de municipios...');

//         for await (let anoEMesRetroativos of anosEMesesRetroativos){
//             try{
//                 await transferenciaMensalMuniciosService.startProcess(anoEMesRetroativos.year, anoEMesRetroativos.month);
//             }catch(error){
//                 console.log(error);
//             }
//         }

//         console.log('Finalizado o fluxo para obter as transferencias mensais de municipios.');
//     },
//     {
//         name: 'transferencia-mensal-mucipios-retroativos',
//         scheduled: false,
//         timezone: 'America/Sao_Paulo',
//         runOnInit: true
//     }
// );