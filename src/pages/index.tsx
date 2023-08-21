import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { type NextPage } from "next";
import React, { PropsWithChildren, useState } from "react";
import { PageLayout } from "~/components/layout";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { type Product, type Series } from "@prisma/client";

function SeriesOptions({
  seriesData,
  setSelectedSeries,
}: {
  seriesData: Series[];
  setSelectedSeries: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      {seriesData.map((res) => (
        <div key={res.id} className="flex font-light">
          <input
            className="peer hidden"
            id={res.id}
            name="title"
            type="radio"
            value={res.id}
            onChange={(e) => setSelectedSeries(e.target.value)}
          />
          <label
            className="break-word w-full border-b
            border-gray-700 p-1 peer-checked:bg-slate-300
            peer-checked:text-black md:hover:cursor-pointer md:hover:bg-slate-200 md:hover:text-black"
            htmlFor={res.id}
          >
            <span>{res.title}</span>
          </label>
        </div>
      ))}
    </>
  );
}

function ProductsOptions({ productsData }: { productsData: Product[] }) {
  const [productId, setProductId] = useState('');
  const { user } = useUser();
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

function AnimateDropdown() {
  return (
    <>   
    <div className="absolute z-30 h-[50px] w-full bg-black" />
    <input id="selections-btn" type="checkbox" className="peer/selections-btn hidden" />
      <label
       htmlFor="selections-btn"
       className="relative z-40 flex h-[50px]
       w-full justify-center border-b border-gray-600
       pt-3 md:hover:cursor-pointer "
       ></label>
      <div
       className="absolute -left-60 z-30
       pt-3 shadow-white
       transition peer-checked/selections-btn:translate-x-60
       md:peer-hover:animate-pulse
       md:peer-hover:text-shadow-lg"
      >
        <span>COLLAPSE</span>
      </div>
      <div
       className="absolute right-0 z-30
       pt-3 shadow-white
       transition peer-checked/selections-btn:translate-x-60
       md:peer-hover:animate-pulse
       md:peer-hover:text-shadow-lg"
      >
        <span>ADD A PRODUCT</span>
    </div>
    </>
  )
}

const Home: NextPage = () => {
  const [selectedSeries, setSelectedSeries] = useState("");
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();
  const { data: seriesData, isLoading: seriesLoading } =
    api.series.getAll.useQuery();
  const { data: productsData, isLoading: productsLoading } =
    api.products.getFromSeries.useQuery({ seriesId: selectedSeries });
  const { data: userWatchlist, isLoading: watchListLoading } =
    api.users.getUserList.useQuery();

  if (!userLoaded) return <LoadingPage />;

  const watchList = userWatchlist?.watchList;

  return (
    <PageLayout>
      <div
        className="sticky top-0 z-50 flex h-14
        justify-between border-b border-gray-300 bg-black md:h-24"
      >
        <div className="flex items-end px-6 py-2 text-4xl font-semibold">
          <span>CARDSS</span>
        </div>
        <div id="user" className="flex md:p-4">
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && <SignOutButton />}
          {!!isSignedIn && (
            <Image
              src={user.imageUrl}
              alt={`${user?.username}'s profile picture`}
              width={128}
              height={128}
              className="mx-5 my-2 h-10 w-10 rounded-full
            border border-gray-300 md:mx-6 md:h-14 md:w-14"
            />
          )}
        </div>
      </div>
      <div id="container" className="mx-6 flex h-screen bg-black md:mx-24
      flex-wrap relative">
        <div
         id="selections-container"
         className="relative flex h-1/2 w-full
         flex-wrap"
        >
          <AnimateDropdown />
          <div
           id="selections"
           className="absolute top-[-340px] z-10 flex w-full
           transition ease-in-out peer-checked/selections-btn:translate-y-[390px]"
          >
            <div
             className="flex h-96 w-1/2 flex-col
             bg-gray-800"
            >
              <legend className="flex bg-black text-xl font-semibold">
                Titles
              </legend>
              <div className="h-full overflow-y-scroll">
                {!seriesData ||
                  (!!seriesLoading && (
                    <div className="flex items-center justify-center pt-[24px]">
                      <LoadingSpinner size={36} />
                    </div>
                ))}
                {seriesData && (
                  <SeriesOptions
                    seriesData={seriesData}
                    setSelectedSeries={setSelectedSeries}
                  />
                )}
              </div>
            </div>
            <div className="flex h-96 w-1/2 flex-col z-20 bg-gray-800">
              <legend className="flex bg-black text-xl font-semibold">
                <span>Products</span>
              </legend>
              <div className="overflow-y-scroll">
                {!!productsLoading && (
                  <div className="flex items-center justify-center pt-[24px]">
                    <LoadingSpinner size={36} />
                  </div>
                )}
                {productsData && (
                  <ProductsOptions productsData={productsData} />
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-16 z-10 h-3/4 w-full bg-red-500
           peer-checked/selections-btn:translate-y-[480px] transition
           ease-in-out">
            HELLO
          </div>
        </div>
        <div className="flex flex-wrap z-20 w-full bg-black
        p-2 absolute top-[500px] h-1/2">
          <div className="flex w-full text-4xl font-thin border-b border-gray-50
          mb-6 p-2 md:h-16">
            <h2>Wishlist</h2>
          </div>
          <div className="items-start flex-wrap flex justify-between">
            {!!watchListLoading && (
              <div className="flex w-full justify-center">
                <LoadingSpinner size={66}/>
              </div>
            )}
            {!!watchList && watchList.map(item => (
              <div className="flex flex-wrap md:w-48 md:h-96 m-2 justify-center"
                key={item.id}
              >
                <Image
                  src={item.image}
                  height={365}
                  width={262}
                  alt={`${item.name} image`}
                  className="rounded-xl md:w-[180px] md:h-[251px]"
                />
                <div className="flex h-20">
                  <span>{item.name}</span>
                </div>
                <div>
                  <span>{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
