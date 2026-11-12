import Link from "next/link";
import React from "react";
import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { isLoaded, isSignedIn } = useUser();
  return (
    <div className="fixed inset-x-0 top-0 bg-slate-100  z-[10] h-fit  py-4 ">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto">
        <div className="flex flex-row gap-3 justify-center">
          <Link href={"/dashboard"} className="flex items-center gap-2">
             <span>
              <img
                src="/Xhire.png"
                alt="Xhire Logo"
                className="w-8 h-8 rounded-sm"
              />
             </span>
             <span className="px-2 py-1 text-2xl font-bold text-black">
              X<span className="text-indigo-600">Hire</span>
             </span>
             <span className="text-[8px]">
             </span>
            {/* <p className="px-2 py-1 text-2xl font-bold text-black">X

              <span className="text-indigo-600">Hire</span>{" "}

              <span className="text-[8px]"></span>
            </p> */}
          </Link>
          <p className="my-auto text-xl"></p>
          {isSignedIn && <div className="my-auto">
            <OrganizationSwitcher
              afterCreateOrganizationUrl="/dashboard"
              hidePersonal={true}
              afterSelectOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
              appearance={{
                variables: {
                  fontSize: "0.9rem",
                },
              }}
            />
          </div>}
        </div>
        <div className="flex items-center">
          {isSignedIn ? <UserButton afterSignOutUrl="/dashboard" signInUrl="/sign-in" /> : isLoaded ? <Link href="/sign-in"><Button className="bg-indigo-600 hover:bg-indigo-700">Sign in / Register</Button></Link> : null}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
