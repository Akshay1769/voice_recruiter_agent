"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddCandidateModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, image_url: photoUrl || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error adding candidate:", data.error);
        alert("Failed to add candidate: " + data.error);
      } else {
        console.log("Candidate added:", data);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
      setOpen(false);
      setEmail("");
      setPhotoUrl("");
    }
  };

  return (
    <>
      <button
        id="open-add-candidate"
        className="hidden"
        onClick={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Candidate email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="text"
              placeholder="Photo URL (optional)"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                disabled={loading}
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={loading} onClick={handleSubmit}>
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
