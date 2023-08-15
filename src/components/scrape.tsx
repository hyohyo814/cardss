import { useState } from "react";
import { api } from "~/utils/api";
import * as cheerio from "cheerio";

type Product = {
  name: string,
  price: string
}


export default function Scrape() {
  const [name, setName] = useState("name");
  const [price, setPrice] = useState("price");
  const url = 'https://www.novatcg.com/product-category/weiss-schwarz-japanese/love-live-thanksgiving-festival-2022-lsp/';

  const { data, isLoading } = api.example.scrape.useQuery({ text: url });
  // console.log(data);

  if (isLoading) return console.log('loading')
  if (!data) return console.log('error')

  const $ = cheerio.load(data, null, false);
  const products = $('.subcategory-products li')
  console.log(products);
  const productsList: Array<Product> = [];


  products.each((index, el) => {
    //console.log($('.woocommerce-loop-product__title').text())
    const productName = $(el).find('.woocommerce-loop-product__title').text();
    const productPrice = $(el).find('.price').text();
    
    const pricePair = {
      name: productName,
      price: productPrice,
    };
    productsList.push(pricePair);
  })
  console.log(productsList);

  function handle(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!e.target) console.log('error');
    const match = productsList.find((el) => {
      el.name === name;
    });

    if (!match) console.log('Name not found');
  }
}