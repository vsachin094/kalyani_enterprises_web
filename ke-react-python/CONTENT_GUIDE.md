# Kalyani Enterprises Content Guide

This guide explains how to add and manage content for the Kalyani Enterprises website.

## Adding New Products

1. **Create product JSON file**: Add a new file in `data/products/` following the naming convention `*.json`.

2. **Product structure**: Each product must have these fields:
   - `id` (string): Unique identifier (use the product slug, e.g., "solar-panels")
   - `name` (string): Product name
   - `image` (string): Main image filename (relative to `public/images/`)
   - `gallery` (array): Additional image filenames
   - `short_description` (string): Brief description
   - `full_description` (string): Detailed description
   - `features` (array): Key features as bullet points
   - `specifications` (object): Technical specifications
   - `availability` (string): Stock status
   - `related_products` (array): IDs of related products
   - `benefits` (array): Benefits of choosing this product

3. **Example product JSON**:
   ```json
   {
     "id": "solar-panels",
     "name": "Solar Panels",
     "image": "solar-panel-1.jpg",
     "gallery": ["solar-panel-2.jpg", "solar-panel-3.jpg"],
     "short_description": "High-efficiency solar panels for residential and commercial use",
     "full_description": "Our premium solar panels offer up to 22% efficiency with 25-year warranty coverage.",
     "features": ["22% efficiency", "25-year warranty", "Weather-resistant", "Easy installation"],
     "specifications": {"Capacity": "320W", "Dimensions": "1.6m x 1.0m", "Weight": "20kg"},
     "availability": "In stock",
     "related_products": ["solar-inverters", "solar-batteries"],
     "benefits": ["Reduce electricity bills", "Government subsidies available", "Low maintenance"]
   }
   ```

4. **Images**: Place product images in `ke-react-python/frontend/public/images/` or update the path in the JSON.

5. **Rebuild**: Run `npm run build` in the frontend to regenerate the product catalogue.

## Adding New Services

1. **Create service JSON file**: Add a new file in `data/services/` following the naming convention `*.json`.

2. **Service structure**: Each service must have these fields:
   - `id` (string): Unique identifier (use the service slug, e.g., "solar-installation")
   - `name` (string): Service name
   - `image` (string): Main image filename
   - `gallery` (array): Additional image filenames
   - `short_description` (string): Brief description
   - `full_description` (string): Detailed description
   - `features` (array): Key features as bullet points
   - `duration` (string): Estimated timeline
   - `service_areas` (array): Geographic areas covered
   - `process` (array): Steps of the service process
     - Each step needs: `step` (number/title), `title`, `description`
   - `included_services` (array): Additional services included
   - `warranty` (string): Warranty information

3. **Example service JSON**:
   ```json
   {
     "id": "solar-installation",
     "name": "Solar Installation",
     "image": "installation-1.jpg",
     "gallery": ["installation-2.jpg"],
     "short_description": "Professional solar panel installation services",
     "full_description": "Our certified technicians handle complete solar panel installation from site assessment to commissioning.",
     "features": ["Certified technicians", "Site assessment included", "Commissioning support", "Post-installation maintenance"],
     "duration": "3-5 days",
     "service_areas": ["Jamshedpur", "Jharkhand", "Nearby regions"],
     "process": [
       {"step": 1, "title": "Site Assessment", "description": "Free site visit and load analysis"},
       {"step": 2, "title": "Design", "description": "Custom system design based on requirements"},
       {"step": 3, "title": "Installation", "description": "Professional installation by certified technicians"},
       {"step": 4, "title": "Commissioning", "description": "System testing and handover"}
     ],
     "included_services": ["Design", "Commissioning", "1-year warranty"],
     "warranty": "1-year workmanship warranty on installation"
   }
   ```

4. **Images**: Place service images in `ke-react-python/frontend/public/images/` or update the path in the JSON.

5. **Rebuild**: Run `npm run build` in the frontend to regenerate the service catalogue.

## Adding New Portfolio Projects

1. **Create portfolio entry**: Add a new entry in `data/portfolio.json`.

