const puppeteer = require('puppeteer');
const fs = require('fs');


//Define Sousse city Booking hotels

let sousseHotelsUrl = fs.readFileSync('urls.txt', 'utf-8');
let urls = sousseHotelsUrl.toString().split('\n');

let finalArr = new Array();
(async () => {
    let startPoint = new Date();

    //Initialize the browser and page settings
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1380,
        height: 720
    });
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });

    //access to our page
    for (let i = 0; i < urls.length - 1; i++) {
        await page.goto(urls[i]);
        console.log(`[+]Crawling Page ${i+1}`);
        //get hotels data
        let hotelsData = await page.evaluate(() => {
            //intialize Arrays of hotels
            let hotels = [];

            //Selecting the hotel DOM elements
            let hotelelems = document.querySelectorAll('div.sr_property_block[data-hotelid]');
            console.log(hotelelems);
            hotelelems.forEach((hotelelem) => {
                //Initialize Json object (hotel data wrapper)
                let hotelsData = {};
                try {
                    hotelsData.name = hotelelem.querySelector('span.sr-hotel__name').innerText;
                    hotelsData.rating = hotelelem.querySelector('div.bui-review-score__badge').innerText;
                    hotelsData.reviews = hotelelem.querySelector('div.bui-review-score__text').innerText;
                    hotelsData.price = hotelelem.querySelector('div[class="bui-price-display__value prco-inline-block-maker-helper"]').innerText;
                } catch (error) {
                    console.log(error);
                }
                console.log(hotelsData);
                hotels.push(hotelsData);
            });

            return hotels;
        });
        finalArr.push(hotelsData);
    }
    fs.writeFileSync('SousseHotels.json', JSON.stringify(finalArr));

    await browser.close();
    let endPoint = new Date();
    let procesDuration = endPoint.getTime() - startPoint.getTime();
    console.log(`[+] The Scraping process tooks: ${procesDuration} ms`);
})();