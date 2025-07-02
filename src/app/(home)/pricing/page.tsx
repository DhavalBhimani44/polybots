"use client";

import { Pricing, PricingPlan } from "@/components/pricing";
import Image from "next/image";

const demoPlans: PricingPlan[] = [
  {
    name: "STARTER",
    price: "49",
    yearlyPrice: "39",
    period: "per month",
    features: [
      "5 monthly credits",
      "Basic analytics",
      "Public Projects",
    ],
    description: "Perfect for individuals and small projects",
    buttonText: "Start Free Trial",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "99",
    yearlyPrice: "79",
    period: "per month",
    features: [
      "50 monthly credits",
      "Advanced analytics",
      "Priority support",
      "Private Projects",
      "Custom integrations",
    ],
    description: "Ideal for growing teams and businesses",
    buttonText: "Get Started",
    href: "/sign-up",
    isPopular: true,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-xl md:text-3xl text-center font-bold">
          Pricing
        </h1>
        <p className="text-muted-foreground text-center text-sm md:text-base whitespace-pre-line">
          Choose the plan that works for you!
        </p>
      </section>

      {/* Pricing section */}
      <section className="">
        <Pricing
          plans={demoPlans}
          title=""
          description=""
        />
      </section>
    </div>
  );
}