2. **Portfolio structure**: Each project must have these fields:
   - `id` (string): Unique identifier
   - `title` (string): Project title
   - `description` (string): Project description
   - `image` (string): Project image filename
   - `category` (string): Category (e.g., "solar", "inverter", "battery")

3. **Example portfolio entry**:
   ```json
   {
     "id": "project-1",
     "title": "Rohri Solar Farm",
     "description": "100kW solar installation for agricultural cooperative",
     "image": "project-1.jpg",
     "category": "solar"
   }
   ```

4. **Images**: Place project images in `ke-react-python/frontend/public/images/portfolio/` or update the path in the JSON.

5. **Rebuild**: Run `npm run build` in the frontend to regenerate the portfolio.

## Adding Brand Logos

1. **Create brand logo entry**: Add a new entry in `data/brand-logos.json`.

2. **Brand logo structure**: Each entry must have these fields:
   - `id` (string): Unique identifier
   - `name` (string): Brand name
   - `image` (string): Logo image filename
   - `website` (string): Brand website URL
   - `category` (string): Category (e.g., "solar", "inverter", "battery")

3. **Example brand logo entry**:
   ```json
   {
     "id": "livguard",
     "name": "Livguard",
     "image": "livguard-logo.png",
     "website": "https://www.livguard.co.in",
     "category": "battery"
   }
   ```

4. **Images**: Place logo images in `ke-react-python/frontend/public/images/brands/` or update the path in the JSON.

5. **Rebuild**: Run `npm run build` in the frontend to regenerate the brand logos section.

## Adding FAQs

1. **Add FAQ entry**: Add a new entry in the FAQs section of the relevant page component (e.g., `FAQsPage.tsx`).

2. **FAQ structure**: Each entry is a `[question, answer]` pair.

3. **Example FAQ entry**:
   ```javascript
   ["What products do you provide?", "We provide solar products, inverters, batteries, energy storage, power-backup products, electrical products, and related equipment through authorized brand and channel partnerships."]
   ```

4. **Rebuild**: Run `npm run build` in the frontend to regenerate the FAQs.

## Adding Contact Form Fields

1. **Modify FeedbackPage.tsx**: Add new form fields if needed.

2. **Backend**: Ensure the `submitFeedback` API endpoint handles the new fields.

3. **Example**: Add a `project_type` dropdown with options for different product/service categories.

## Adding Testimonials

1. **Submit feedback**: Customers can submit feedback through the contact form.

2. **Admin review**: Approved feedback appears in the Testimonials section.

3. **Admin dashboard**: Use `/admin/feedback` to review, approve, or reject submissions.

4. **Format**: Approved feedback displays as testimonial cards with name, rating, and message.

## Adding Blog/News Articles

1. **Create content**: Add new content sections to relevant pages using the `InfoPage` component.

2. **Structure**: Use the `eyebrow`, `title`, `intro`, and `children` props.

3. **Example**:
   ```jsx
   <InfoPage
     eyebrow="News"
     title="Latest Updates"
     intro="Stay updated with our latest projects and announcements."
   >
     <h2>New Product Launch</h2>
     <p>We have launched our new range of lithium-ion batteries...</p>
   </InfoPage>
   ```

## Managing Analytics

1. **Automatic tracking**: Page visits are automatically logged when visitors browse the site.

2. **Admin dashboard**: View visit analytics at `/admin/analytics`.

3. **Data stored**: Page path, referer, user agent, and timestamp (no raw IP addresses).

4. **Privacy**: Visit data is stored internally and used for site improvement only.

## Deployment Checklist

After making content changes:

1. Run `npm run build` in the frontend directory
2. Rebuild the Docker image: `docker build -t kalyani-enterprises .`
3. Restart the container: `docker restart kalyani-enterprises`
4. Or deploy to Render.com with the updated code

## Troubleshooting

- **Products not showing**: Ensure the JSON file follows the exact structure and `id` matches the expected slug format.
- **Images not loading**: Verify image paths are correct and files are in the right directory.
- **Admin login failing**: Check admin credentials in the database and ensure the token is stored correctly.
- **Build errors**: Run `npm run lint` and fix any TypeScript errors before rebuilding.