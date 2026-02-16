import React from 'react';

interface HoneypotFieldProps {
    fieldName: string;
    fieldId: string;
    value: string;
    onChange: (value: string) => void;
}

export const HoneypotField: React.FC<HoneypotFieldProps> = ({
    fieldName,
    fieldId,
    value,
    onChange,
}) => {
    return (
        <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
            <label htmlFor={fieldId}>
                Please leave this field blank
            </label>
            <input
                type="text"
                name={fieldName}
                id={fieldId}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
            />
        </div>
    );
};
