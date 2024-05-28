const puppeteer = require('puppeteer');

const fetchRequests = async (url, external_components) => {
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

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Filter requests
    const filteredRequests = requests.filter(request => {
        return request.resourceType() === 'image' && request.url().includes(external_components);
    });

    console.log(`Filtered ${filteredRequests.length} requests matching the criteria`);

    await browser.close();

    return filteredRequests;
};

module.exports = fetchRequests;
