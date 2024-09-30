import Link from "next/link";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/mickasmt/next-saas-stripe-starter",
    {
      ...(env.GITHUB_OAUTH_TOKEN && {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }),
      next: { revalidate: 3600 },
    },
  )
    .then((res) => res.json())
    .catch((e) => console.log(e));

  return (
      <section className="py-12 sm:py-20 lg:py-20 space-y-6 text-white">
        <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Boost your SEO with{" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            Veloseo
          </span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground">
          Automate your SEO. No expertise needed. Achieve better rankings and improve your online visibility with just a few clicks.
        </p>

        <div className="flex justify-center space-x-4 mt-6 bg-gradient_indigo-purple">
          <Link href="/pricing" className={cn(buttonVariants({ size: "lg", rounded: "full" }))}>
            <span>Start Now</span>
            <Icons.arrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
