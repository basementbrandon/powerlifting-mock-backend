import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function scrapeUSAPL() {
  const url = 'https://www.usapowerlifting.com/calendar/';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const meets = [];

  $('.entry-content table tbody tr').each((i, el) => {
    const cols = $(el).find('td');
    const date = $(cols[0]).text().trim();
    const name = $(cols[1]).text().trim();
    const location = $(cols[2]).text().trim();
    const link = $(cols[1]).find('a').attr('href');

    if (date && name) {
      meets.push({
        name,
        date: new Date(date).toISOString(),
        location,
        federation: 'USAPL',
        link: link || url,
        logo: 'https://usapowerlifting.com/wp-content/uploads/2022/01/USAPL-logo.png'
      });
    }
  });

  return meets;
}