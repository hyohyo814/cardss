import * as cheerio from "cheerio";
import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "process";

export const config = {
  runtime: 'edge',
};

interface Series {
  title: string;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const tokenFromRequest = req.headers.authorization;
  if (tokenFromRequest !== env.CRON_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const url = 'https://www.novatcg.com/product-category/weiss-schwarz-japanese';

  const response = await fetch(url);
  const data = await response.text();

  const $ = cheerio.load(data, null, false);
  const series = $(".products li");
  const seriesList = new Array<Series>();

  series.each((index, el) => {
    const obj = {} as Series;
    const urlParse = $(el).find("a").attr("href");
    const titleParse = $(el)
      .find(".woocommerce-loop-category__title")
      .text()
      .trim();

    if (!urlParse) {
      console.log(`Skipped ${index}. REASON: url not found!`);
      return;
    } else {
      obj.url = urlParse;
      obj.title = titleParse.replace(/ /g, "_");

      seriesList.push(obj);
      return;
    }
  });

  return new Response(JSON.stringify(seriesList), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600'
    }
  });
}
