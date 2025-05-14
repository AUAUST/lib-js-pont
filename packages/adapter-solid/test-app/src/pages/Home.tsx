import { Link } from "@auaust/pont-adapter-solid";

export default function () {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>

      <Link href="/about">About</Link>
    </div>
  );
}
