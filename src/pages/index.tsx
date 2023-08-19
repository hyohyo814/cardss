import Head from "next/head";
import Link from "next/link";
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
        <div key={res.id} className="flex p-1 font-light">
          <input
            className="peer hidden"
            id={res.id}
            name="title"
            type="radio"
            value={res.id}
            onChange={(e) => setSelectedSeries(e.target.value)}
          />
          <label
            className="break-word w-full peer-checked:bg-slate-900
                    md:hover:cursor-pointer md:hover:bg-slate-300
                    border-b border-gray-700"
            htmlFor={res.id}
          >
            {res.title}
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
        <div key={res.id} className="flex p-1 font-extralight">
          <input
            className="peer hidden"
            id={res.id}
            name="product"
            type="radio"
            value={res.id}
          />
          <label
            className="break-word w-full peer-checked:bg-slate-900
                    md:hover:cursor-pointer md:hover:bg-slate-300"
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

  return (
    <PageLayout>
      <div
        className="sticky top-0 z-50 flex h-14
        justify-between border-b border-gray-800 bg-black md:h-24"
      >
        <div className="flex items-end p-2 text-4xl font-semibold">CARDSS</div>
        <div id="user" className="flex p-4">
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && <SignOutButton />}
        </div>
      </div>
      <div id="container" className="mx-6 flex h-screen bg-black">
        <div
          id="selections-container"
          className="relative flex h-1/2 w-full
        flex-wrap"
        >
          <input id="selections-btn" type="checkbox" className="peer hidden" />
          <label
            htmlFor="selections-btn"
            className="z-40 flex h-[50px]
          w-full justify-center bg-black pt-3 md:hover:cursor-pointer"
          >
            ADD A PRODUCT
          </label>

          <div
            id="selections"
            className="absolute top-[-340px] z-30 flex w-full
          transition ease-in-out peer-checked:translate-y-[390px]"
          >
            <div
              className="flex h-96 w-1/2 flex-col
            bg-gray-800"
            >
              <legend className="z-25 flex bg-black font-semibold">
                Titles
              </legend>
              <div className="overflow-y-scroll">
                {!!seriesLoading && <LoadingSpinner />}
                {!seriesData && <div>NO DATA</div>}
                {seriesData && (
                  <SeriesOptions
                    seriesData={seriesData}
                    setSelectedSeries={setSelectedSeries}
                  />
                )}
              </div>
            </div>
            <div className="flex h-96 w-1/2 flex-col  bg-gray-800">
              <legend className="z-25 flex bg-black font-semibold">
                Products
              </legend>
              <div className="overflow-y-scroll">
                {!!productsLoading && (
                  <div className="">
                    <LoadingSpinner />
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
