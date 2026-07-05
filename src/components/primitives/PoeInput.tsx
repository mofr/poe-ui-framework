import React from 'react';
import './PoeInput.css';

// Text input. Renders a wrapper carrying the field frame with a borderless <input> inside, so it can
// host `leading`/`trailing` adornments (a search icon, a keyboard hint…). `ornate` swaps the plain inset
// frame for the extracted 9-slice raster frame.
export interface PoeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Use the ornate 9-slice raster frame instead of the plain inset field. */
  ornate?: boolean;
  /** Start adornment (icon, glyph). */
  leading?: React.ReactNode;
  /** End adornment (keyboard hint, action). */
  trailing?: React.ReactNode;
}

export function PoeInput({
  ornate = false, leading, trailing, className = '', style, disabled, ...props
}: PoeInputProps) {
  const classes = ['poe-input', ornate && 'poe-input--ornate', className].filter(Boolean).join(' ');
  return (
    <div className={classes} style={style} data-disabled={disabled || undefined}>
      {leading != null && <span className="poe-input__adornment poe-input__leading">{leading}</span>}
      <input className="poe-input__field" disabled={disabled} {...props} />
      {trailing != null && <span className="poe-input__adornment poe-input__trailing">{trailing}</span>}
    </div>
  );
}
