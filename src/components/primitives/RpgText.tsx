import React from "react";

export type RpgTextVariant =
  | "pageTitle"
  | "profileName"
  | "subtitle"
  | "sectionTitle"
  | "panelTitle"
  | "navItem"
  | "bottomAction"
  | "body"
  | "bodySmall"
  | "code"
  | "statNumber"
  | "badge"
  | "link";

export type RpgTextTone =
  | "main"
  | "muted"
  | "white"
  | "gold"
  | "blue"
  | "green"
  | "red"
  | "purple";

export type RpgTextFx = "clean" | "soft" | "painted";

export type RpgTextProps<T extends React.ElementType = "span"> = {
  as?: T;
  variant?: RpgTextVariant;
  tone?: RpgTextTone;
  fx?: RpgTextFx;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

function classNames(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export function RpgText<T extends React.ElementType = "span">({
  as,
  variant = "body",
  tone,
  fx,
  className,
  children,
  ...rest
}: RpgTextProps<T>) {
  const Component = (as ?? "span") as React.ElementType;
  const textValue = typeof children === "string" ? children : undefined;

  const resolvedTone: RpgTextTone =
    tone ??
    (variant === "sectionTitle" || variant === "panelTitle" || variant === "navItem" || variant === "bottomAction"
      ? "gold"
      : variant === "code" || variant === "link" || variant === "subtitle"
        ? "blue"
        : "main");

  const resolvedFx: RpgTextFx =
    fx ??
    (variant === "sectionTitle" || variant === "panelTitle" || variant === "pageTitle" || variant === "profileName"
      ? "painted"
      : variant === "body" || variant === "bodySmall"
        ? "clean"
        : "soft");

  return (
    <Component
      className={classNames(
        "rpg-text",
        `rpg-text--${variant}`,
        `rpg-text--tone-${resolvedTone}`,
        `rpg-text--fx-${resolvedFx}`,
        className,
      )}
      data-rpg-text={textValue}
      {...rest}
    >
      {children}
    </Component>
  );
}
