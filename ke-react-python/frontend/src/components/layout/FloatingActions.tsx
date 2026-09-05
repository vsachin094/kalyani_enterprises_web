import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path fill="currentColor" d="M16 3.2A12.75 12.75 0 0 0 5.06 22.5L3.2 28.8l6.5-1.8A12.8 12.8 0 1 0 16 3.2Zm0 23.25a10.4 10.4 0 0 1-5.3-1.45l-.38-.23-3.85 1.07 1.03-3.75-.25-.39A10.43 10.43 0 1 1 16 26.45Zm5.73-7.8c-.31-.16-1.83-.9-2.11-1s-.49-.16-.7.16-.8 1-.98 1.2-.36.24-.67.08a8.45 8.45 0 0 1-2.48-1.53 9.3 9.3 0 0 1-1.72-2.14c-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.68-.96-2.3-.25-.6-.51-.52-.7-.53h-.6c-.21 0-.55.08-.83.39-.28.31-1.09 1.06-1.09 2.58s1.12 3 1.27 3.2c.16.21 2.2 3.36 5.32 4.71.74.32 1.32.51 1.77.65.75.24 1.43.21 1.97.13.6-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.28-.21-.59-.37Z" />
    </svg>
  );
}

export function FloatingActions() {
  return (
    <>
      <div className="fixed bottom-4 left-3 z-40 sm:bottom-6 sm:left-5">
        <Link to="/#contact" title="Quick enquiry" aria-label="Send a quick enquiry" className="group inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-500 bg-white text-orange-500 shadow-lg shadow-orange-900/20 transition hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white sm:h-14 sm:w-14">
          <Zap className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-gray-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">Quick enquiry</span>
        </Link>
      </div>
      <div className="fixed bottom-20 left-3 right-auto z-40 sm:bottom-6 sm:left-auto sm:right-5">
        <a
          href="https://wa.me/919162461804"
          target="_blank"
          rel="noopener noreferrer"
          title="Contact us on WhatsApp"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-500 bg-white text-green-500 shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-500 hover:text-white sm:h-14 sm:w-14"
          aria-label="Chat with Kalyani Enterprises on WhatsApp"
        >
          <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </a>
      </div>
    </>
  );
}
