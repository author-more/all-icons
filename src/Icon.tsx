import "./Icon.css";

type IconProps = {
  attributes: Record<string, string>;
  elements: string;
};

export default function Icon({ attributes, elements }: IconProps) {
  const { class: className, ...rest } = attributes || {};

  return (
    <svg
      className={className}
      {...rest}
      dangerouslySetInnerHTML={{ __html: elements }}
    />
  );
}
