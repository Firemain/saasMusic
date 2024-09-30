"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";



interface CardProps {
    id: number;
    title: string;
    description: string;
    image?: string; // Image est maintenant optionnelle si on utilise un SVG
    icon: string; // Champ pour le SVG directement dans la carte
  }  

  const cards: CardProps[] = [
    {
      id: 1,
      title: "Automated SEO",
      description: "Profitez de notre solution SEO automatisée qui optimise chaque aspect de votre site sans effort manuel.",
      icon: "brain",
    },
    {
      id: 2,
      title: "AI-Driven Insights",
      description: "Obtenez des recommandations intelligentes grâce à l'intelligence artificielle pour améliorer vos performances en temps réel.",
      icon: "lineChart",
    },
    {
      id: 3,
      title: "Hyper-Localized Pages",
      description: "Créez des pages localisées automatiquement pour cibler chaque région et chaque service avec précision.",
      icon: "search",
    },
    {
      id: 4,
      title: "Real-Time Analytics",
      description: "Suivez les performances SEO de votre site grâce à des analyses en temps réel, accessibles à tout moment.",
      icon: "settings",
    },
    {
      id: 5,
      title: "Scalable Infrastructure",
      description: "Notre plateforme est conçue pour évoluer avec votre entreprise, peu importe la taille ou le volume de trafic.",
      icon: "shieldCheck",
    },
  ];
  export default function SimpleCards() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
  
    return (
         
      <div className="py-10 px-4 sm:py-20">
        <HeaderSection 
            label="Features"
            title="Unleash the Power of Automated SEO"
            subtitle="Optimize your site effortlessly with our AI-driven insights and hyper-localized strategies, ensuring top performance in every region."
            />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => {
  const Icon = Icons[card.icon || "nextjs"]; // Déclaration de l'icône avant le JSX

  return (            
          <motion.div
            key={card.id}
            className="relative flex flex-col items-center overflow-hidden rounded-2xl border bg-background p-8"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedId(selectedId === card.id ? null : card.id)}
          >
                    {/* Affichage conditionnel du SVG ou de l'image au-dessus du titre */}
                    <Icon className="w-6 h-6 mb-4" /> {/* Affichage de l'icône ici */}
                    
                    <h2 className="text-xl font-bold text-white text-center mb-4">
                      {card.title}
                    </h2>

                    <AnimatePresence>
                      {selectedId === card.id && (
                        <motion.div
                          className="absolute inset-0 p-6 bg-black rounded-xl flex flex-col justify-center items-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <motion.p className="text-sm text-muted-foreground text-center">
                            {card.description}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

        </div>
      </div>
    );
  }