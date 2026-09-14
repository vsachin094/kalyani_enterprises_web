"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

export type Language = "en" | "hi";

const translations = {
  en: {
    home: "Home", products: "Products", services: "Services", portfolio: "Portfolio", reviews: "Reviews", about: "About Us", contact: "Contact",
    callUs: "Call Us", whatsapp: "WhatsApp", chatWhatsapp: "Chat on WhatsApp", requestQuote: "Request a Quote", callNow: "Call Now",
    heroTitle: "Reliable Power & Energy Solutions", heroTitleAccent: "For Every Need",
    heroDescription: "Authorized distributor of Livguard Solar and Livguard Energy, with multi-brand channel partnerships for custom solar, power-backup, battery, and electrical solutions.",
    whyChoose: "Why Choose Kalyani?", solarBackup: "Solar, backup, battery, and electrical solutions", multiBrand: "Multi-brand options through trusted channel partnerships", homesBusinesses: "Solutions for homes, businesses, and institutions", customSystems: "Custom systems for changing power requirements", installation: "Installation, commissioning, and maintenance support", practicalGuidance: "Practical guidance from consultation to service",
    language: "Language", english: "English", hindi: "हिन्दी",
    aboutLabel: "About Kalyani Enterprises", trustedPartner: "Your Trusted Partner in", powerEnergySolutions: "Power & Energy Solutions", aboutIntro: "Kalyani Enterprises is a proprietorship business and an authorized distributor of Livguard Solar and Livguard Energy. Through trusted channel partnerships, we can also provide multi-brand and multi-solution support for customers across Jharkhand.", completePower: "Complete Power Solutions for Every Requirement", whyUs: "Why Choose Us", coreValues: "Our Core Values", discussRequirement: "Discuss Your Requirement", viewProjects: "View Our Projects",
    productLabel: "Our Premium Product Range", productsHeading: "Power & Energy", productsDescription: "Solar, inverter, battery, electrical, and backup products sourced through authorized brand partnerships.", viewAllProducts: "View All Products",
    serviceLabel: "Professional Services", servicesHeading: "Expert Power Services", servicesDescription: "Complete support for power and energy systems, including consultation, supply, installation, commissioning, and ongoing maintenance.", processHeading: "From Consultation to Commissioning", processDescription: "A proven 4-step journey ensuring quality and timely delivery",
    portfolioLabel: "Our Project Portfolio", portfolioHeading: "A Selection of", recentProjects: "Recent Projects", portfolioDescription: "A representative selection of recent work across residential, commercial, industrial, and institutional requirements throughout Jharkhand.",
    testimonialLabel: "Client Testimonials", testimonialHeading: "What Our", customersSay: "Customers Say", testimonialDescription: "Real feedback from customers across Jharkhand who have used our products, services, and power solutions.", verifiedReviews: "Verified Reviews", satisfactionRate: "Satisfaction Rate",
    getInTouch: "Get In Touch", planPower: "Plan Your", powerSolutionToday: "Power Solution Today", contactDescription: "Fill out the form or contact us directly. Our team will review your requirement and get back to you.", shareFeedback: "Share your feedback", whyContact: "Why Contact Us?", submitInquiry: "Submit Inquiry",
  },
  hi: {
    home: "होम", products: "उत्पाद", services: "सेवाएँ", portfolio: "प्रोजेक्ट", reviews: "समीक्षाएँ", about: "हमारे बारे में", contact: "संपर्क",
    callUs: "कॉल करें", whatsapp: "व्हाट्सऐप", chatWhatsapp: "व्हाट्सऐप पर चैट करें", requestQuote: "कोटेशन प्राप्त करें", callNow: "अभी कॉल करें",
    heroTitle: "विश्वसनीय पावर और एनर्जी समाधान", heroTitleAccent: "हर आवश्यकता के लिए",
    heroDescription: "Livguard Solar और Livguard Energy के अधिकृत वितरक। विश्वसनीय चैनल पार्टनरशिप के माध्यम से कस्टम सोलर, पावर बैकअप, बैटरी और इलेक्ट्रिकल समाधान उपलब्ध।",
    whyChoose: "Kalyani Enterprises क्यों चुनें?", solarBackup: "सोलर, बैकअप, बैटरी और इलेक्ट्रिकल समाधान", multiBrand: "विश्वसनीय चैनल पार्टनरशिप के माध्यम से मल्टी-ब्रांड विकल्प", homesBusinesses: "घर, व्यवसाय और संस्थानों के लिए समाधान", customSystems: "बदलती पावर आवश्यकताओं के अनुसार कस्टम सिस्टम", installation: "इंस्टॉलेशन, कमीशनिंग और मेंटेनेंस सहायता", practicalGuidance: "कंसल्टेशन से सर्विस तक व्यावहारिक मार्गदर्शन",
    language: "भाषा", english: "English", hindi: "हिन्दी",
    aboutLabel: "Kalyani Enterprises के बारे में", trustedPartner: "पावर और एनर्जी समाधान में", powerEnergySolutions: "आपका विश्वसनीय पार्टनर", aboutIntro: "Kalyani Enterprises एक प्रोप्राइटरशिप व्यवसाय और Livguard Solar तथा Livguard Energy का अधिकृत वितरक है। विश्वसनीय चैनल पार्टनरशिप के माध्यम से हम झारखंड में मल्टी-ब्रांड और मल्टी-सॉल्यूशन सहायता भी प्रदान करते हैं।", completePower: "हर आवश्यकता के लिए संपूर्ण पावर समाधान", whyUs: "हमें क्यों चुनें", coreValues: "हमारे मूल मूल्य", discussRequirement: "अपनी आवश्यकता पर चर्चा करें", viewProjects: "हमारे प्रोजेक्ट देखें",
    productLabel: "हमारी प्रीमियम उत्पाद श्रृंखला", productsHeading: "पावर और एनर्जी", productsDescription: "अधिकृत ब्रांड पार्टनरशिप के माध्यम से सोलर, इन्वर्टर, बैटरी, इलेक्ट्रिकल और बैकअप उत्पाद।", viewAllProducts: "सभी उत्पाद देखें",
    serviceLabel: "प्रोफेशनल सेवाएँ", servicesHeading: "विशेषज्ञ पावर सेवाएँ", servicesDescription: "पावर और एनर्जी सिस्टम के लिए कंसल्टेशन, सप्लाई, इंस्टॉलेशन, कमीशनिंग और मेंटेनेंस सहित पूरी सहायता।", processHeading: "कंसल्टेशन से कमीशनिंग तक", processDescription: "गुणवत्ता और समय पर डिलीवरी सुनिश्चित करने वाली सिद्ध 4-चरणीय यात्रा",
    portfolioLabel: "हमारे प्रोजेक्ट पोर्टफोलियो", portfolioHeading: "हाल के प्रोजेक्ट्स में से", recentProjects: "कुछ चुनिंदा", portfolioDescription: "झारखंड में रेजिडेंशियल, कमर्शियल, इंडस्ट्रियल और संस्थागत आवश्यकताओं के लिए हाल के कार्यों का प्रतिनिधि चयन।",
    testimonialLabel: "ग्राहक प्रशंसापत्र", testimonialHeading: "हमारे", customersSay: "ग्राहक क्या कहते हैं", testimonialDescription: "झारखंड के उन ग्राहकों की वास्तविक प्रतिक्रिया जिन्होंने हमारे उत्पाद, सेवाएँ और पावर समाधान उपयोग किए हैं।", verifiedReviews: "सत्यापित समीक्षाएँ", satisfactionRate: "संतुष्टि दर",
    getInTouch: "संपर्क करें", planPower: "आज ही अपना", powerSolutionToday: "पावर समाधान तय करें", contactDescription: "फॉर्म भरें या सीधे संपर्क करें। हमारी टीम आपकी आवश्यकता की समीक्षा करके आपसे संपर्क करेगी।", shareFeedback: "अपनी प्रतिक्रिया साझा करें", whyContact: "हमसे संपर्क क्यों करें?", submitInquiry: "पूछताछ भेजें",
  },
} as const;

type TranslationKey = keyof typeof translations.en;
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string } | null>(null);

const languageEvent = "ke-language-change";
const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem("ke-language") === "hi" ? "hi" : "en";
};
const subscribeToLanguage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(languageEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(languageEvent, onChange);
  };
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribeToLanguage, getStoredLanguage, (): Language => "en");

  const setLanguage = (next: Language) => {
    window.localStorage.setItem("ke-language", next);
    window.dispatchEvent(new Event(languageEvent));
  };

  const value = useMemo(() => ({ language, setLanguage, t: (key: TranslationKey) => translations[language][key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
