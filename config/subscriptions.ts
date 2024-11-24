import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Basic",
    description: "Pour les petits sites web",
    benefits: [
      "Connexion simple à votre site web",
      "Recommandations SEO basées sur les meilleures pratiques",
      "Accès aux rapports de performance Google Search Console",
      "Suivi des mots-clés principaux",
      "Rapports mensuels",
    ],
    limitations: [
      "Pas de connexion GitHub pour analyse du code source",
      "Support client standard",
      "Aucune veille concurrentielle",
    ],
    prices: {
      monthly: 10,
      yearly: 8,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_ESSENTIAL_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_ESSENTIAL_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Expert",
    description: "Pour les sites en croissance",
    benefits: [
      "Connexion via site web ou GitHub pour analyse complète du code source",
      "Rapports détaillés basés sur Google APIs (Search Console, Google Ads)",
      "Suivi avancé des mots-clés et des performances SEO",
      "Accès aux outils de veille concurrentielle",
      "Rapports hebdomadaires",
      "Support client prioritaire",
    ],
    limitations: [
      "Personnalisation limitée des rapports",
    ],
    prices: {
      monthly: 30,
      yearly: 24,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Premium",
    description: "Pour les entreprises",
    benefits: [
      "Connexion via site web ou GitHub pour une analyse approfondie du code source",
      "Accès complet aux données Google APIs et Google Ads",
      "Rapports SEO en temps réel et recommandations automatiques",
      "Veille concurrentielle en continu",
      "Rapports quotidiens et alertes personnalisées",
      "Support client 24/7 avec gestionnaire dédié",
    ],
    limitations: [],
    prices: {
      monthly: 100,
      yearly: 80,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = [
  "essentiel",
  "pro",
  "business",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Connexion via site web",
    essentiel: true,
    pro: true,
    business: true,
    tooltip: "Connectez facilement votre site web pour des recommandations SEO.",
  },
  {
    feature: "Connexion via GitHub",
    essentiel: null,
    pro: true,
    business: true,
    tooltip: "Connexion via GitHub pour analyser directement le code source.",
  },
  {
    feature: "Accès aux données Google APIs",
    essentiel: "Basique",
    pro: "Avancé",
    business: "Complet",
    tooltip: "Analyse de performance SEO basée sur les données Google APIs.",
  },
  {
    feature: "Veille concurrentielle",
    essentiel: null,
    pro: "Basique",
    business: "Avancée",
    tooltip: "Suivi de vos concurrents avec des rapports réguliers.",
  },
  {
    feature: "Rapports SEO",
    essentiel: "Mensuels",
    pro: "Hebdomadaires",
    business: "Quotidiens",
    tooltip: "Fréquence des rapports sur la performance SEO.",
  },
  {
    feature: "Support client",
    essentiel: "Standard",
    pro: "Prioritaire",
    business: "24/7 avec gestionnaire",
  },
  // Ajoute d'autres fonctionnalités ici
];
