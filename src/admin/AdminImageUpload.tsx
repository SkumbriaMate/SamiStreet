import { useState } from 'react';
import { uploadPublicWebsiteImage } from '../lib/storage';

type Props = {
  buildPath: (file: File) => string;
  /** Current saved URL — shown after upload or on load. */
  value?: string;
  onUrl: (url: string) => void;
  onError: (msg: string) => void;
  onBusyChange?: (busy: boolean) => void;
  /** File control accessible name (parent should not be `<label>` wrapping this component’s `<div>`). */
  uploadAriaLabel?: string;
};

/** Uploads through `POST /api/admin/storage/upload` (bucket `website-images` on server). */
export function AdminImageUpload({ buildPath, value, onUrl, onError, onBusyChange, uploadAriaLabel }: Props) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const setBusy = (b: boolean) => {
    setUploading(b);
    onBusyChange?.(b);
  };

  const preview = (localPreview || (value ?? '').trim() || null) as string | null;

  return (
    <div className="mt-2 space-y-2">
      {preview ? (
        <div className="overflow-hidden rounded border border-white/10 bg-black/50 p-2">
          <img src={preview} alt="" className="mx-auto max-h-44 w-auto max-w-full object-contain" />
        </div>
      ) : (
        <p className="text-[11px] text-muted">პრევიუ აქ გამოჩნდება ფაილის არჩევის ან შენახული სურათის შემდეგ.</p>
      )}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        aria-label={uploadAriaLabel ?? 'სურათის ატვირთვა'}
        className="block max-w-full text-xs text-muted file:mr-2 file:rounded file:border-0 file:bg-brand-green/20 file:px-2 file:py-1 file:text-xs file:text-cream disabled:opacity-50"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          const blobUrl = URL.createObjectURL(file);
          setLocalPreview(blobUrl);
          setBusy(true);
          try {
            const path = buildPath(file);
            const res = await uploadPublicWebsiteImage(path, file);
            if ('error' in res) {
              URL.revokeObjectURL(blobUrl);
              setLocalPreview(null);
              onError(res.error);
              return;
            }
            URL.revokeObjectURL(blobUrl);
            setLocalPreview(null);
            onUrl(res.publicUrl);
          } catch (err) {
            URL.revokeObjectURL(blobUrl);
            setLocalPreview(null);
            onError(err instanceof Error ? err.message : 'ატვირთვა ვერ მოხერხდა');
          } finally {
            setBusy(false);
          }
        }}
      />
      {uploading ? <p className="text-xs text-brand-green">იტვირთება სერვერზე…</p> : null}
    </div>
  );
}
