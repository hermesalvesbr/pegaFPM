"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var async = require("async");
var csv = require('csv-parser');
var CSV_URL = 'https://www.tesourotransparente.gov.br/ckan/dataset/af4e7c47-2132-4d9a-bd7c-34e28a210b03/resource/ad282bd0-9043-4c5d-b6d0-f586576c0bd4/download/TransferenciaMensalMunicipios202302.csv';
var DIRECTUS_API_ENDPOINT = 'https://cms.softagon.app/items/transferencias_constitucionais';
var BEARER_TOKEN = 'C-0yMQwGn469SwY4oN1RZEdSZOI_LT9Y';
var TIMEOUT = 10000; // 10 seconds
var MAX_RETRIES = 3;
var config = {
    headers: {
        'Authorization': "Bearer ".concat(BEARER_TOKEN),
        'Content-Type': 'application/json',
    },
    timeout: TIMEOUT
};
function uploadToDirectus(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.post(DIRECTUS_API_ENDPOINT, data, config)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function uploadWithRetry(data, retries) {
    if (retries === void 0) { retries = MAX_RETRIES; }
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, uploadToDirectus(data)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 2:
                    error_1 = _a.sent();
                    if (!(retries > 0)) return [3 /*break*/, 4];
                    console.log("Retry ".concat(MAX_RETRIES - retries + 1, " for data:"), data);
                    return [4 /*yield*/, uploadWithRetry(data, retries - 1)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.error('Max retries reached. Failed to upload:', data, error_1);
                    _a.label = 5;
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Create a queue object with concurrency 2
var q = async.queue(function (task, callback) {
    uploadWithRetry(task.data)
        .then(function () { return callback(); })
        .catch(callback);
}, 2);
// Assign a callback
q.drain(function () {
    console.log('All items have been processed');
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get(CSV_URL, { responseType: 'stream' })];
                case 1:
                    response = _a.sent();
                    response.data
                        .pipe(csv())
                        .on('data', function (row) {
                        // Add data to queue
                        q.push({ data: row }, function (result) {
                            if (result instanceof Error) {
                                console.error('Failed to upload:', row, result);
                            }
                            else {
                                console.log('Uploaded:', row);
                            }
                        });
                    })
                        .on('end', function () {
                        console.log('CSV data successfully processed.');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
