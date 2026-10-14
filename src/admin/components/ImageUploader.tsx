/**
 * src/admin/components/ImageUploader.tsx
 * Drag-drop / tap-to-pick multi-image uploader (Block 7).
 *
 * The spec's upload flow, exactly:
 *   1. each file uploads IMMEDIATELY on select — not on form submit — so the
 *      owner sees the preview within seconds and knows the photo is safe
 *   2. files go frontend → backend (POST /v1/upload/product-image) → ImgBB.
 *      The ImgBB API key never exists in this repo (golden rule 8).
 *   3. the returned { url, thumbUrl } is held in the parent form's state until
 *      the product itself is saved.
 *
 * Client-side pre-checks (type + 5MB) mirror the backend's multer limits so a
 * bad file is rejected instantly without a wasted upload.
 */
import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Star, Trash2, X } from "lucide-react";
import { uploadProductImage } from "../services/admin.service";
import { apiErrorMessage } from "../../services/api";

/** What the parent form stores per image — exactly what POST /products accepts. */
export interface FormImage {
  url: string;
  thumbUrl: string;
  isPrimary: boolean;
}

interface PendingFile {
  id: string;
  name: string;
  status: "uploading" | "error";
  error?: string;
}

const MAX_IMAGES = 6; // matches backend MAX_IMAGES
const MAX_FILE_BYTES = 5 * 1024 * 1024; // matches backend multer limit
const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export function ImageUploader({
  images,
  onChange,
  nameHint,
  disabled = false,
  onBusyChange,
}: {
  images: FormImage[];
  onChange: (next: FormImage[]) => void;
  /** product name, used to label the file inside the ImgBB account */
  nameHint?: string;
  disabled?: boolean;
  /** lets the parent form block "Save" while uploads are in flight */
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const full = images.length >= MAX_IMAGES;
  const busy = pending.some((p) => p.status === "uploading");

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  // handleFiles appends sequentially while uploads are in flight — read and
  // write the freshest list through a ref so parallel uploads cannot overwrite
  // each other's results between React renders.
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const setPrimary = useCallback(
    (url: string) => {
      onChange(images.map((img) => ({ ...img, isPrimary: img.url === url })));
    },
    [images, onChange]
  );

  const removeImage = useCallback(
    (url: string) => {
      const next = images.filter((img) => img.url !== url);
      // Keep exactly one primary: if the primary was removed, promote the first.
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true };
      }
      onChange(next);
    },
    [images, onChange]
  );

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (disabled) return;
      const files = Array.from(fileList);
      for (const file of files) {
        const makeId = () => `${file.name}-${Date.now()}-${Math.random()}`;
        if (imagesRef.current.length >= MAX_IMAGES) {
          setPending((prev) => [
            ...prev,
            { id: makeId(), name: file.name, status: "error", error: `At most ${MAX_IMAGES} images per product — this one was skipped.` },
          ]);
          continue;
        }
        const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        const typeOk = ACCEPTED.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension);
        if (!typeOk) {
          setPending((prev) => [
            ...prev,
            { id: makeId(), name: file.name, status: "error", error: `Not an image (${file.type || extension || "unknown"}) — allowed: JPG, PNG, GIF, WebP.` },
          ]);
          continue;
        }
        if (file.size > MAX_FILE_BYTES) {
          setPending((prev) => [
            ...prev,
            { id: makeId(), name: file.name, status: "error", error: `Too large (${(file.size / 1024 / 1024).toFixed(1)}MB) — the limit is 5MB per photo.` },
          ]);
          continue;
        }
        const pendingId = makeId();
        setPending((prev) => [...prev, { id: pendingId, name: file.name, status: "uploading" }]);
        try {
          const uploaded = await uploadProductImage(file, nameHint);
          const current = imagesRef.current;
          const next = [
            ...current,
            {
              url: uploaded.url,
              thumbUrl: uploaded.thumbUrl || uploaded.url,
              // The very first photo of a product is its cover.
              isPrimary: current.length === 0,
            },
          ];
          imagesRef.current = next;
          onChange(next);
          setPending((prev) => prev.filter((p) => p.id !== pendingId));
        } catch (err) {
          setPending((prev) =>
            prev.map((p) => (p.id === pendingId ? { ...p, status: "error", error: apiErrorMessage(err) } : p))
          );
        }
      }
    },
    [disabled, nameHint, onChange]
  );

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) void handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="block text-[12.5px] font-bold text-maroon-950">
          Product photos <span className="font-medium text-[#8a6a73]">({images.length}/{MAX_IMAGES} — first photo is the cover)</span>
        </label>
        {busy && <span className="flex items-center gap-1 text-[12px] font-semibold text-maroon-800"><Loader2 className="h-3.5 w-3.5 animate-spin" /> uploading…</span>}
      </div>
      {/* previews of finished uploads */}
      {images.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
          {images.map((img) => (
            <li
              key={img.url}
              className={`group relative aspect-square overflow-hidden rounded-2xl border bg-cream-100 ${
                img.isPrimary ? "border-gold-500 ring-2 ring-gold-400/50" : "border-maroon-800/15"
              }`}
            >
              <img src={img.thumbUrl || img.url} alt="" className="h-full w-full object-cover" />
              {img.isPrimary && (
                <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-maroon-950 shadow">
                  <Star className="h-2.5 w-2.5 fill-current" /> Cover
                </span>
              )}
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-center gap-1.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(img.url)}
                    className="rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold text-maroon-900 shadow hover:bg-white"
                    title="Use as the cover photo"
                  >
                    ★ Make cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.url)}
                  disabled={disabled}
                  className="grid h-7 w-7 place-items-center rounded-full bg-white/95 text-red-600 shadow hover:bg-white disabled:opacity-50"
                  aria-label="Remove this photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* per-file status rows (uploading / rejected) */}
      {pending.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {pending.map((p) => (
            <li
              key={p.id}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] ${
                p.status === "uploading" ? "bg-cream-100 text-maroon-900" : "bg-red-50 text-red-700"
              }`}
            >
              {p.status === "uploading" ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              )}
              <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
              {p.status === "error" && (
                <>
                  <span className="hidden max-w-[55%] truncate sm:inline" title={p.error}>{p.error}</span>
                  <button
                    type="button"
                    onClick={() => setPending((prev) => prev.filter((x) => x.id !== p.id))}
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full hover:bg-red-100"
                    aria-label="Dismiss error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              )}
              {p.status === "uploading" && <span className="shrink-0 text-[11.5px] text-[#8a6a73]">compressing + uploading…</span>}
            </li>
          ))}
        </ul>
      )}
      {/* dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !full) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
          disabled || full
            ? "border-maroon-800/10 bg-cream-100/60 opacity-60"
            : dragOver
              ? "border-gold-500 bg-gold-50"
              : "border-maroon-800/20 bg-white hover:border-gold-500/60"
        }`}
      >
        {full ? (
          <p className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> All {MAX_IMAGES} photo slots used — remove one to add another.
          </p>
        ) : (
          <>
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-cream-100 text-maroon-800">
              <ImagePlus className="h-5 w-5" />
            </span>
            <p className="mt-2.5 text-[13.5px] font-semibold text-maroon-950">
              Drag photos here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="rounded-full bg-maroon-800 px-4 py-1.5 text-[12.5px] font-bold text-white transition hover:bg-maroon-700 disabled:opacity-50"
              >
                choose files
              </button>
            </p>
            <p className="mt-1.5 text-[11.5px] text-[#8a6a73]">
              JPG · PNG · GIF · WebP — up to 5MB each. Photos upload instantly and are compressed by the server.
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          multiple
          className="hidden"
          disabled={disabled || full}
          onChange={(e) => {
            if (e.target.files?.length) void handleFiles(e.target.files);
            e.target.value = ""; // allow re-picking the same file after an error
          }}
        />
      </div>
    </div>
  );
}
