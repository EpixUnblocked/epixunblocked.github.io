// pages/terms.js
import LegalPage from '../components/LegalPage';

const sections = [
  {
    title: 'Acceptance of Terms',
    body: [
      'By accessing or using Epix, you agree to be bound by these Terms. If you do not agree, please do not use the site.',
    ],
  },
  {
    title: 'Use of the Site',
    body: [
      'Epix is provided for educational and entertainment purposes only. You agree not to use it for any unlawful purpose.',
    ],
  },
  {
    title: 'Intellectual Property',
    body: [
      'All content and materials on Epix, unless stated otherwise, are owned by their respective owners. You may not reproduce or redistribute without permission.',
    ],
  },
  {
    title: 'Disclaimer',
    body: [
      'Epix provides games as-is, with no warranties. We are not responsible for any damages or losses from using the site.',
    ],
  },
  {
    title: 'Changes to Terms',
    body: [
      'We may update these Terms from time to time. Your continued use of the site means you accept the revised terms.',
    ],
  },
];

export default function TermsOfService() {
  return (
    <LegalPage
      pageTitle="Terms of Service | Epix"
      docTitle="Terms of Service"
      docTitleAccent="Service"
      stamp="LEGAL // EPIX"
      fileLabel="TERMS-001"
      lastUpdated="2026-04-30"
      sections={sections}
    />
  );
}
