import { type Product } from "@prisma/client";
import { api } from "~/utils/api"
import Image from "next/image";
import CheckDiscount from "./price";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function ProductsOptions({ productsData }: { productsData: Product[] }) {
  const [targetProd, setTargetProd] = useState("");
  const ctx = api.useContext();
  const { mutate } = api.users.saveProduct.useMutation({
    onSuccess: () => {
      toast.success(`Successfully added ${targetProd}`)
      void ctx.users.getUserList.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        console.error(errorMessage[0]!)
      } else {
        console.error('Failed to add! Please try again later');
      }
    },
  });
 
  function handler(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!e.target) {
      toast.error("Product information unavailable!");
      console.error('ProductOptions()@products.tsx: id missing from product');
    }
    const target = e.target as HTMLInputElement;
    setTargetProd(target.name); 
    mutate({ productId: target.value });
  };

  function checkOne(e: React.SyntheticEvent) {
    if (!e.target) {
      toast.error("Product information unavailable!");
      console.error('ProductOptions()@products.tsx: id missing from product');
    }
    const target = e.target as HTMLInputElement;
    const checkboxes = document.getElementsByClassName("productsoption") as HTMLCollectionOf<HTMLInputElement>;
    for (const checkbox of checkboxes) {
      if (checkbox.id !== target.id) {
        checkbox.checked = false;
      }
    }
    target.checked === true ? false : true
  };

  return (
    <>
      {productsData.map((res) => (
        <div key={res.id} id={res.name} className="product_item flex font-extralight relative
          flex-wrap w-full overflow-x-clip">
          <input
            className="productsoption peer hidden"
            id={res.id}
            name="product"
            type="checkbox"
            value={res.id}
            onChange={checkOne} />
          <label
            className="break-word w-full border-b
            border-gray-700 p-1
            peer-checked:bg-slate-300 peer-checked:text-black md:hover:cursor-pointer
            md:hover:bg-slate-200 md:hover:text-black"
            htmlFor={res.id}>
            {res.name}
          </label>
          <div
            className="invisible absolute rounded-r-xl border-y border-r z-50
            backdrop-brightness-50 backdrop-blur-sm shadow-2xl shadow-black
            h-64 w-3/5 -left-64 my-2
            md:top-8 md:-left-96 md:-translate-x-36
            transition duration-500 ease-in-out delay-150
            peer-checked:visible peer-checked:snap-center peer-checked:translate-x-64
            2xl:peer-checked:translate-x-96">
            <div className="w-32 h-12 absolute top-1 right-1 flex justify-end">
              <label
                className="items-center justify-center rounded-lg flex
                bg-transparent transition duration-1000
                md:hover:grow md:before:content-['X'] md:hover:after:content-['Collapse']
                md:hover:before:content-none
                h-6 w-6 cursor-pointer before:content-['\274C']
                md:h-12 md:w-12 md:bg-rose-500"  
                htmlFor={res.id} />
            </div>
            <div className="flex justify-center absolute
              md:right-0 md:mx-12 md:bottom-24 md:w-32
              bottom-8 mx-12 w-24
              xl:mx-12">
              <CheckDiscount priceStr={res.price} />
            </div>
            <button
              className="flex justify-center items-center absolute rounded-full
              transition ease-in-out border border-white
              md:hover:text-black md:hover:bg-slate-50
              bottom-2 mx-12 w-24
              md:bottom-14 md:right-0 md:w-32 md:mx-12
              lg:mx-12 
              2xl:h-8 2xl:mx-12"
              name={res.name}
              value={res.id}
              onClick={handler}>
              Add to list
            </button> 
          </div>
          <div
            className="absolute invisible z-50
            h-0 top-0 mx-6 -left-40
            transition duration-1000 delay-100 ease-in-out
            peer-checked:visible peer-checked:translate-x-40
            md:top-8 md:-left-80
            md:peer-checked:translate-x-80">
            <Image
              src={res.image === 'no-image' ? '/api/blankImage' : res.image}
              height={365}
              width={262}
              alt={`${res.name} image`}
              className="rounded-xl md:w-[150px] md:h-[209px] mx-2 my-8
              bg-slate-950/80 shadow-sm shadow-white w-32" />
          </div>
        </div>
      ))}
    </>
  );
}

