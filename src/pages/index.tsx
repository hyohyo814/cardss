import Image from "next/image";
import { type NextPage } from "next";
import React from "react";
import { PageLayout } from "~/components/layout";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import AnimateDropdown from "~/components/dropselect";
import PopularProducts from "~/components/popular";
import Wishlist from "~/components/wishlist";
import DropdownSelections from "~/components/selections";

const Home: NextPage = () => {
  const { user, isSignedIn } = useUser();

  return (
    <PageLayout>
      <div className="sticky top-0 z-50 flex h-14 justify-between
        -gray-300 bg-black md:h-24 border-b">
        <div className="flex items-end px-6 py-2 text-4xl font-semibold">
          <span>CARDSS</span>
        </div>
        <div id="user" className="flex md:p-4">
          {!!isSignedIn && <SignOutButton />}
          {!!isSignedIn && (
            <Image
              src={user.imageUrl}
              alt={`${user?.username}'s profile picture`}
              width={128}
              height={128}
              className="mx-5 my-2 h-10 w-10 rounded-full
              border border-gray-300 md:mx-6 md:h-14 md:w-14" />
          )}
        </div>
      </div>
      <div id="container" className="flex h-screen bg-black xl:mx-60
      flex-wrap relative items-start">
        <div
          id="selections-container"
          className="relative flex w-full
         flex-wrap">
          {!!isSignedIn && <>
            <AnimateDropdown />
            <div
              id="selections"
              className="absolute 2xl:top-[-420px] top-[-560px] z-10 flex w-full
             transition ease-in-out 2xl:peer-checked/selections-btn:translate-y-[500px]
             peer-checked/selections-btn:translate-y-[620px] duration-500
             peer-checked/selections-btn:visible invisible">
              <DropdownSelections />
            </div>
          </>}
          <div className="2xl:top-16 z-10 w-full bg-black
           2xl:peer-checked/selections-btn:translate-y-[480px] transition
           ease-in-out flex flex-wrap justify-center duration-500
           peer-checked/selections-btn:translate-y-[640px] p-2">
            <PopularProducts />
          </div>
        </div>
        {!isSignedIn &&
          <div className="w-full justify-center flex my-6">
            <SignInButton>
              <button className="flex md:text-4xl md:w-1/2 justify-center
                h-36 rounded-xl items-center bg-slate-950/80 border cursor-pointer
                md:hover:bg-white md:hover:text-black transition duration-500
                md:hover:scale-110 font-light text-2xl hover:bg-white hover:text-black w-3/4">
                Sign in to use Wishlist
              </button>
            </SignInButton>
          </div>}
        {!!isSignedIn && <div className="flex flex-col z-20 w-full bg-black
        p-2 absolute 2xl:top-[550px] top-[700px] md:h-[480px]">
          <Wishlist />
        </div>}
      </div>
    </PageLayout>
  );
};

export default Home;
