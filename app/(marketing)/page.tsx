import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import Hero from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";
import InteractiveCards from "@/components/sections/interactiveCards";
import SimpleCards from "@/components/sections/simpleCards";

export default function IndexPage() {
  return (
    <>
      <Hero />
      <SimpleCards  />
      <Features />
      <Testimonials />
    </>
  );
}
