import { InfoPage } from '@/components/pages/InfoPage';

export default function PrivacyPage() {
  return <InfoPage eyebrow="Data and privacy" title="Privacy Policy" intro="We collect only the information needed to respond to enquiries, manage feedback, and operate the website.">
    <div><h2>Information you provide</h2><p>When you submit an enquiry or feedback, we may collect your name, phone number, email address, location, requirement, rating, and message so we can respond and manage the request.</p></div>
    <div><h2>Visit analytics</h2><p>The website records page visits to improve pages. Visit events are stored in the internal database and may include page path, user agent, and referer. We do not store raw IP addresses.</p></div>
    <div><h2>Cookies and choices</h2><p>Necessary site functions may use essential cookies. Analytics tracking is enabled for site improvement and does not capture raw IP addresses.</p></div>
    <div><h2>How we use information</h2><p>We use enquiry and feedback information to communicate with customers, provide requested products or services, review public feedback, and improve our website. We do not sell customer information.</p></div>
    <div><h2>Contact</h2><p>For privacy questions or a request about information you have submitted, contact us through the Contact Us section of this website.</p></div>
  </InfoPage>;
}