import { hubHeaders } from "./hubSession";
"use client";

import {
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import {
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";

const MAX_FILE_SIZE =
  8 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ]);

type UploadResponse = {
  ok?: boolean;
  url?: string;
  error?: string;
};

type MediaUploaderProps = {
  label?: string;
  value?: string | null;
  accept?: string;
  helperText?: string;
  username?: string;
  onChange: (
    url: string | null,
    file?: File
  ) => void;
  previewHeight?: number;
  rounded?: number;
};

function normalizeUsername(
  value: string
) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, "");
}

export default function MediaUploader({
  label = "Upload image",
  value = null,
  accept =
    "image/jpeg,image/png,image/webp,image/gif,image/avif",
  helperText =
    "PNG, JPG, WEBP, GIF or AVIF",
  username = "",
  onChange,
  previewHeight = 170,
  rounded = 18,
}: MediaUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFile = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const normalizedUsername =
      normalizeUsername(username);

    if (!normalizedUsername) {
      setError(
        "Enter a Link Hub username before uploading."
      );
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.has(
        file.type
      )
    ) {
      setError(
        "Unsupported image type. Use JPG, PNG, WEBP, GIF, or AVIF."
      );
      return;
    }

    if (
      file.size <= 0
    ) {
      setError(
        "The selected image is empty."
      );
      return;
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      setError(
        "Image is too large. Maximum size is 8 MB."
      );
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "username",
        normalizedUsername
      );

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "/api/link-hub/upload",
          {
            method: "POST",
            body: formData,
            headers: hubHeaders(),
          }
        );

      let result: UploadResponse = {};

      try {
        result =
          (await response.json()) as UploadResponse;
      } catch {
        result = {};
      }

      if (
        !response.ok ||
        !result.ok ||
        !result.url
      ) {
        throw new Error(
          result.error ||
            "Could not upload that image."
        );
      }

      onChange(
        result.url,
        file
      );
    } catch (caughtError) {
      console.error(
        "Link Hub media upload failed:",
        caughtError
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not upload that image."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    setError("");
    onChange(null);
  };

  return (
    <div>
      {label && (
        <div className="mb-2 text-[11px] font-semibold text-black/40">
          {label}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={
          handleFile
        }
        className="hidden"
      />

      {!value ? (
        <button
          type="button"
          onClick={
            openPicker
          }
          disabled={
            isProcessing
          }
          className="flex w-full flex-col items-center justify-center border border-dashed border-black/15 bg-[#F7F3EB] p-5 text-center transition hover:border-[#6657FF] disabled:cursor-wait disabled:opacity-60"
          style={{
            minHeight:
              previewHeight,
            borderRadius:
              rounded,
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
            {isProcessing ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Upload
                size={18}
              />
            )}
          </div>

          <div className="mt-3 text-sm font-bold">
            {isProcessing
              ? "Uploading image..."
              : "Choose image"}
          </div>

          <div className="mt-1 text-[10px] leading-4 text-black/35">
            {helperText}
          </div>
        </button>
      ) : (
        <div
          className="relative overflow-hidden border border-black/10 bg-[#F3EFE7]"
          style={{
            borderRadius:
              rounded,
          }}
        >
          <img
            src={value}
            alt="Uploaded media"
            className="w-full object-cover"
            style={{
              height:
                previewHeight,
            }}
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-3 pt-10">
            <button
              type="button"
              onClick={
                openPicker
              }
              disabled={
                isProcessing
              }
              className="rounded-full bg-white px-4 py-2 text-[11px] font-bold text-black disabled:cursor-wait disabled:opacity-70"
            >
              {isProcessing
                ? "Uploading..."
                : "Replace"}
            </button>

            <button
              type="button"
              onClick={
                removeImage
              }
              disabled={
                isProcessing
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur disabled:opacity-50"
              aria-label="Remove image"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-[11px] font-semibold text-red-600">
          {error}
        </div>
      )}

      {!value &&
        !error &&
        !isProcessing && (
          <div className="mt-2 flex items-center gap-2 text-[10px] text-black/30">
            <ImageIcon
              size={12}
            />

            Image uploads to secure
            storage before saving.
          </div>
        )}
    </div>
  );
}
