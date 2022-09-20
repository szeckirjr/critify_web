import { NextPage } from "next";
import Link from "next/link";

const Login: NextPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </div>
  );
};

export default Login;
