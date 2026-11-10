
"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  useUser,
  SignInButton,
  CreateOrganization,
} from "@clerk/nextjs";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CreateInterviewModal from "@/components/dashboard/interview/createInterviewModal";
import Modal from "@/components/dashboard/Modal";

function CreateInterviewCard() {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<"interview" | "organization">("interview");

  const { isLoaded, isSignedIn } = useUser();

  const handleCardClick = () => {
    setIntent("interview");
    setOpen(true);
  };

  return (
    <>
      <Card
        className="flex items-center border-dashed border-gray-700 border-2 cursor-pointer hover:scale-105 ease-in-out duration-300 h-60 w-56 ml-1 mr-3 mt-4 rounded-xl shrink-0 overflow-hidden shadow-md"
        onClick={handleCardClick}
      >
        <CardContent className="flex items-center flex-col mx-auto">
          <div className="flex flex-col justify-center items-center w-full overflow-hidden">
            <Plus size={90} strokeWidth={0.5} className="text-gray-700" />
          </div>

          <CardTitle className="p-0 text-md text-center">
            Create an Interview
          </CardTitle>
        </CardContent>
      </Card>

      <Modal
        open={open}
        closeOnOutsideClick={false}
        onClose={() => setOpen(false)}
      >
        {!isLoaded ? (
          <div className="p-8 text-center">
            Checking authentication...
          </div>
        ) : !isSignedIn ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <Plus size={50} strokeWidth={1} className="text-gray-600" />

            <h2 className="text-xl font-semibold">
              Sign in to create an interview
            </h2>

            <p className="text-sm text-gray-500">
              You need to sign in to your account before creating
              interviews or setting up an organization.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <SignInButton mode="modal">
                <button
                  onClick={() => setIntent("interview")}
                  className="w-full rounded-md bg-black text-white py-2 px-4 hover:bg-gray-800"
                >
                  Sign In
                </button>
              </SignInButton>

              <SignInButton mode="modal">
                <button
                  onClick={() => setIntent("organization")}
                  className="w-full rounded-md border border-gray-300 py-2 px-4 hover:bg-gray-100"
                >
                  Create New Organization
                </button>
              </SignInButton>
            </div>
          </div>
        ) : intent === "organization" ? (
          <CreateOrganization />
        ) : (
          <CreateInterviewModal open={open} setOpen={setOpen} />
        )}
      </Modal>
    </>
  );
}

export default CreateInterviewCard;
