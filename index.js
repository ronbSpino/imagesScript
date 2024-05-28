const fs = require('fs');
const path = require('path');
const fetchRequests = require('./fetchRequests');
const processRequests = require('./processRequests');
const generateFile = require('./generateFile');

const URL = 'https://cdn-newdev.spinomenal.com/external_components/generic-play.html?partnerId=SPIN-market-dev&launchToken=e46a872e-482&gameCode=Krembo_BookOfDemiGodsV&langCode=en_US&IsFunMode=true&inter=0&extComLabel=PLAT-1102.Spin_button_transition&InitClientUrl=https%3a%2f%2frgs-dev-demo.spinomenal.com%2fapi%2fInitClientUrl&KremboGameRibbonV=game_ribbon.ron-test.js';
const external_components = 'game_ribbon';

const baseUrl = "https://cdn-newdev.spinomenal.com";
const downloadPath = `assets/${external_components}/`
const downloadFolder = path.resolve(__dirname, downloadPath);

(async () => {
    try {
        const filteredRequests = await fetchRequests(URL, external_components);
        const assets = await processRequests(filteredRequests, baseUrl, downloadFolder);

        const fileContent = generateFile(assets);
        const fileSavePath = path.join(downloadFolder, 'assetsTable.html');
        fs.writeFileSync(fileSavePath, fileContent);

        console.log('Confluence file created', fileSavePath);
    } catch (error) {
        console.error('Error:', error);
    }
})();
