const path = require('path')
const fs = require('fs-extra');
const hbs = require('handlebars')
var helpers = require('handlebars-helpers')();
const Global = {
    compile: async (templateName, data) => {
        const filePath = path.join(process.cwd(), 'Templates', `${templateName}.hbs`);
        const html = await fs.readFile(filePath, 'utf-8');
        return hbs.compile(html)(data)
    }
}

module.exports = Global