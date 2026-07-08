import React from 'react';
import './PoeInput.css';

// Text input. Renders a wrapper carrying the field frame with a borderless <input> inside, so it can
// host `leading`/`trailing` adornments (a search icon, a keyboard hint…). `ornate` swaps the plain inset
// frame for the extracted 9-slice raster frame. In ornate mode the frame + integration halo are real
// sibling LAYERS (like PoePanel: integration z1 · content z2 · frame z3), so the multiply-blended halo
// can darken the page behind it instead of being buried under the field's own background.
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
      {ornate && <span className="poe-input__integration" aria-hidden="true" />}
      {ornate && <span className="poe-input__frame" aria-hidden="true" />}
      {leading != null && <span className="poe-input__adornment poe-input__leading">{leading}</span>}
      <input className="poe-input__field" disabled={disabled} {...props} />
      {trailing != null && <span className="poe-input__adornment poe-input__trailing">{trailing}</span>}
    </div>
  );
}
