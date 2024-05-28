const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

//change those paths for each component
const URL = 'https://cdn-newdev.spinomenal.com/external_components/generic-play.html?partnerId=SPIN-market-dev&launchToken=e46a872e-482&gameCode=Krembo_BookOfDemiGodsV&langCode=en_US&IsFunMode=true&inter=0&extComLabel=PLAT-1102.Spin_button_transition&InitClientUrl=https%3a%2f%2frgs-dev-demo.spinomenal.com%2fapi%2fInitClientUrl&KremboGameRibbonV=game_ribbon.ron-test.js';
const external_components = 'game_ribbon';

const baseUrl = "https://cdn-newdev.spinomenal.com";
const downloadPath = `assets/${external_components}/`
const downloadFolder = path.resolve(__dirname, downloadPath);

// Ensure the download folder exists
if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder);
}

(async () => {
    const fetch = await import('node-fetch').then(module => module.default);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Enable network logging
    await page.setRequestInterception(true);
    const requests = [];

    page.on('request', request => {
        requests.push(request);
        request.continue();
    });

    page.on('response', response => {
        console.log(`URL: ${response.url()} - Type: ${response.request().resourceType()}`);
    });

    await page.goto(URL);

    // Wait for some time to ensure all requests are captured
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Filter requests
    const filteredRequests = requests.filter(request => {
        return request.resourceType() === 'image' && request.url().includes(external_components);
    });

    console.log(`Filtered ${filteredRequests.length} requests matching the criteria`);

    // Download images
    const downloadPromises = filteredRequests.map(async (request) => {
        const url = request.url();
        const response = await fetch(url);
        const buffer = await response.buffer();
        const fileName = url.split('/').pop();
        const filePath = path.join(downloadFolder, fileName);
        fs.writeFileSync(filePath, buffer);

        const relativeUrlPath = url.replace(baseUrl, '');

        return { name: fileName, url: url, relativePath: relativeUrlPath, size: (buffer.length / 1024).toFixed(1), image: `data:${response.headers.get('content-type')};base64,${buffer.toString('base64')}` };
    });

    const assets = await Promise.all(downloadPromises);
    assets.sort((a, b) => b.size - a.size);

    const fileContent = generateFile(assets)
    const fileSavePath = path.join(downloadFolder, 'assetsTable.html');
    fs.writeFileSync(fileSavePath, fileContent);


    console.log('Confluence file created')

    await browser.close();
})();


const generateFile = (assets) => {
    // Create HTML table
    const tableRows = assets.map(asset => {
        return `
  <tr>
    <td>${asset.name}</td>
    <td>${asset.relativePath}</td>
    <td>${asset.size} KB</td>
    <td><img src="${asset.url}" style="width: 50px;"></td>
  </tr>
`;
    }).join('\n');

    const htmlContent = `
        <html>
        <head>
        <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
        </style>
        </head>
        <body>
        <h1>Assets Table</h1>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Relative Path</th>
                <th>Size</th>
                <th>Image Url Path</th>
            </tr>
            </thead>
            <tbody>
            ${tableRows}
            </tbody>
        </table>
        </body>
        </html>
        `;

    return htmlContent
}