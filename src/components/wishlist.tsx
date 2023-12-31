import { api } from "~/utils/api";
import Image from "next/image";
import { LoadingSpinner } from "./loading";
import CheckDiscount from "./price";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function Wishlist() {
  const [targetProd, setTargetProd] = useState("");
  const { isSignedIn } = useUser();
  const { data: userWatchList, isLoading: watchListLoading } =
    api.users.getUserList.useQuery();
  const ctx = api.useContext();
  const { mutate, isLoading } = api.users.removeProduct.useMutation({
    onSuccess: () => {
      toast.success(`Successfully removed ${targetProd}`);
      void ctx.users.getUserList.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        console.error(errorMessage[0]!)
      } else {
        console.error('Failed to remove! Please try again later');
      }
    },
  });

  function checkOne(e: React.SyntheticEvent) {
    if (!e.target) {
      toast.error("Product information unavailable!");
      console.error('Wishlist()@wishlist.tsx: id missing from product');
    }
    const target = e.target as HTMLInputElement;
    const checkboxes = document.getElementsByClassName("wishlistoption") as HTMLCollectionOf<HTMLInputElement>;
    for (const checkbox of checkboxes) {
      if (checkbox.id !== target.id) {
        checkbox.checked = false;
      }
    }
    target.checked === true ? false : true
  };

  function handler(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!e.target) {
      toast.error('Product does not exist!');
      console.error('ProductOptions()@index.tsx: id missing from product');
    }
    const target = e.target as HTMLInputElement;
    setTargetProd(target.name);
    mutate({ productId: target.value });
  }

  if (!isSignedIn) {
    return <div />
  }

  return (
    <div className="w-full flex flex-wrap justify-center">
      <h2 className="flex w-full text-4xl font-thin border-b border-gray-50
        mb-6 p-2 md:h-16">
        <span>Wishlist</span>
      </h2>
      <div className="lg:grid-cols-5 grid-cols-2 grid h-[690px] overflow-x-hidden
        overflow-y-scroll md:h-full overscroll-none no-scrollbar">
        {!!watchListLoading && (
          <div className="flex w-full justify-center">
            <LoadingSpinner size={66} />
          </div>
        )}
        {!!userWatchList && userWatchList?.watchList.map(item => (
          <div className="flex relative flex-wrap md:w-48 md:h-96 p-2 group
            w-40 h-96"
            key={item.id} >
            <input
              type="checkbox"
              name="wishlist"
              id={`wishlist/${item.id}`}
              onChange={checkOne}
              className="wishlistoption hidden absolute peer" />
            <label htmlFor={`wishlist/${item.id}`} className="absolute md:hidden w-full h-full pr-4 z-30" />
            <div className="absolute left-8 flex invisible flex-col mt-6 items-center z-40
             md:group-hover:visible transition ease-in-out peer-checked:visible md:left-0 md:w-full">
              {!isLoading && (
                <>
                  {!!item.productLink &&
                    <a
                      className="bg-gray-800 w-24 h-10 rounded-full z-40 my-2
                      font-semibold flex justify-center items-center"
                      href={item.productLink}>
                      Go to link
                    </a>}
                  <button
                    className="bg-rose-500 w-24 h-10 rounded-full z-40 my-2"
                    value={item.id}
                    name={item.name}
                    onClick={handler}>
                    Remove
                  </button>
                </>)}
              {!!isLoading && (
                <div className="mt-6">
                  <LoadingSpinner size={48} />
                </div>
              )}
            </div>
            <Image
              src={item.image}
              height={365}
              width={262}
              alt={`${item.name} image`}
              className="rounded-xl md:w-[180px] md:h-[251px]
              md:group-hover:blur z-10 transition peer-checked:blur" />
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
  )
}

