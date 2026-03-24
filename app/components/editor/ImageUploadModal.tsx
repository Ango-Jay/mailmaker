"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ResponsiveModal } from "@/app/components/ui/Modal";
import { useImageUploadModalStore } from "@/lib/editor/image-upload-modal-store";
import { useTemplateStore } from "@/lib/editor/template-store";

const ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
};
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export function ImageUploadModal() {
  const { isOpen, mode, blockId, columnAddContext, imageColumnContext, close } =
    useImageUploadModalStore();
  const { addBlock, updateBlock, addColumnChild, updateColumnChild } =
    useTemplateStore();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0] ?? null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled: loading,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message ?? "File not accepted";
      setError(msg);
    },
  });

  const handleProceed = async () => {
    if (!file) {
      setError("Select an image first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }
      const url = data.url;
      if (!url) throw new Error("No URL returned");

      if (columnAddContext) {
        addColumnChild(columnAddContext.columnsBlockId, columnAddContext.columnIndex, {
          type: "image",
          src: url,
          alt: "",
          width: "100%",
        });
      } else if (imageColumnContext) {
        updateColumnChild(
          imageColumnContext.columnsBlockId,
          imageColumnContext.columnIndex,
          imageColumnContext.childId,
          { src: url },
        );
      } else if (mode === "add") {
        addBlock({
          type: "image",
          src: url,
          alt: "",
          width: "100%",
        });
      } else if (mode === "edit" && blockId) {
        updateBlock(blockId, { src: url });
      }
      setFile(null);
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setError(null);
      close();
    }
  };

  const modalTitle = columnAddContext
    ? "Add image to column"
    : imageColumnContext
      ? "Change column image"
      : mode === "add"
        ? "Add image"
        : "Change image";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      width={420}
      radius={16}
    >
      <div className="space-y-4 pb-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-accent bg-accent/10"
              : "border-white/20 hover:border-white/40 bg-white/5"
          } ${loading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <p className="text-sm text-white/90 truncate">{file.name}</p>
          ) : (
            <p className="text-sm text-white/60">
              {isDragActive ? "Drop the image here" : "Drag an image here or click to select"}
            </p>
          )}
          <p className="text-xs text-white/40 mt-1">JPEG, PNG, GIF, WebP · max 10 MB</p>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="grow px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProceed}
            disabled={!file || loading}
            className="grow px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Uploading…" : "Proceed"}
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
