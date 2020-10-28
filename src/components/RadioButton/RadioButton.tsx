import React, { HTMLAttributes } from 'react';
import cx from 'classnames';

export type RadioButtonProps = {
  id: string | number;
  text: string;
  value: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
} & Omit<HTMLAttributes<HTMLInputElement>, 'onChange'>;

/**
 * Component that wraps a native radio input element
 */
export function RadioButton({
  id,
  text,
  value,
  name,
  onChange,
  selected,
  disabled = false,
  className,
  ...props
}: RadioButtonProps) {
  return (
    <div className={cx('usa-radio', className)}>
      <input
        id={id}
        type="radio"
        className="usa-radio__input"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />
      <label className="usa-radio__label" htmlFor={id}>
        {text}
      </label>
    </div>
  );
}
