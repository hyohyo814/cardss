import { type Product } from "@prisma/client";
import { api } from "~/utils/api"
import Image from "next/image";
import CheckDiscount from "./price";
import { useState } from "react";

export default function ProductsOptions({ productsData }: { productsData: Product[] }) {
  const [checked, setChecked] = useState(false); 
  const ctx = api.useContext();
  const { mutate } = api.users.saveProduct.useMutation({
    onSuccess: () => {
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
      console.error('ProductOptions()@index.tsx: id missing from product');
    }
    const target = e.target as HTMLInputElement;
    const { value } = target; 
    mutate({ productId: value });
  }

  function checkOne(e: HTMLInputElement) {
    const checkbox = document.getElementsByClassName("productsoption") as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < checkbox.length; i++) {
      checkbox.item(i)!.checked = false;
    }

  }

  return (
    <>
      {productsData.map((res) => (
        <div key={res.id} className="flex font-extralight relative flex-wrap w-full overflow-x-clip">
          <input
            className="productsoption peer hidden"
            id={res.id}
            name="product"
            type="checkbox"
            value={res.id}
            onChange={e => {
              const checkboxes = document.getElementsByClassName("productsoption") as HTMLCollectionOf<HTMLInputElement>;
              for (const checkbox of checkboxes) {
                if (checkbox.id !== e.target.id) {
                  checkbox.checked = false;
                }
              }
              e.target.checked === true ? false : true
            }}
          />
          <label
            className="break-word w-full border-b
            border-gray-700 p-1
            peer-checked:bg-slate-300 peer-checked:text-black md:hover:cursor-pointer
            md:hover:bg-slate-200 md:hover:text-black dropdown-toggle"
            htmlFor={res.id}
          >
            {res.name}
          </label>
          <div className="w-3/5 h-64 backdrop-blur-sm md:peer-checked:translate-x-96
            transition duration-500 -left-96 absolute top-8 my-2 rounded-r-xl
            border-y border-r z-50 backdrop-brightness-50">
            <div className="w-32 h-12 absolute top-1 right-1 flex justify-end">
              <label
                className="flex h-12 w-12 bg-rose-500 cursor-pointer
                items-center justify-center rounded-lg
                before:content-['X'] md:hover:after:content-['Collapse']
                md:hover:before:content-none transition duration-1000
                md:hover:grow"
                htmlFor={res.id} >
                
              </label>
            </div>
            <div className="flex justify-center absolute right-0 mx-4 top-32 w-32">
              <CheckDiscount priceStr={res.price} />
            </div>
            <button
              className="h-12 w-32 bg-gray-800 absolute right-0 mx-4 top-40 rounded-full">
              Add to list
            </button> 
          </div>
          <div className="h-0 top-8 -left-96 z-50 absolute 
            md:peer-checked:translate-x-96 md:peer-checked:visible transition duration-1000">
            <Image
              src={res.image === 'no-image' ? '/api/blankImage' : res.image}
              height={365}
              width={262}
              alt={`${res.name} image`}
              className="rounded-xl md:w-[150px] md:h-[209px] mx-2 my-6"
            />
            <button></button>
          </div>
        </div>
      ))}
    </>
  );
}

