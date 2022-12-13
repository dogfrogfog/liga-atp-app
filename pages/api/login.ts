// https://github.com/instantcommerce/next-password-protect
// Step 2
import { loginHandler } from 'next-password-protect';

const password =
  process.env.ADMIN_PASSWORD ||
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default loginHandler(password as string, {
  cookieName: 'authorization',
});