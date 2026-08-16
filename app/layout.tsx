import type { Metadata } from 'next';
import { Inter_Tight, Cormorant_Garamond, Noto_Sans_Devanagari, Cinzel } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tharo.in'),
  title: 'THARO — Designed For You · Bespoke Menswear Kolkata',
  description:
    'Rajasthani hand-work. Calcutta tailoring. Cut for one person. Bespoke sherwanis, made-to-measure suits, tuxedos, bandhgalas, and designer shirts at 31 Allenby Road, Bhawanipore, Kolkata.',
  keywords: [
    'Tharo',
    'Bespoke Menswear Kolkata',
    'Bhowanipore Tailor',
    'Sherwani Kolkata',
    'Made to Measure Suits',
    'Bandhgala Kolkata',
    'Zardozi',
    'Cornelli Embroidery',
    'Luxury Menswear India'
  ],
  authors: [{ name: 'Tharo Menswear' }],
  openGraph: {
    title: 'THARO — Designed For You · Bespoke Menswear Kolkata',
    description: 'Rajasthani hand-work. Calcutta tailoring. Cut for one person.',
    url: 'https://tharo.in',
    siteName: 'Tharo',
    images: [
      {
        url: '/images/collection/tharo-midnight-blue-sequin-velvet-tuxedo.png',
        width: 1200,
        height: 800,
        alt: 'THARO Bespoke Menswear Kolkata — Midnight Blue Sequin Velvet Tuxedo'
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['ClothingStore', 'LocalBusiness'],
    name: 'Tharo — Designed For You',
    description:
      'Bespoke menswear house in Bhowanipore, Kolkata. Rajasthani hand-work, Calcutta tailoring. Made-to-measure tuxedos, bandhgalas, sherwanis, kurtas and shirting.',
    image: 'https://tharo.in/images/collection/tharo-midnight-blue-sequin-velvet-tuxedo.png',
    telephone: '+91 90625 12323',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '31 Allenby Road, Bhawanipore',
      addressLocality: 'Kolkata',
      postalCode: '700020',
      addressRegion: 'West Bengal',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.5316,
      longitude: 88.3489
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '11:30',
        closes: '19:30'
      }
    ],
    sameAs: [
      'https://www.instagram.com/tharo_designedforyou/',
      'https://wa.me/919062512323'
    ]
  };

  return (
    <html lang="en" className={`${interTight.variable} ${cormorant.variable} ${cinzel.variable} ${notoSansDevanagari.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Silky Smooth Ambient Velvet Caustic Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background: 'radial-gradient(120% 80% at 50% 20%, rgba(20, 28, 48, 0.25) 0%, rgba(6, 8, 14, 0.7) 60%, rgba(4, 6, 10, 0.95) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
