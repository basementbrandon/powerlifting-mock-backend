import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function scrapePowerliftingAmerica() {
  const url = 'https://powerliftingamerica.com/events/';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const meets = [];

  $('table.events-table tbody tr').each((i, el) => {
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
        federation: 'Powerlifting America',
        link: link || url,
        logo: 'https://powerliftingamerica.com/wp-content/uploads/2021/01/logo.png'
      });
    }
  });

  return meets;
}