import Image from "next/image";
import { siteConfig } from "@/data/site";

type BrandLogoProps = {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
  variant?: "green" | "light";
};

export function BrandLogo({
  className,
  decorative = false,
  priority = false,
  variant = "green"
}: BrandLogoProps) {
  const logo = variant === "light" ? siteConfig.brand.logoLight : siteConfig.brand.logo;

  return (
    <Image
      alt={decorative ? "" : logo.alt}
      className={className}
      height={logo.height}
      priority={priority}
      src={logo.src}
      width={logo.width}
    />
  );
}
