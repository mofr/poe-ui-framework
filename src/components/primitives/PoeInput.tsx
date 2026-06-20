import React from 'react';

// Text/search input. `ornate` swaps the plain inset field for the extracted 9-slice frame
// (buttons/input-frame.png via .poe-search--ornate). Styling lives in poe-core.css (.poe-search).
export interface PoeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Use the ornate 9-slice frame instead of the plain inset field. */
  ornate?: boolean;
}

export function PoeInput({ ornate = false, className = '', ...props }: PoeInputProps) {
  const classes = ['poe-search', ornate && 'poe-search--ornate', className].filter(Boolean).join(' ');
  return <input className={classes} {...props} />;
}
