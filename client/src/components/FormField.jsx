import React from 'react';

const FormField = ({ label, type = "text", name, value, onChange, onBlur, error, options, required, placeholder }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>
                {label} {required && <span className="required">*</span>}
            </label>

            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={error ? 'input-error' : ''}
                    rows="5"
                />
            ) : type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={error ? 'input-error' : ''}
                >
                    <option value="">Select a subject</option>
                    {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={error ? 'input-error' : ''}
                />
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default FormField;
