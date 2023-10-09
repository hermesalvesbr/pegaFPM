import axios from "axios";
import * as async from "async";

import csv from "csv-parser";

const CSV_URL =
  "https://www.tesourotransparente.gov.br/ckan/dataset/af4e7c47-2132-4d9a-bd7c-34e28a210b03/resource/ad282bd0-9043-4c5d-b6d0-f586576c0bd4/download/TransferenciaMensalMunicipios202302.csv";
const DIRECTUS_API_ENDPOINT =
  "https://cms.softagon.app/items/transferencias_constitucionais";
const BEARER_TOKEN = "C-0yMQwGn469SwY4oN1RZEdSZOI_LT9Y";
const TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

const config = {
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT,
};

async function uploadToDirectus(data: any) {
  await axios.post(DIRECTUS_API_ENDPOINT, data, config);
}

async function uploadWithRetry(data: any, retries: number = MAX_RETRIES) {
  try {
    await uploadToDirectus(data);
  } catch (error) {
    if (retries > 0) {
      console.log(`Retry ${MAX_RETRIES - retries + 1} for data:`, data);
      await uploadWithRetry(data, retries - 1);
    } else {
      console.error("Max retries reached. Failed to upload:", data, error);
    }
  }
}

// Create a queue object with concurrency 2
var q = async.queue(function (
  task: { data: any },
  callback: (err?: Error) => void
) {
  uploadWithRetry(task.data)
    .then(() => callback())
    .catch(callback);
},
2);

// Assign a callback
q.drain(function () {
  console.log("All items have been processed");
});

async function main() {
  const response = await axios.get(CSV_URL, { responseType: "stream" });

  response.data
    .pipe(csv())
    .on("data", (row: any) => {
      // Add data to queue
      q.push({ data: row }, function (result) {
        if (result instanceof Error) {
          console.error("Failed to upload:", row, result);
        } else {
          console.log("Uploaded:", row);
        }
      });
    })
    .on("end", () => {
      console.log("CSV data successfully processed.");
    });
}

main().catch(console.error);
