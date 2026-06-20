import { useRef, useState } from "react";
import { Trash, Upload, User } from "lucide-react";

function ProfilePhotoSelector({ image, setImage, preview, setPreview }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const nextPreview = URL.createObjectURL(file);
      setPreviewUrl(nextPreview);
      if (setPreview) {
        setPreview(nextPreview);
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) {
      setPreview(null);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div dir="rtl" className="mb-6 flex justify-center">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="relative flex h-24 w-24 cursor-pointer items-center justify-center border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)]">
          <User className="h-10 w-10 text-[var(--rushd-muted)]" />
          <button
            type="button"
            className="absolute -bottom-2 -left-2 flex h-9 w-9 cursor-pointer items-center justify-center bg-[var(--rushd-accent)] text-[var(--rushd-ink)] shadow-lg transition hover:bg-[var(--rushd-accent-2)]"
            onClick={onChooseFile}
            aria-label="رفع صورة شخصية"
          >
            <Upload className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || previewUrl}
            alt="صورة المستخدم"
            className="h-24 w-24 border border-[var(--rushd-border)] object-cover"
          />
          <button
            className="absolute -bottom-2 -left-2 flex h-9 w-9 cursor-pointer items-center justify-center border border-[var(--rushd-danger-border)] bg-[var(--rushd-danger-bg)] text-[var(--rushd-danger-text)] transition hover:opacity-80"
            type="button"
            onClick={handleRemoveImage}
            aria-label="حذف الصورة"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoSelector;
