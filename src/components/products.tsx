import { type Product } from "@prisma/client";
import { api } from "~/utils/api"
import Image from "next/image";
import CheckDiscount from "./price";

export default function ProductsOptions({ productsData }: { productsData: Product[] }) {
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

  return (
    <>
      {productsData.map((res) => (
        <div key={res.id} id={res.name} className="product_item flex font-extralight relative flex-wrap w-full overflow-x-clip">
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
            md:hover:bg-slate-200 md:hover:text-black"
            htmlFor={res.id}
          >
            {res.name}
          </label>
          <div className="w-3/5 invisible h-64 backdrop-blur-sm md:peer-checked:translate-x-96
            transition duration-500 md:-left-96 absolute md:top-8 my-2 rounded-r-xl
            border-y border-r z-50 backdrop-brightness-50 md:-translate-x-20
            peer-checked:visible delay1-150 ease-in-out shadow-2xl shadow-black
            peer-checked:snap-center peer-checked:translate-x-64 -left-64">
            <div className="w-32 h-12 absolute top-1 right-1 flex justify-end">
              <label
                className="flex md:h-12 md:w-12 md:bg-rose-500 cursor-pointer
                items-center justify-center rounded-lg
                md:before:content-['X'] md:hover:after:content-['Collapse']
                md:hover:before:content-none transition duration-1000
                md:hover:grow h-6 w-6 before:content-['\274C'] bg-transparent"
                htmlFor={res.id} > 
              </label>
            </div>
            <div className="flex justify-center absolute md:right-0 md:mx-12 md:bottom-24 md:w-32
              bottom-8 mx-12">
              <CheckDiscount priceStr={res.price} />
            </div>
            <button
              className="md:h-12 md:w-32 bg-gray-800 absolute md:left-28 md:mx-14 md:my-0 md:top-44 rounded-full
              md:hover:bg-white md:hover:text-black transition ease-in-out bottom-0 h-6 w-32 left-0 mx-2
              my-2 border font-light"
              value={res.id}
              onClick={handler}>
              Add to list
            </button> 
          </div>
          <div className="h-0 md:top-8 md:-left-80 z-50 absolute invisible 
            md:peer-checked:translate-x-80 peer-checked:visible transition duration-1000
            ease-in-out delay-100 -left-36 peer-checked:translate-x-36 top-0">
            <Image
              src={res.image === 'no-image' ? '/api/blankImage' : res.image}
              height={365}
              width={262}
              alt={`${res.name} image`}
              className="rounded-xl md:w-[150px] md:h-[209px] mx-2 my-6
              bg-slate-950/80 shadow-sm shadow-white w-32"
            />
            <button></button>
          </div>
        </div>
      ))}
    </>
  );
}

