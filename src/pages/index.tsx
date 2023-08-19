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
            className="break-word w-full peer-checked:bg-slate-300
            md:hover:cursor-pointer md:hover:bg-slate-200 peer-checked:text-black
            border-b md:hover:text-black border-gray-700 p-1"
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
          />
          <label
            className="break-word w-full peer-checked:bg-slate-300
            md:hover:cursor-pointer md:hover:bg-slate-200 peer-checked:text-black
            border-b md:hover:text-black border-gray-700 p-1"
            htmlFor={res.id}
          >
            {res.name}
          </label>
        </div>
      ))}
    </>
  );
}


const Home: NextPage = () => {
  const [selectedSeries, setSelectedSeries] = useState("");
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();
  const { data: seriesData, isLoading: seriesLoading } =
    api.series.getAll.useQuery();
  const { data: productsData, isLoading: productsLoading } =
    api.products.getFromSeries.useQuery({ seriesId: selectedSeries });

  if (!userLoaded) return <LoadingPage />;

  console.log(user?.imageUrl);

  return (
    <PageLayout>
      <div
        className="sticky top-0 z-50 flex h-14
        justify-between border-b border-gray-300 bg-black md:h-24"
      >
        <div className="flex items-end px-6 py-2 text-4xl font-semibold">
          <span>CARDSS</span>
        </div>
        <div id="user" className="flex p-4">
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && <SignOutButton />}
          {!!isSignedIn && <Image
            src={user.imageUrl}
            alt={`${user?.username}'s profile picture`}
            width={64}
            height={64}
            className="rounded-full mx-6"
          />}
        </div>
      </div>
      <div id="container" className="mx-6 flex h-screen bg-black">
        <div
          id="selections-container"
          className="relative flex h-1/2 w-full
        flex-wrap"
        >
          <div className="absolute z-30 h-[50px] w-full bg-black" />
          <input id="selections-btn" type="checkbox" className="peer hidden" />
          <label
            htmlFor="selections-btn"
            className="relative z-40 flex h-[50px]
            w-full justify-center pt-3 md:hover:cursor-pointer
            border-b border-gray-600 "
          >
          </label>
            <div className="absolute z-30 -left-40
            peer-checked:translate-x-40 transition
            pt-3 md:peer-hover:animate-pulse
            md:peer-hover:text-shadow-lg
            shadow-white">
              <span>COLLAPSE</span>
            </div>
            <div className="absolute z-30 right-0
            peer-checked:translate-x-40 transition
            pt-3 md:peer-hover:animate-pulse
            md:peer-hover:text-shadow-lg
            shadow-white">
              <span>ADD A PRODUCT</span>
            </div>
          
          <div
            id="selections"
            className="absolute top-[-340px] z-10 flex w-full
          transition ease-in-out peer-checked:translate-y-[390px]"
          >
            <div
              className="flex h-96 w-1/2 flex-col
            bg-gray-800"
            >
              <legend className="flex bg-black font-semibold text-xl">
                Titles
              </legend>
              <div className="overflow-y-scroll h-full">
                {!seriesData || !!seriesLoading &&
                  <div className="flex pt-[24px] justify-center items-center">
                    <LoadingSpinner size={36} />
                  </div>}
                {seriesData && (
                  <SeriesOptions
                    seriesData={seriesData}
                    setSelectedSeries={setSelectedSeries}
                  />
                )}
              </div>
            </div>
            <div className="flex h-96 w-1/2 flex-col  bg-gray-800">
              <legend className="flex bg-black font-semibold text-xl">
                <span>Products</span>
              </legend>
              <div className="overflow-y-scroll">
                {!!productsLoading && (
                  <div className="flex pt-[24px] justify-center items-center">
                    <LoadingSpinner size={36} />
                  </div>
                )}
                {productsData && (
                  <ProductsOptions productsData={productsData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
