import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import JobsPage, { metadata as jobsMetadata } from '@/app/(public)/jobs/page';
import ServicesPage, { metadata as servicesMetadata } from '@/app/(public)/services/page';

describe('Jobs Section - Deferred Feature State', () => {
  it('renders honest deferred-feature banner without fake jobs or apply buttons', () => {
    const html = renderToString(<JobsPage />);

    // Assert honest in-development / deferred state headings
    expect(html).toContain('Jobs &amp; Hiring Portal');
    expect(html).toContain('Under Active Development');
    expect(html).toContain('Deferred Feature State');

    // Assert that fake job listings or fake apply buttons DO NOT exist
    expect(html).not.toContain('Apply Now');
    expect(html).not.toContain('Submit Application');
    expect(html).not.toContain('Quick candidate resume');

    // Assert working marketplace navigation links exist
    expect(html).toContain('href="/sell"');
    expect(html).toContain('href="/search"');
  });

  it('renders planned taxonomy roadmap categories', () => {
    const html = renderToString(<JobsPage />);

    expect(html).toContain('Data Entry &amp; Back Office');
    expect(html).toContain('Drivers &amp; Chauffeurs');
    expect(html).toContain('Delivery &amp; Logistics');
    expect(html).toContain('Teachers &amp; Tutors');
  });

  it('exports valid SEO metadata and canonical tags', () => {
    expect(jobsMetadata.title).toContain('Jobs & Employment in India');
    expect(jobsMetadata.description).toContain('under development');
    expect(jobsMetadata.alternates?.canonical).toBeDefined();
  });
});

describe('Services Section - Deferred Feature State', () => {
  it('renders honest deferred-feature banner without fake providers or booking buttons', () => {
    const html = renderToString(<ServicesPage />);

    // Assert honest in-development / deferred state headings
    expect(html).toContain('Local Services Directory');
    expect(html).toContain('Under Active Development');
    expect(html).toContain('Deferred Feature State');

    // Assert that fake providers, ratings, or simulated booking actions DO NOT exist
    expect(html).not.toContain('Book Now');
    expect(html).not.toContain('Request Callback');
    expect(html).not.toContain('Customer Testimonials');

    // Assert working marketplace navigation links exist
    expect(html).toContain('href="/sell"');
    expect(html).toContain('href="/search"');
  });

  it('renders planned service taxonomy categories', () => {
    const html = renderToString(<ServicesPage />);

    expect(html).toContain('Electronics &amp; Appliance Repair');
    expect(html).toContain('Home Renovation &amp; Painting');
    expect(html).toContain('Education &amp; Home Tutors');
    expect(html).toContain('Packers &amp; Movers Logistics');
  });

  it('exports valid SEO metadata and canonical tags', () => {
    expect(servicesMetadata.title).toContain('Local Services Directory in India');
    expect(servicesMetadata.description).toContain('under active development');
    expect(servicesMetadata.alternates?.canonical).toBeDefined();
  });
});
