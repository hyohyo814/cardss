import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";
import Image from "next/image";
import CheckDiscount from "./price";
import { useUser } from "@clerk/nextjs";

export default function PopularProducts() {
  const { isSignedIn } = useUser();
  const { data: popularProducts, isLoading: popProdLoading } =
    api.products.getPopular.useQuery();
  const ctx = api.useContext();
  const { mutate } = api.users.saveProduct.useMutation({
    onSuccess: () => {
      void ctx.users.getUserList.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        console.error(errorMessage[0]!);
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
    <div className="w-full">
      <h2 className="flex w-full text-4xl font-thin border-b border-gray-50
        p-2 mb-6 md:h-16">
        <span>Most Popular</span>
      </h2>
      <div className="flex flex-wrap overflow-y-auto md:overflow-hidden h-[540px] md:h-full justify-center">
        {!!popProdLoading && (
          <div className="flex w-full justify-center">
            <LoadingSpinner size={66}/>
          </div>
        )}
        {!!popularProducts && popularProducts.map(item => (
          <div className="flex relative flex-wrap md:w-48 md:h-96 p-2 justify-center
            w-40 h-96 group"
            key={item.id}>
            {!!isSignedIn && <>
              <input
                type="checkbox"
                name="popular"
                id={`popular/${item.id}`}
                className="hidden absolute peer z-30" />
              <label htmlFor={`popular/${item.id}`} className="absolute md:hidden w-full h-full z-30" />
              <div className="absolute flex invisible flex-col w-full h-full pt-12 items-center z-20
                md:group-hover:visible transition ease-in-out peer-checked:visible">
                {!!item.productLink &&
                  <>
                    <button className="bg-gray-800 w-24 h-10 rounded-full my-2">Go to link</button>
                  </>}
                <button
                  className="bg-gray-800 w-24 h-10 rounded-full my-2"
                  value={item.id}
                  onClick={handler}>
                  Add to list
                </button>
              </div>
              <Image
                src={item.image}
                height={365}
                width={262}
                alt={`${item.name} image`}
                className="rounded-xl md:w-[180px] md:h-[251px]
                md:group-hover:blur z-10 transition peer-checked:blur" 
              />
            </>}
            {!isSignedIn && <>
              <Image
                src={item.image}
                height={365}
                width={262}
                alt={`${item.name} image`}
                className="rounded-xl md:w-[180px] md:h-[251px]"
              />
            </>}
            <div className="flex h-20 font-thin">
              <span>{item.name}</span>
            </div>
            <div className="flex">
              <CheckDiscount priceStr={item.price} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

