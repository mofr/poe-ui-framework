import React from 'react';

export function PoeButton({ children, className = '', ornate = false, ...props }) {
  const classes = ['poe-button', ornate && 'poe-button--ornate', className].filter(Boolean).join(' ');
  return <button className={classes} {...props}>{children}</button>;
}
