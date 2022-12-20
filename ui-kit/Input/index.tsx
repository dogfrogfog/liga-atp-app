import type { ChangeEvent } from 'react';

interface IInputProps {
  className?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = (props: IInputProps) => {
  return <input {...props} />;
};

export default Input;
