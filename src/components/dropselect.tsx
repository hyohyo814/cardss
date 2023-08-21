export default function AnimateDropdown() {
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

