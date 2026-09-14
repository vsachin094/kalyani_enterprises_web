import { InfoPage } from '@/components/pages/InfoPage';

const faqs = [
  ['What products do you provide?', 'We provide solar products, inverters, batteries, energy storage, power-backup products, electrical products, and related equipment through authorized brand and channel partnerships.'],
  ['Do you provide installation and support?', 'Yes. Depending on the requirement, we can support consultation, site assessment, system design, supply, installation, commissioning, maintenance, and after-sales coordination.'],
  ['Can you provide solutions from more than one brand?', 'Yes. We are not limited to one type of solution. Trusted channel partnerships help us coordinate suitable multi-brand options for customer requirements.'],
  ['Do you serve only residential customers?', 'No. We support residential, commercial, industrial, and institutional requirements across Jharkhand.'],
  ['How can I request a quotation?', 'Use the Contact Us section, call us, or message us on WhatsApp with your requirement and location.'],
];

export default function FAQsPage() {
  return <InfoPage eyebrow="Help centre" title="Frequently Asked Questions" intro="Here are simple answers to common questions about our products, services, and customer support.">
    {faqs.map(([question, answer]) => <div key={question}><h2>{question}</h2><p>{answer}</p></div>)}
  </InfoPage>;
}