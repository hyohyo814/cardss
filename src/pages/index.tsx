import Head from "next/head";
import Link from "next/link";
import { type NextPage } from "next";
import React, { useState } from "react";
import { PageLayout } from "~/components/layout";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";


const Home: NextPage = () => {
  const {user, isSignedIn, isLoaded: userLoaded} = useUser();

  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="sticky top-0 z-50 flex h-14 items-center
        border-b border-gray-800 md:h-24">
          <div className="flex w-full justify-between">
            {!isSignedIn && <SignInButton />}
            {!!isSignedIn && <SignOutButton />}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

export default Home;
