import { type EventWithTarget, type VisitOptions } from "@auaust/pont";
import { shouldHijackClick } from "@auaust/pont/toolkit";
import { F } from "@auaust/primitive-kit";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { usePont } from "src/contexts/PontContext.jsx";

export type LinkProps = ParentProps<
  VisitOptions & {
    href: string;
    as?: keyof JSX.IntrinsicElements;
  }
>;

export function Link(
  props: ParentProps<LinkProps> & JSX.IntrinsicElements["a"]
) {
  const pont = usePont();

  const [local, attributes] = splitProps(props, [
    "as",
    "children",
    "data",
    "headers",
    "href",
    "method",
    "params",
    "onClick",
  ]);

  const onClick = (event: EventWithTarget<MouseEvent>) => {
    F.call(local.onClick, null, event);

    if (!shouldHijackClick(event)) {
      return;
    }

    event.preventDefault();

    pont.visit(local.href, {
      method: local.method,
      data: local.data,
      headers: local.headers,
      params: local.params,
    });
  };

  return (
    <Dynamic
      {...attributes}
      component={local.as ?? "a"}
      href={local.href}
      children={local.children}
      onClick={onClick}
    />
  );
}
