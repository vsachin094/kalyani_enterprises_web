import { Link } from 'react-router-dom';
import { InfoPage } from '@/components/pages/InfoPage';
import { Button } from '@/components/ui/Button';

export default function CareersPage() {
  return <InfoPage eyebrow="Work with us" title="Careers at Kalyani Enterprises" intro="We are building a dependable team around power systems, energy products, electrical solutions, customer service, and field support across Jharkhand.">
    <div><h2>Opportunities</h2><p>We may have opportunities in sales, customer support, electrical work, installation assistance, service coordination, and related roles. Openings depend on current business requirements.</p></div>
    <div><h2>Send your details</h2><p>Share your name, experience, location, area of interest, and contact number. Our team can get in touch when a suitable opportunity is available.</p><Button asChild className="mt-6"><Link to="/#contact">Contact us</Link></Button></div>
  </InfoPage>;
}