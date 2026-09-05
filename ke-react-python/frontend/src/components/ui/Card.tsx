"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-gray-100 bg-white text-gray-950 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      className
    )}
    {...props}
  />
)); 
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-bold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export function ImagePlaceholder({ label = "Image coming soon", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-gray-100", className)} role="img" aria-label={label}>
      <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-orange-200/50 blur-xl animate-pulse" />
      <div className="absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-amber-200/50 blur-xl animate-pulse [animation-delay:700ms]" />
      <div className="relative flex flex-col items-center gap-2 text-orange-600/80">
        <span className="h-10 w-10 rounded-full border-2 border-orange-300/80 bg-white/50 shadow-inner animate-pulse" />
        <span className="text-center text-[10px] font-semibold uppercase tracking-[0.16em]">{label}</span>
      </div>
    </div>
  );
}

export function AssetImage({ src, alt, className = "", placeholderLabel }: { src?: string; alt: string; className?: string; placeholderLabel?: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!src || failed) return <ImagePlaceholder label={placeholderLabel ?? "Image coming soon"} className={className} />;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

// Product Card with 3D hover effect
export interface ProductCardProps {
  name: string;
  icon: React.ReactNode;
  features: string[];
  image?: string;
  href: string;
  category: 'product' | 'service';
  compact?: boolean;
}

export function ProductCard({ name, icon, features, image, href, category, compact = false }: ProductCardProps) {
  return (
    <Card className="group relative h-full min-w-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className={cn("relative flex h-full min-w-0 flex-col", compact ? "p-4" : "p-6")}>
        <div className="flex items-start justify-between mb-4">
          <div className={cn("rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-300", compact ? "h-10 w-10" : "h-14 w-14")}>
            {icon}
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
            {category}
          </span>
        </div>
        
        <h3 className={cn("break-words font-bold text-gray-900 transition-colors group-hover:text-orange-600", compact ? "mb-2 text-base" : "mb-4 text-lg")}>{name}</h3>
        
        {image && (
          <div className={cn("rounded-xl overflow-hidden bg-gray-50 relative", compact ? "mb-3 aspect-[5/3]" : "mb-4 aspect-video")}>
            <AssetImage src={image} alt={name} placeholderLabel="Product image coming soon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        
        <ul className="flex-1 space-y-2 text-sm text-gray-600">
          {features.slice(0, compact ? 2 : 4).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 transition-colors">
              <span className="w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full bg-orange-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <a
          href={href}
          className={cn("inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 group-hover:gap-3 transition-all", compact ? "mt-4" : "mt-6")}
        >
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </Card>
  );
}

// Testimonial Card
export interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
  rating: number;
  photo?: string;
  project_type: string;
  date: string;
}

export function TestimonialCard({ name, location, text, rating, photo, project_type, date }: TestimonialCardProps) {
  return (
    <Card className="p-6 h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center overflow-hidden">
          {photo ? (
            <AssetImage src={photo} alt={name} className="w-full h-full object-cover" placeholderLabel="Customer photo coming soon" />
          ) : (
            <span className="text-2xl font-bold text-orange-600">{name.split(' ').map(n => n[0]).join('')}</span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{location} • {project_type}</p>
        </div>
      </div>
      
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <p className="text-gray-700 mb-4 italic">&quot;{text}&quot;</p>
      
      <div className="text-xs text-gray-400">{date}</div>
    </Card>
  );
}

// Portfolio Card
export interface PortfolioCardProps {
  title: string;
  type: string;
  capacity: string;
  location: string;
  date: string;
  image: string;
  description: string;
  client: string;
}

export function PortfolioCard({ title, type, capacity, location, date, image, description, client }: PortfolioCardProps) {
  const typeColors = {
    Residential: 'bg-blue-100 text-blue-700',
    Commercial: 'bg-purple-100 text-purple-700',
    Industrial: 'bg-orange-100 text-orange-700',
    Institutional: 'bg-green-100 text-green-700',
    'Off-Grid': 'bg-red-100 text-red-700',
  };
  
  return (
    <Card className="overflow-hidden h-full group relative">
      <div className="aspect-video relative overflow-hidden">
        <AssetImage src={"/images/portfolio/" + image} alt={title} placeholderLabel="Project image coming soon" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            View Project
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
      
      <div className="p-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Service type: {client}</p>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-700'}`}>
            {type}
          </span>
          <span className="text-sm font-bold text-orange-600">{capacity}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
          <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 12a7.975 7.975 0 01-2.343 6.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{location}</span>
          <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{date}</span>
        </div>
      </div>
    </Card>
  );
}
