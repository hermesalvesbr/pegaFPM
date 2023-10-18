import axios from 'axios';
import * as fs from 'fs';
import stream from 'stream';

const CSV_URL = 'https://www.tesourotransparente.gov.br/ckan/dataset/af4e7c47-2132-4d9a-bd7c-34e28a210b03/resource/ad282bd0-9043-4c5d-b6d0-f586576c0bd4/download/TransferenciaMensalMunicipios202302.csv';
const OUTPUT_PATH = './output.csv';
const HEADERS = 'Munic�pio,UF,ANO,M�s,1� Dec�ndio,2� Dec�ndio,3� Dec�ndio,Item transfer�ncia,Transfer�ncia\n';
const DIRECTUS_ENDPOINT = 'https://cms.softagon.app/items/transferencias_constitucionais';
const BEARER_TOKEN = 'C-0yMQwGn469SwY4oN1RZEdSZOI_LT9Y';

async function downloadCSV() {
    try {
        const response = await axios.get(CSV_URL, { responseType: 'stream' });

        const writer = fs.createWriteStream(OUTPUT_PATH);
        const headerStream = new stream.PassThrough();

        stream.pipeline(
            headerStream,
            writer,
            (err) => {
                if (err) {
                    console.error('Pipeline failed:', err);
                } else {
                    console.log(`CSV saved to ${OUTPUT_PATH}`);
                    sendToDirectus();
                }
            }
        );

headerStream.write(HEADERS);
response.data.pipe(headerStream);

    } catch (error) {
        console.error('Error downloading the CSV:', error);
    }
}

async function sendToDirectus() {
    try {
        const csvData = fs.readFileSync(OUTPUT_PATH, 'utf-8');
        const rows = csvData.split('\n').slice(1); // Remove header

        for (const row of rows) {
            const [Municipio, UF, ANO, Mes, Decendio1, Decendio2, Decendio3, ItemTransferencia, Transferencia] = row.split(';');

            // Check if ANO is a valid integer
            if (isNaN(parseInt(ANO.trim(), 10))) {
                console.error(`Skipping row due to invalid ANO value: ${row}`);
                continue;
            }
            
            // Check for missing values
            if (!Municipio || !UF || !ANO || !Mes || Decendio1 === '' || ItemTransferencia === '') {
                console.error(`Skipping row due to missing values: ${row}`);
                continue;
            }            

            const payload = {
                municipio: Municipio.trim(),
                uf: UF.trim(),
                ano: parseInt(ANO.trim(), 10),
                mes: Mes.trim(),
                "1odecendio": Decendio1.trim(),
                "2odecendio": Decendio2.trim(),
                "3odecendio": Decendio3.trim(),
                item_transferencia: ItemTransferencia.trim(),
                transferencia: Transferencia.trim()
            };

            await axios.post(DIRECTUS_ENDPOINT, payload, {
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`
                }
            });
        }

        console.log('Data sent to Directus successfully!');
    } catch (error) {
        if ((error as any).response && (error as any).response.data) {
            console.error('Error sending data to Directus:', (error as any).response.data);
        } else {
            console.error('Error sending data to Directus:', error);
        }        
    }
}

downloadCSV();