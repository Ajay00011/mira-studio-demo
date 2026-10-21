import './Input.css';

export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error = '',
  helperText = '',
  disabled = false,
  autoComplete,
  maxLength,
  className = '',
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          <span>
            {label}
            {required && <span className="form-field__required" aria-hidden="true">*</span>}
          </span>
          {!required && <span className="form-field__optional">(Optional)</span>}
        </label>
      )}

      <div className="form-field__control-wrapper">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`form-field__input${error ? ' form-field__input--error' : ''}`}
          {...props}
        />
      </div>

      {error && (
        <span id={errorId} className="form-field__error-msg" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}

      {!error && helperText && (
        <span id={helperId} className="form-field__helper-msg">
          {helperText}
        </span>
      )}
    </div>
  );
}
