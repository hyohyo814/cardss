import { type Product } from "@prisma/client";
import { api } from "~/utils/api"

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
        <div key={res.id} className="flex font-extralight">
          <input
            className="peer hidden"
            id={res.id}
            name="product"
            type="radio"
            value={res.id}
            onClick={handler}
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
        </div>
      ))}
    </>
  );
}

