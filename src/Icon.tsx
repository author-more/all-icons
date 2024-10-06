import { parseAttributes } from "./dataStructure";
import "./Icon.css";

type IconProps = {
  attributes: string;
  elements: string;
};

export default function Icon({ attributes, elements }: IconProps) {
  const { class: className, ...rest } = parseAttributes(attributes) || {};

  return (
    <svg
      className={className}
      {...rest}
      dangerouslySetInnerHTML={{ __html: elements }}
    />
  );
}
