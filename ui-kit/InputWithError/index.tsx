import type { ReactNode } from 'react';

type InputWithErrorProps = {
  errorMessage?: any;
  children: ReactNode;
};

const InputWithError = ({ errorMessage, children }: InputWithErrorProps) => {
  return (
    <>
      {children}
      {errorMessage && <p>{errorMessage}</p>}
    </>
  );
};

export default InputWithError;
