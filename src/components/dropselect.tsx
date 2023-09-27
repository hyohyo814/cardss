export default function AnimateDropdown() {
  return (
    <>
      <div className="absolute z-30 h-[50px] w-full bg-black" />
      <input
        id="selections-btn"
        type="checkbox"
        className="peer/selections-btn hidden" />
      <label
        htmlFor="selections-btn"
        className="relative z-40 flex h-[50px]
       w-full justify-center border-b
       pt-3 md:hover:cursor-pointer " />
      <div
        className="absolute -left-60 z-30
       pt-3 text-black transition peer-checked/selections-btn:translate-x-60
       font-semibold peer-checked/selections-btn:bg-white duration-500
       h-[50px] px-6 rounded-br-3xl ease-in-out">
        <span>COLLAPSE</span>
      </div>
      <div className="absolute flex right-0 justify-center w-full text-4xl z-30
        peer-checked/selections-btn:rotate-180 transition scale-50 -top-3
        md:visible invisible">
        <span>&#9660;</span>
      </div>
      <div
        className="absolute right-0 z-30
       pt-3 text-black transition peer-checked/selections-btn:translate-x-60
       font-semibold peer-checked/selections-btn:bg-transparent duration-500
       h-[50px] px-6 rounded-bl-3xl bg-white ease-in-out">
        <span>ADD A PRODUCT</span>
      </div>
    </>
  )
}

