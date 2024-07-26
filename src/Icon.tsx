import { parseAttributes } from "./dataStructure";

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
