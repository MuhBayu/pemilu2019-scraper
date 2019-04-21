const puppeteer = require('puppeteer');

const scrapPemilu = new Promise(async (resolve) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://pemilu2019.kpu.go.id/#/ppwp/hitung-suara/', {"waitUntil" : "networkidle0", timeout: 3000000});
    let result = await page.evaluate(() => {
        let suara = {};
        const section = document.querySelector('#app > div.container.pt-1 > div > div.card-body > section');        
        var versi = section.querySelector('div > div:nth-child(1) > h4 > span:nth-child(1)').innerText
        var progress = section.querySelector('div > div:nth-child(1) > h4 > span:nth-child(2)').innerText
        progress = progress.split(' ');
        var tablePemilu1 = section.querySelectorAll('div > div.data-table > div.row > div:nth-child(1) > table > tbody > tr')
        var tablePemilu2 = section.querySelectorAll('div > div.data-table > div.row > div:nth-child(2) > table > tbody > tr')
        var tablePemiluMerge = [ ...tablePemilu1, ...tablePemilu2 ]
        
        tablePemiluMerge.forEach((td) => {
            var wil = td.querySelector('td:nth-child(1) > button').innerText;
            var owi = td.querySelector('td:nth-child(2)').innerText;
            var owo = td.querySelector('td:nth-child(3)').innerText;
            suara[wil] = {
                1: parseInt(owi.replace(/\./g, '').trim()),
                2: parseInt(owo.replace(/\./g, '').trim())
            };
        })
        return {
            version: versi.replace('Versi: ', ''),
            progress: {
                proses: parseInt(progress[1].replace(/\./g, '').trim()),
                total: parseInt(progress[3].replace(/\./g, '').trim()),
                persentase: progress[5].replace(/[()]/g, '').trim()
            },
            suara: suara
        }
    })
    await browser.close()
    resolve(result)
})

module.exports = scrapPemilu