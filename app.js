const puppeteer = require('puppeteer');
const fs = require('fs');

//Define Sousse city Booking hotels

let sousseHotelsUrl = 'https://www.booking.com/searchresults.fr.html?label=gen173nr-1FCAEoggI46AdIM1gEaOIBiAEBmAENuAEZyAEM2AEB6AEB-AELiAIBqAIDuAL1qrPvBcACAQ&sid=698d612709ab52e4c7596bf192d3ed19&sb=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.fr.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaOIBiAEBmAENuAEZyAEM2AEB6AEB-AELiAIBqAIDuAL1qrPvBcACAQ%3Bsid%3D698d612709ab52e4c7596bf192d3ed19%3Bsb_price_type%3Dtotal%3Bsrpvid%3D773d4d06d4080026%26%3B&ss=Sousse%2C+Gouvernorat+de+Sousse%2C+Tunisie&is_ski_area=&ssne=Antalya&ssne_untouched=Antalya&checkin_year=2019&checkin_month=12&checkin_monthday=15&checkout_year=2019&checkout_month=12&checkout_monthday=28&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&search_pageview_id=57ba4d197fcd0250&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&ac_position=0&ac_langcode=fr&ac_click_type=b&dest_id=-731250&dest_type=city&place_id_lat=35.82883&place_id_lon=10.64053&search_pageview_id=57ba4d197fcd0250&search_selected=true&ss_raw=Sousse';

(async () => {
    //Initialize the browser and page settings
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1380,
        height: 720
    });

    //access to our page
    await page.goto(sousseHotelsUrl);
    let startPoint = new Date();

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
                hotelsData.name = hotelelem.querySelector('span.sr-hotel__name').innerHTML;
                hotelsData.rating = hotelelem.querySelector('div.bui-review-score__badge').innerHTML;
                hotelsData.reviews = hotelelem.querySelector('div.bui-review-score__text').innerHTML;
                hotelsData.price = hotelelem.querySelector('span.bui-u-sr-only').innerHTML;
            } catch (error) {
                console.log(error);
            }
            console.log(hotelsData);
            hotels.push(hotelsData);
        });

        return hotels;
    });
    fs.writeFileSync('SousseHotels.json', JSON.stringify(hotelsData));
    let endPoint = new Date();
    let procesDuration = endPoint.getTime() - startPoint.getTime();
    console.log(`it took ${procesDuration} ms`);
})();