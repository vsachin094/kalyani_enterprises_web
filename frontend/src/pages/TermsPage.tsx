import { InfoPage } from '@/components/pages/InfoPage';

export default function TermsPage() {
  return <InfoPage eyebrow="Website information" title="Terms of Service" intro="These general terms explain how this website and our enquiry services are intended to be used.">
    <div><h2>Information and quotations</h2><p>Product descriptions, images, availability, pricing, specifications, and timelines are provided for general guidance and may change. A quotation or order confirmation will contain the applicable commercial terms.</p></div>
    <div><h2>Customer requirements</h2><p>Customers are responsible for providing accurate contact, site, load, and project information. Final recommendations depend on site conditions, technical assessment, product availability, and the agreed scope of work.</p></div>
    <div><h2>Third-party products and warranties</h2><p>Products supplied through brand or channel partnerships remain subject to the applicable manufacturer or brand terms. Warranty coverage is governed by the relevant product documentation.</p></div>
    <div><h2>Website use</h2><p>Please use this website and its enquiry forms lawfully and provide information that is accurate and relevant to your request. We may update website content, services, or these terms when required.</p></div>
    <div><h2>Contact</h2><p>For questions about a quotation, product, service, or enquiry, please use the Contact Us section on this website.</p></div>
  </InfoPage>;
}