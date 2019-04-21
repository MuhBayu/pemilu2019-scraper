const puppeteer = require('puppeteer');

const scrapPemilu = new Promise(async (resolve) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://pemilu2019.kpu.go.id/#/ppwp/hitung-suara/', {"waitUntil" : "networkidle0", timeout: 3000000});
    let result = await page.evaluate(() => {
        let suara = {};
        const section = document.querySelector('#app > div.container.pt-1 > div > div.card-body > section');

        var chart01 = section.querySelector('.highcharts-container > svg > g.highcharts-data-labels > g.highcharts-label:last-child > text')
        var chart02 = section.querySelector('.highcharts-container > svg > g.highcharts-data-labels > g.highcharts-label > text')
        
        var paslon_01_nama = chart01.querySelector('tspan:nth-child(1)').innerHTML + chart01.querySelector('tspan:nth-child(2)').innerHTML + ' ' + chart01.querySelector('tspan:nth-child(3)').innerHTML
        var paslon_01_persentase = chart01.querySelector('tspan:nth-child(4)').innerHTML
        var paslon_01_suara = chart01.querySelector('tspan:nth-child(5)').innerHTML + chart01.querySelector('tspan:nth-child(6)').innerHTML
        
        var paslon_02_nama = chart02.querySelector('tspan:nth-child(1)').innerHTML + chart02.querySelector('tspan:nth-child(2)').innerHTML + ' ' + chart02.querySelector('tspan:nth-child(3)').innerHTML
        var paslon_02_persentase = chart02.querySelector('tspan:nth-child(4)').innerHTML
        var paslon_02_suara = chart02.querySelector('tspan:nth-child(5)').innerHTML + chart02.querySelector('tspan:nth-child(6)').innerHTML
        
        var versi = section.querySelector('div > div:nth-child(1) > h4 > span:nth-child(1)').innerText
        var progress = section.querySelector('div > div:nth-child(1) > h4 > span:nth-child(2)').innerText
        progress = progress.split(' ');
        
        var tablePemilu1 = section.querySelectorAll('div > div.data-table > div.row > div:nth-child(1) > table > tbody > tr')
        var tablePemilu2 = section.querySelectorAll('div > div.data-table > div.row > div:nth-child(2) > table > tbody > tr')
        var tablePemiluMerge = [ ...tablePemilu1, ...tablePemilu2 ]
        
        tablePemiluMerge.forEach((td) => {
            var wilayah = td.querySelector('td:nth-child(1) > button').innerText;
            var owi = td.querySelector('td:nth-child(2)').innerText;
            var owo = td.querySelector('td:nth-child(3)').innerText;
            suara[wilayah] = {
                '1': parseInt(owi.replace(/\./g, '').trim()),
                '2': parseInt(owo.replace(/\./g, '').trim())
            };
            document.querySelector('#highcharts-cr74obf-0 > svg > g.highcharts-data-labels.highcharts-series-0.highcharts-pie-series.highcharts-tracker > g.highcharts-label.highcharts-data-label.highcharts-data-label-color-0')
        })
        return {
            versi: versi.replace('Versi: ', ''),
            ppwp: {
                '1': {
                    nama: paslon_01_nama,
                    persentase: paslon_01_persentase.replace(/[()]/g, '').trim(),
                    toal_suara: parseInt(paslon_01_suara.replace('Perolehan Suara: ', '').replace(' ', '')),
                },
                '2': {
                    nama: paslon_02_nama,
                    persentase: paslon_02_persentase.replace(/[()]/g, '').trim(),
                    toal_suara: parseInt(paslon_02_suara.replace('Perolehan Suara: ', '').replace(' ', '')),
                }
            },
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