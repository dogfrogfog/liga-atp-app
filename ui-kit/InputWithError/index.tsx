import type { ReactNode } from 'react';

type InputWithErrorProps = {
  error?: any;
  children: ReactNode;
};

const InputWithError = ({ error, children }: InputWithErrorProps) => {
  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      {children}
      {!!error && (
        <span
          style={{ color: 'red', position: 'absolute', bottom: 0, left: 10 }}
        >
          {error.message || error.type}
        </span>
      )}
    </div>
  );
};

export default InputWithError;
