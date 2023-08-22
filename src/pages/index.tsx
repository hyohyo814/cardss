import Image from "next/image";
import { type NextPage } from "next";
import React from "react";
import { PageLayout } from "~/components/layout";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import AnimateDropdown from "~/components/dropselect"; 
import PopularProducts from "~/components/popular";
import Wishlist from "~/components/wishlist";
import DropdownSelections from "~/components/selections";
import { LoadingPage } from "~/components/loading";

const Home: NextPage = () => {
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return <LoadingPage />;

  return (
    <PageLayout>
      <div className="sticky top-0 z-50 flex h-14 justify-between
        -gray-300 bg-black md:h-24 border-b">
        <div className="flex items-end px-6 py-2 text-4xl font-semibold">
          <span>CARDSS</span>
        </div>
        <div id="user" className="flex md:p-4">
          {!isSignedIn && <SignInButton />}
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
      <div id="container" className="mx-6 flex h-min-screen bg-black md:mx-24
      flex-wrap relative">
        <div
         id="selections-container"
         className="relative flex h-1/2 w-full
         flex-wrap">
          <AnimateDropdown />
          <div
           id="selections"
           className="absolute top-[-340px] z-10 flex w-full
           transition ease-in-out peer-checked/selections-btn:translate-y-[390px]">
            <DropdownSelections />
          </div>
          <div className="absolute top-16 z-10 w-full bg-black
           peer-checked/selections-btn:translate-y-[480px] transition
           ease-in-out flex flex-wrap justify-center">
            <PopularProducts />
          </div>
        </div>
        <div className="flex flex-col z-20 w-full bg-black
        p-2 absolute top-[550px] h-screen">
          <Wishlist />
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
