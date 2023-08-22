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
       bg-gray-800 w-full h-60"
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
      <div className="flex md:h-96 md:w-1/2 flex-col z-20
        bg-gray-800 w-full h-60">
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
  )
}

