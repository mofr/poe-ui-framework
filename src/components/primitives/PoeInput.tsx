import React from 'react';

// Text input. `ornate` swaps the plain inset field for the extracted 9-slice frame
// (inputs/frame.png via .poe-input--ornate). Styling lives in poe-core.css (.poe-input).
export interface PoeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Use the ornate 9-slice frame instead of the plain inset field. */
  ornate?: boolean;
}

export function PoeInput({ ornate = false, className = '', ...props }: PoeInputProps) {
  const classes = ['poe-input', ornate && 'poe-input--ornate', className].filter(Boolean).join(' ');
  return <input className={classes} {...props} />;
}
