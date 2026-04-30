// pages/privacy.js
import LegalPage from '../components/LegalPage';

const sections = [
  {
    title: 'Information We Collect',
    body: [
      'We do not directly collect any personal data. However, analytics or embedded content may collect anonymized information such as IP address, device type, or usage patterns.',
    ],
  },
  {
    title: 'Cookies & Local Storage',
    body: [
      "Epix stores your preferences (favorites, recently played, sort order, tab cloak choice) in your browser's local storage. This data never leaves your device and is used only to make the site work the way you set it up. You can clear it at any time via your browser's site settings.",
      'Embedded games and the chat feature load from third-party sources and may set their own cookies, which we do not control or have access to.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'Epix may link to third-party services or host games from external developers. These third parties may collect their own data under their own terms.',
    ],
  },
  {
    title: 'Your Consent',
    body: ['By using our site, you consent to this Privacy Policy.'],
  },
  {
    title: 'Changes to This Policy',
    body: ['We may update our privacy practices. Check this page regularly for changes.'],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      pageTitle="Privacy Policy | Epix"
      docTitle="Privacy Policy"
      docTitleAccent="Policy"
      stamp="CONFIDENTIAL // EPIX"
      fileLabel="POLICY-001"
      lastUpdated="2026-04-30"
      sections={sections}
    />
  );
}
