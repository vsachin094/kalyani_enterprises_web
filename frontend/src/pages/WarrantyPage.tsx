import { InfoPage } from '@/components/pages/InfoPage';

export default function WarrantyPage() {
  return <InfoPage eyebrow="Product support" title="Warranty Information" intro="Warranty coverage depends on the brand, product model, installation conditions, and the warranty terms supplied with the product.">
    <div><h2>Brand and product terms apply</h2><p>Warranty duration, inclusions, exclusions, and claim requirements may differ for solar panels, inverters, batteries, electrical products, and other equipment. The applicable brand warranty card, invoice, and product documentation should be treated as the final reference.</p></div>
    <div><h2>How we help</h2><p>Our team can help coordinate warranty-related communication with the relevant brand or channel partner. Please keep your invoice, serial number, warranty card, installation details, and photographs of the issue available.</p></div>
    <div><h2>Before raising a request</h2><ul><li>Use the product according to the supplied instructions.</li><li>Do not open or modify equipment without authorized support.</li><li>Share the product model, serial number, purchase date, and issue description.</li></ul></div>
    <div><h2>Need assistance?</h2><p>Contact us with your product and purchase details so we can guide you through the applicable warranty process.</p></div>
  </InfoPage>;
}