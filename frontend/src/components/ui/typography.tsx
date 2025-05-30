import { twMerge } from "tailwind-merge";

export function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses =
    "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-inter";

  return <h1 className={twMerge(baseClasses, className)}>{children}</h1>;
}

export function TypographyH2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses =
    "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-inter";
  return <h2 className={twMerge(baseClasses, className)}>{children}</h2>;
}

export function TypographyH3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "scroll-m-20 text-2xl font-semibold tracking-tight font-inter";
  return <h3 className={twMerge(baseClasses, className)}>{children}</h3>;
}

export function TypographyH4({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "scroll-m-20 text-xl font-semibold tracking-tight font-inter";
  return <h4 className={twMerge(baseClasses, className)}>{children}</h4>;
}

export function TypographyP({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "leading-7 [&:not(:first-child)]:mt-6 font-inter";
  return <p className={twMerge(baseClasses, className)}>{children}</p>;
}

export function TypographyBlockquote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "mt-6 border-l-2 pl-6 italic font-inter";
  return (
    <blockquote className={twMerge(baseClasses, className)}>
      {children}
    </blockquote>
  );
}

export function TypographyInlineCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses =
    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold font-inter";
  return <code className={twMerge(baseClasses, className)}>{children}</code>;
}

export function TypographyLead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "text-xl text-muted-foreground font-inter";
  return <p className={twMerge(baseClasses, className)}>{children}</p>;
}

export function TypographyLarge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "text-lg font-semibold font-inter";
  return <div className={twMerge(baseClasses, className)}>{children}</div>;
}

export function TypographySmall({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "text-sm font-medium leading-none font-inter";
  return <small className={twMerge(baseClasses, className)}>{children}</small>;
}

export function TypographyMuted({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "text-sm text-muted-foreground font-inter";
  return <p className={twMerge(baseClasses, className)}>{children}</p>;
}
