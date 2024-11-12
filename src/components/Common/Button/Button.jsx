import React from 'react';
import { Button } from 'react-bootstrap';

function CustomButton({ variant, onClick, children,className }) {
  return (
    <Button variant={variant} onClick={onClick} className={className}>
      {children}
    </Button>
  );
}

export default CustomButton;
