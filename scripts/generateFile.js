const generateFile = (assets, external_components) => {
    const totalSize = assets.reduce((total, asset) => {
        return total + parseFloat(asset.size);
    }, 0)
    const tableRows = assets.map(asset => {
        return `
  <tr>
    <td>${asset.name}</td>
    <td class="img-path">${asset.relativePath}</td>
    <td>${asset.size} KB</td>
    <td><img src="${asset.url}" style="width: 50px;"></td>
  </tr>
`;
    }).join('\n');

    const htmlContent = `
        <html>
        <head>
        <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 16px;
            padding: 0;
            font-size: 14px; 
            color: #333;
            background-color: #fff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px; 
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        </style>
        </head>
        <body>
        <h1>Assets Table - ${external_components}</h1>
        <h2>Total Assets: ${assets.length}</h2>
        <h2>Total Size: ${totalSize} KB</h2>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Relative Path</th>
                <th>Size</th>
                <th>Image</th>
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

module.exports = generateFile;
