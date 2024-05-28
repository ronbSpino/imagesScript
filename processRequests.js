const fs = require('fs');
const path = require('path');

const processRequests = async (requests, baseUrl, downloadFolder, generateFile) => {
    const fetch = await import('node-fetch').then(module => module.default);

    // Ensure download folder exists
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
    }

    // Download images
    const downloadPromises = requests.map(async (request) => {
        const url = request.url();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = url.split('/').pop();
        const filePath = path.join(downloadFolder, fileName);
        fs.writeFileSync(filePath, buffer);

        const relativeUrlPath = url.replace(baseUrl, '');

        return {
            name: fileName,
            url: url,
            relativePath: relativeUrlPath,
            size: (buffer.length / 1024).toFixed(1),
            image: `data:${response.headers.get('content-type')};base64,${buffer.toString('base64')}`
        };
    });

    const assets = await Promise.all(downloadPromises);
    assets.sort((a, b) => b.size - a.size);

    const fileContent = generateFile(assets);
    const fileSavePath = path.join(downloadFolder, 'assetsTable.html');
    fs.writeFileSync(fileSavePath, fileContent);

    console.log('Confluence file created', fileSavePath);

    return assets;
};

module.exports = processRequests;
