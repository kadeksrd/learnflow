"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Link, X, Image as ImageIcon, Loader } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  /** Current image URL */
  value: string;
  /** Called with new URL after upload or URL input */
  onChange: (url: string) => void;
  /** Label shown above the uploader */
  label?: string;
  /** Bucket folder (e.g. 'products', 'testimonials') */
  folder?: string;
  /** Aspect ratio for preview: 'video' (16:9), 'square' (1:1), 'landscape' (3:2) */
  aspect?: "video" | "square" | "landscape" | "avatar";
  /** Hint text shown below */
  hint?: string;
  /** Allow removing image */
  clearable?: boolean;
}

const ASPECT_CLASSES = {
  video: "aspect-video",
  square: "aspect-square",
  landscape: "aspect-[3/2]",
  avatar: "aspect-square max-w-[140px]",
};

export function ImageUploader({
  value,
  onChange,
  label,
  folder = "misc",
  aspect = "landscape",
  hint,
  clearable = true,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const upload = useCallback(
    async (file: File) => {
      // 1. Validasi Dasar
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar (JPG, PNG, WebP, GIF)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }

      setUploading(true);
      setError(null);

      // 2. Bersihkan Nama File (Hapus spasi & karakter aneh)
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeFileName = file.name
        .split(".")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-") // Ganti karakter non-alfanumerik dengan strip
        .substring(0, 20); // Jangan kepanjangan

      // Path: folder/timestamp-nama.ext
      const filePath = `${folder}/${Date.now()}-${safeFileName}.${ext}`;

      // 3. Eksekusi Upload
      // PASTIKAN 'thumbnails' adalah nama bucket yang ada di Dashboard Supabase kamu!
      const { error: uploadErr } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadErr) {
        // Jika masih error RLS, artinya Policy di Storage Dashboard belum dibuat
        setError(`Upload gagal: ${uploadErr.message}`);
        setUploading(false);
        return;
      }

      // 4. Ambil Public URL
      const { data } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        onChange(data.publicUrl);
        setShowUrlInput(false);
      } else {
        setError("Gagal mendapatkan URL publik gambar.");
      }

      setUploading(false);
    },
    [folder, onChange, supabase],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload],
  );

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput); // validate URL
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
      setError(null);
    } catch {
      setError("URL tidak valid. Gunakan format https://...");
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {/* Preview area */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-2 transition-all duration-200",
          ASPECT_CLASSES[aspect],
          dragging
            ? "border-accent bg-accent/10 scale-[0.99]"
            : "border-white/[0.08]",
          !value && "bg-surface cursor-pointer",
          value && "cursor-default",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !value && fileRef.current?.click()}
      >
        {value ? (
          <>
            {/* Image preview */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() =>
                setError("Gambar tidak bisa dimuat. Coba URL lain.")
              }
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileRef.current?.click();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-xs font-semibold transition-all"
              >
                <Upload size={13} /> Ganti
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUrlInput((p) => !p);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-xs font-semibold transition-all"
              >
                <Link size={13} /> URL
              </button>
              {clearable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                    setError(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-500/40 hover:bg-red-500/60 backdrop-blur-sm rounded-xl text-white text-xs font-semibold transition-all"
                >
                  <X size={13} /> Hapus
                </button>
              )}
            </div>

            {/* Loading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Loader size={28} className="text-accent animate-spin" />
                <span className="text-sm text-text-muted">Mengupload...</span>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
            {uploading ? (
              <>
                <Loader size={32} className="text-accent animate-spin" />
                <span className="text-sm text-text-muted">Mengupload...</span>
              </>
            ) : (
              <>
                <div
                  className={cn(
                    "rounded-2xl flex items-center justify-center transition-all",
                    dragging
                      ? "w-16 h-16 bg-accent/20"
                      : "w-14 h-14 bg-white/5",
                  )}
                >
                  {dragging ? (
                    <Upload size={24} className="text-accent" />
                  ) : (
                    <ImageIcon size={22} className="text-text-dim" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-text-muted">
                    {dragging
                      ? "Lepaskan untuk upload"
                      : "Klik atau drag & drop"}
                  </p>
                  <p className="text-xs text-text-dim mt-1">
                    JPG, PNG, WebP · Maks 5MB
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-xs text-accent-light font-semibold">
                    Upload File
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUrlInput((p) => !p);
                    }}
                    className="px-3 py-1.5 bg-white/5 border border-white/[0.07] rounded-lg text-xs text-text-muted hover:text-[#EEEEFF] font-semibold transition-all"
                  >
                    Dari URL
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL input panel */}
      {showUrlInput && (
        <div className="mt-2 p-3 bg-surface border border-white/[0.07] rounded-xl flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            autoFocus
            className="flex-1 bg-transparent text-sm text-[#EEEEFF] placeholder:text-text-dim outline-none"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-1 bg-accent rounded-lg text-white text-xs font-semibold hover:bg-accent-light transition-all"
          >
            Pakai
          </button>
          <button
            type="button"
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput("");
            }}
            className="px-2 text-text-muted hover:text-[#EEEEFF] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <X size={11} /> {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && <p className="mt-1.5 text-xs text-text-dim">{hint}</p>}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = ""; // reset so same file can be re-selected
        }}
      />
    </div>
  );
}
