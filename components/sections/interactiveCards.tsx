"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
  id: number;
  title: string;
  subtitle: string;
  details: string;
}

const items: Item[] = [
  { id: 1, title: "Audit SEO", subtitle: "Analyse complète", details: "Analyse de votre site pour optimiser votre SEO." },
  { id: 2, title: "Recherche de mots-clés", subtitle: "Optimisation", details: "Identifiez les mots-clés pertinents pour améliorer votre site." },
  { id: 3, title: "Optimisation Technique", subtitle: "Performance", details: "Améliorez la vitesse de votre site et sa performance technique." }
];

export default function InteractiveCards() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="container mx-auto p-10 bg-black text-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-${item.id}`} // Utilisation de layoutId avec un préfixe pour s'assurer qu'il est unique
            onClick={() => setSelectedId(item.id)}
            className="p-6 bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 border border-gray-700 transition-all"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h5 className="text-sm text-violet-400">{item.subtitle}</motion.h5>
            <motion.h2 className="text-2xl font-bold text-white">{item.title}</motion.h2>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId !== null && (
          <motion.div
            layoutId={`card-${selectedId}`} // Utilisation cohérente du layoutId
            className="fixed inset-0 flex justify-center items-center z-50 p-4"
            onClick={() => setSelectedId(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="p-8 bg-gray-900 rounded-lg shadow-lg max-w-md w-full relative"
              layoutId={`card-${selectedId}`}
              onClick={(e) => e.stopPropagation()} // Empêche de fermer en cliquant à l'intérieur de la carte
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h5 className="text-sm text-violet-400">
                {items.find(item => item.id === selectedId)?.subtitle}
              </motion.h5>
              <motion.h2 className="text-2xl font-bold text-white mb-4">
                {items.find(item => item.id === selectedId)?.title}
              </motion.h2>
              <motion.p className="text-lg text-gray-400 mb-4">
                {items.find(item => item.id === selectedId)?.details}
              </motion.p>
              <motion.button
                className="absolute top-2 right-2 text-violet-400 hover:text-white"
                onClick={() => setSelectedId(null)}
              >
                ✖
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
