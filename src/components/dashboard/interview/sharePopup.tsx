"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/dashboard/Modal";

interface SharePopupProps {
  open: boolean;
  onClose: () => void;
  shareContent: string;
}

function SharePopup({ open, onClose, shareContent }: SharePopupProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [url, setUrl] = useState<string>("Loading...");
  const [activeTab, setActiveTab] = useState("mail");

  // Gmail email input
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (shareContent) {
      setUrl(shareContent);
    }
  }, [shareContent]);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopiedLink(true);
        toast.success("The link has been copied to your clipboard.", {
          position: "bottom-right",
          duration: 3000,
        });

        setTimeout(() => setCopiedLink(false), 2000);
        setTimeout(() => onClose(), 1000);
      },
      (err) => console.error("Failed to copy", err.message)
    );
  };

  const shareViaGmail = () => {
    if (!email) {
      toast.error("Please enter a recipient email address.");

      return;
    }

    const subject = encodeURIComponent("Your Interview / Exam Link");
    const body = encodeURIComponent(
      `Hello,

This is your interview/exam link:

${url}

Please make sure you join on time.
If you have any questions, feel free to reach out.

Best regards.`
    );

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Modal closeOnOutsideClick={false} open={open} onClose={onClose}>
      <div className="w-[28rem] flex flex-col">
        <p className="text-lg font-semibold mb-4">Share via:</p>
        <Tabs
          className="flex flex-col h-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="mail">Gmail</TabsTrigger>
            <TabsTrigger value="copy">URL</TabsTrigger>
          </TabsList>

          {/* Gmail tab */}
          <TabsContent className="w-full" value="mail">
            <div className="mb-4">
              <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter recipient email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              className="flex items-center bg-indigo-600"
              onClick={shareViaGmail}
            >
              <Mail className="mr-2" size={16} />
              Share via Gmail
            </Button>
          </TabsContent>

          {/* Copy URL tab */}
          <TabsContent className="w-full" value="copy">
            <div className="mb-4">
              <input
                className="w-full p-2 border border-gray-300 bg-gray-100 rounded"
                type="text"
                value={url}
                readOnly
              />
            </div>
            <Button
              className="flex items-center bg-indigo-600"
              onClick={copyLinkToClipboard}
            >
              <div className="flex items-center">
                <Copy className="mr-2" size={16} />
                {copiedLink ? "Copied" : "Copy URL"}
              </div>
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}

export default SharePopup;
