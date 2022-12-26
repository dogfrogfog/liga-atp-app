import type { ReactNode } from 'react';

type InputWithErrorProps = {
  errorMessage?: any;
  children: ReactNode;
};

const InputWithError = ({ errorMessage, children }: InputWithErrorProps) => {
  return (
    <>
      {children}
      {errorMessage && (
        <p style={{ margin: '5px 0', color: 'red' }}>{errorMessage}</p>
      )}
    </>
  );
};

export default InputWithError;
