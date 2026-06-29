import { useRef } from 'react';
import { getTranslation } from '../services/languageService';

/**
 * UploadDocument Component
 * Renders a secure document upload trigger button next to the chat input.
 * Supports PDF, DOCX, and TXT formats.
 */
function UploadDocument({ onUpload, disabled, language = 'en' }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'docx', 'txt'];

    if (!extension || !allowedExtensions.includes(extension)) {
      alert(getTranslation('unsupportedFileFormat', language));
      // Reset input
      e.target.value = '';
      return;
    }

    // Format file size
    let sizeStr;
    if (file.size < 1024) {
      sizeStr = `${file.size} B`;
    } else if (file.size < 1024 * 1024) {
      sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
    } else {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    // Capture current upload time
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Propagate document metadata
    onUpload({
      name: file.name,
      type: extension.toUpperCase(),
      size: sizeStr,
      time: timeStr
    });

    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  return (
    <div className="upload-document-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        disabled={disabled}
      />
      
      <button
        type="button"
        className="upload-document-btn"
        onClick={handleButtonClick}
        disabled={disabled}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          transition: 'all var(--transition-fast)'
        }}
        title={getTranslation('uploadCaseDoc', language)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </button>
    </div>
  );
}

export default UploadDocument;
