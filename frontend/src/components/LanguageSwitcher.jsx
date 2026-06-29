import { setCurrentLanguage } from '../services/languageService';

/**
 * LanguageSwitcher Component
 * Renders a drop-down selector styled to match the CrimeSphere theme.
 * Synchronizes with localStorage and updates parent application language states.
 */
function LanguageSwitcher({ value, onChange }) {
  const languages = [
    { code: 'auto', name: 'Auto Detect (स्वचालित)' },
    { code: 'en', name: 'English' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'ur', name: 'اردو (Urdu)' }
  ];

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setCurrentLanguage(selected);
    onChange(selected);
  };

  return (
    <div
      className="language-switcher-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '2px 8px'
      }}
    >
      <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>🌐 Lang:</span>
      <select
        value={value}
        onChange={handleLanguageChange}
        style={{
          backgroundColor: 'transparent',
          color: 'var(--text-color)',
          border: 'none',
          fontSize: '11.5px',
          fontWeight: '600',
          outline: 'none',
          cursor: 'pointer',
          padding: '4px 0'
        }}
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            style={{ backgroundColor: 'var(--card-color)' }}
          >
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSwitcher;
