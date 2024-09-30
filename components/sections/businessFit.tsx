import { Icons } from "@/components/shared/icons";
import { businessFit } from "@/config/landing";

export default function BusinessFit() {
  return (
    <section className="py-10 sm:py-20 bg-gray-900">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        {/* Titre de la section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">Business Fit</h2>
          <p className="text-lg text-muted-foreground">
            Discover how Velseo scales with your business, providing automated SEO solutions and enterprise-level security.
          </p>
        </div>
        {/* Grille de cartes Business Fit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessFit.map((feature, index) => (
            const Icon = Icons[feature.icon || "nextjs"];
            return (

                <div key={index} className="bg-gray-800 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300 ease-in-out">
              {/* Icône */}
              <div className="flex justify-center mb-4">
                <Icons />
              </div>
              {/* Titre */}
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              {/* Description */}
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        )
        </div>
      </div>
    </section>
  );
}
