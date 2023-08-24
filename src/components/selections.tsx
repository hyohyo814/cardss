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

  function seriesHandle(e: React.SyntheticEvent) {
    e.preventDefault();
    const seriesElements = document.getElementsByClassName('series_item') as HTMLCollectionOf<HTMLDivElement>;
    const { value } = e.target as HTMLInputElement
    if (!value) {
      for (const el of seriesElements) {
        el.style.display = 'flex';
      }
    }
    if (value && value !== null) {
      for (const el of seriesElements) {
        el.style.display = 'flex';
        if (!el.id.toLowerCase().includes(value.toLowerCase())) {
          el.style.display = 'none';
        }
      }
    }
  }

  function productsHandle(e: React.SyntheticEvent) {
    e.preventDefault();
    const productsElements = document.getElementsByClassName('product_item') as HTMLCollectionOf<HTMLDivElement>;
    const { value } = e.target as HTMLInputElement
    if (!value) {
      for (const el of productsElements) {
        el.style.display = 'flex';
      }
    }
    if (value && value !== null) {
      for (const el of productsElements) {
        el.style.display = 'flex';
        if (!el.id.toLowerCase().includes(value.toLowerCase())) {
          el.style.display = 'none';
        }
      }
    }
  }

  return (
    <div className="flex w-full flex-wrap">
      <div className="flex md:h-[450px] md:w-1/2 flex-col
       bg-gray-800 w-full h-56 md:rounded-bl-xl">
        <div className="flex bg-white text-black w-full text-2xl px-2
          border-2 border-white">
          <span>Titles</span>
          <div className='w-full h-full
            bg-black rounded-xl mx-4 flex items-center'>
            <input
              placeholder="Search by series..."
              onChange={seriesHandle}
              className='h-full w-full bg-transparent px-6
              text-white text-sm font-light rounded-xl
              text-center' />
          </div>
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
              setSelectedSeries={setSelectedSeries} />
          )}
        </div>
      </div>
      <div className="flex md:h-[450px] md:w-1/2 flex-col z-20
        bg-gray-800 w-full h-96 rounded-br-xl">
        <div className="flex bg-white text-2xl px-2 relative w-full
          text-black border-2 border-white">
          <div className='h-full mx-4
            bg-black rounded-xl grow flex items-center'>
            <input
              placeholder="Search by serial..."
              onChange={productsHandle}
              className='h-full w-full bg-transparent px-6
              text-white text-sm font-light rounded-xl
              text-center' />
          </div>
          <span>Products</span>
        </div>
        <div className="flex flex-col snap-y snap-mandatory overflow-y-scroll h-full w-full p-4">
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

