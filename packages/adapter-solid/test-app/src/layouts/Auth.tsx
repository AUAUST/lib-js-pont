import { ParentProps } from "solid-js";

export default function Auth(props: ParentProps) {
  return (
    <div>
      My Auth Layout
      <div>{props.children}</div>
    </div>
  );
}
