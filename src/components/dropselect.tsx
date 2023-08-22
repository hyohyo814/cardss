export default function AnimateDropdown() {
  return (
    <>   
    <div className="absolute z-30 h-[50px] w-full bg-black" />
    <input id="selections-btn" type="checkbox" className="peer/selections-btn hidden" />
      <label
       htmlFor="selections-btn"
       className="relative z-40 flex h-[50px]
       w-full justify-center border-b
       pt-3 md:hover:cursor-pointer "
       ></label>
      <div className="absolute flex right-0 -top-20 justify-center w-full text-4xl z-30
        peer-checked/selections-btn:translate-y-20 transition scale-50">
        <span>&#9650;</span>
      </div>
      <div
       className="absolute -left-60 z-30
       pt-3 shadow-white
       transition peer-checked/selections-btn:translate-x-60
       font-semibold"
      >
        <span>COLLAPSE</span>
      </div>
      <div className="absolute flex right-0 justify-center w-full text-4xl z-30
        peer-checked/selections-btn:-translate-y-20 transition scale-50">
        <span>&#9660;</span>
      </div>
      <div
       className="absolute right-0 z-30
       pt-3 shadow-white
       transition peer-checked/selections-btn:translate-x-60
       font-semibold"
      >
        <span>ADD A PRODUCT</span>
    </div>
    </>
  )
}
