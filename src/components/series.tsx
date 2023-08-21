import { type Series } from "@prisma/client";

export default function SeriesOptions({
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

