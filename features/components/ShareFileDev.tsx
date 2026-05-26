"use client";

import { getFileIcon, getIconFileName } from "@/packages/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatDevStore } from "../developer/chat/stores/useChatDevStore";
import { useShallow } from "zustand/shallow";
import { fileService } from "@/packages/features/services/file.service";
import { toast } from "sonner";
import { useFileStore } from "@/packages/features/stores/useFileStore";
import { useTranslations } from "next-intl";

export function ShareFileDev() {
  const tButton = useTranslations("Button");
  const tDiff = useTranslations("diff.shareFile");
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { selectedConver } = useChatDevStore(
    useShallow((state) => ({
      selectedConver: state.selectedConver,
    })),
  );
  const { getFilesForConversation, files } = useFileStore(
    useShallow((state) => ({
      getFilesForConversation: state.getFilesForConversation,
      files: state.files,
    })),
  );

  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedConver) return;

    try {
      setUploading(true);

      const response = await fileService.uploadFile(
        selectedFile,
        selectedConver.id,
      );

      if (response?.success) {
        toast.success("Upload file successfully!");
        getFilesForConversation(selectedConver.id);
      } else {
        toast.error(response?.message || "Failed to upload file.");
      }

      // Reset sau khi upload thành công
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const filteredFiles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return files;

    return files.filter((file) => {
      return (
        file.name.toLowerCase().includes(keyword) ||
        file.type?.toLowerCase().includes(keyword)
      );
    });
  }, [files, search]);

  useEffect(() => {
    if (!selectedConver) return;
    console.log("selectedConver", selectedConver);
    const fetchApi = async () => {
      await Promise.all([getFilesForConversation(selectedConver?.id)]);
    };
    fetchApi();
  }, [selectedConver?.id]);

  return (
    <div className="w-[320px] border-l bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{tDiff('title')}</h2>
        <p className="text-sm text-gray-500">
          {tDiff('description')}
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tButton('search')}
          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredFiles.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            {tDiff('empty')}
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="border rounded-xl p-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                    {getIconFileName(file.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate">
                      {file.name}
                    </h3>

                    <div className="text-xs text-gray-500 mt-1">
                      {(Number(file.size) / 1024 / 1024).toFixed(2)} MB
                    </div>

                    <div className="text-xs text-gray-400 mt-0.5">
                      {file.type}
                    </div>
                  </div>
                </div>

                <a
                  href={file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs hover:underline"
                >
                  {tButton('open')}
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Selected File */}
      {selectedFile && (
        <div className="border-t bg-gray-50 p-3">
          <p className="text-sm font-medium mb-2">{tDiff('filePreview')}</p>

          <div className="bg-white border rounded-lg p-3">
            <div className="flex gap-3">
              {selectedFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt={selectedFile.name}
                  className="w-14 h-14 rounded object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded bg-blue-100 flex items-center justify-center text-xl">
                  {getFileIcon(selectedFile)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {selectedFile.type || "Unknown type"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRemoveFile}
                disabled={uploading}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-100"
              >
                {tButton('remove')}
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm disabled:opacity-50"
              >
                {uploading ? tButton('uploading') : tButton('upload')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChooseFile}
      />

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          {selectedFile ? tButton('changeFile') : tButton('uploadDocument')}
        </button>
      </div>
    </div>
  );
}
