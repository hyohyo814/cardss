import { useState } from 'react';
import { api } from "~/utils/api";
import { LoadingSpinner } from './loading';
import ProductsOptions from './products';
import SeriesOptions from './series';

export default function DropdownSelections() {
  const [selectedSeries, setSelectedSeries] = useState("");
  const { data: seriesData, isLoading: seriesLoading } =
    api.series.getAll.useQuery();
  const { data: productsData, isLoading: productsLoading } =
    api.products.getFromSeries.useQuery({ seriesId: selectedSeries });

  return (
    <div className="flex w-full flex-wrap">
      <div
       className="flex md:h-96 md:w-1/2 flex-col
       bg-gray-800 w-full h-56 md:rounded-bl-xl"
      >
        <div className="flex bg-white text-black w-full text-2xl p-2
          relative border-2 border-white">
          <div className='absolute w-1/2 h-full top-0 -right-2
            bg-black skew-x-12'/>
          <div className='absolute w-1/2 h-full top-0 -right-2
            bg-black -skew-x-12'/>
          <span>Titles</span>
        </div>
        <div className="h-full overflow-y-scroll p-4">
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
      <div className="flex md:h-96 md:w-1/2 flex-col z-20
        bg-gray-800 w-full h-56 rounded-br-xl">
        <div className="flex bg-white text-2xl p-2 justify-end relative w-full
          text-black border-2 border-white">
          <div className='absolute w-1/2 h-full top-0 -left-2
            bg-black skew-x-12'/>
          <div className='absolute w-1/2 h-full top-0 -left-2
            bg-black -skew-x-12'/>
          <span>Products</span>
        </div>
        <div className="flex flex-col overflow-y-scroll w-full h-96 p-4">
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
  )
}

