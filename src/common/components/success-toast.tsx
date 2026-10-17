"use client";

import { useEffect } from "react";
import { toast } from "@/src/common/context/toast-context";

interface SuccessToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function SuccessToast({
  title,
  description,
  onClose,
}: SuccessToastProps) {
  useEffect(() => {
    toast.success(description, title);
    onClose();
  }, [title, description, onClose]);

  return null;
}
