"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const stream_1 = __importDefault(require("stream"));
const CSV_URL = 'https://www.tesourotransparente.gov.br/ckan/dataset/af4e7c47-2132-4d9a-bd7c-34e28a210b03/resource/ad282bd0-9043-4c5d-b6d0-f586576c0bd4/download/TransferenciaMensalMunicipios202302.csv';
const OUTPUT_PATH = './output.csv';
const HEADERS = 'Munic�pio,UF,ANO,M�s,1� Dec�ndio,2� Dec�ndio,3� Dec�ndio,Item transfer�ncia,Transfer�ncia\n';
const DIRECTUS_ENDPOINT = 'https://cms.softagon.app/items/transferencias_constitucionais';
const BEARER_TOKEN = 'C-0yMQwGn469SwY4oN1RZEdSZOI_LT9Y';
function downloadCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(CSV_URL, { responseType: 'stream' });
            const writer = fs.createWriteStream(OUTPUT_PATH);
            const headerStream = new stream_1.default.PassThrough();
            stream_1.default.pipeline(headerStream, writer, (err) => {
                if (err) {
                    console.error('Pipeline failed:', err);
                }
                else {
                    console.log(`CSV saved to ${OUTPUT_PATH}`);
                    sendToDirectus();
                }
            });
            headerStream.write(HEADERS);
            response.data.pipe(headerStream);
        }
        catch (error) {
            console.error('Error downloading the CSV:', error);
        }
    });
}
function sendToDirectus() {
    return __awaiter(this, void 0, void 0, function* () {
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
                yield axios_1.default.post(DIRECTUS_ENDPOINT, payload, {
                    headers: {
                        'Authorization': `Bearer ${BEARER_TOKEN}`
                    }
                });
            }
            console.log('Data sent to Directus successfully!');
        }
        catch (error) {
            if (error.response && error.response.data) {
                console.error('Error sending data to Directus:', error.response.data);
            }
            else {
                console.error('Error sending data to Directus:', error);
            }
        }
    });
}
downloadCSV();
