/* eslint-disable @typescript-eslint/no-misused-promises */

// THIS IS TEMPORARY FOR TESTING PURPOSES

import axios from "axios";
import * as cheerio from "cheerio";
import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "process";

export const config = {
  runtime: "edge",
};

interface Series {
  title: string;
  url: string;
}

interface Product {
  name: string;
  price: string;
  image: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const seriesList: Array<Series> = [{
    url: 'https://www.novatcg.com/product-category/weiss-schwarz-japanese/love-live-thanksgiving-festival-2022-lsp',
    title: 'LLTG2022'
  }, {
    url: 'https://www.novatcg.com/product-category/weiss-schwarz-japanese/uma-musume/',
    title: 'UMA'
  }, {
    url: 'https://www.novatcg.com/product-category/weiss-schwarz-japanese/azur-lane-weiss-schwarz-japanese/',
    title: 'AL'
  }]
  const products = new Array<Product>;

  for (const series of seriesList) {
    const response = await fetch(series.url);
    const data = await response.text();
  
    const $ = cheerio.load(data, null, false);
    const shopList = $('div.shop-with-sidebar li')
    shopList.each((_idx, el) => {
      const obj = {} as Product;
      const name = $(el).find('h2.woocommerce-loop-product__title').text();
      console.log(name)
      const price = $(el).find('span.price').text()
      console.log(price)
      const image = $(el).find('img.wp-post-image').attr('src')
        ?? 'no image'
      console.log(image);
  
      obj.name = name;
      obj.price = price;
      obj.image = image;
  
      products.push(obj);
      return;
    })
  };




  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
