import { type PageProps } from "@auaust/pont";
import { Link } from "@auaust/pont-adapter-solid";

export default function (props: PageProps) {
  return (
    <div>
      <h1>About</h1>

      <pre>{JSON.stringify(props, null, 2)}</pre>

      <Link href="/">Home</Link>
    </div>
  );
}
