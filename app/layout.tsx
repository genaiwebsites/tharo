import type { Metadata } from 'next';
import { Inter_Tight, Newsreader, Tiro_Devanagari_Hindi } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-newsreader',
  display: 'swap',
});

const tiroHindi = Tiro_Devanagari_Hindi({
  subsets: ['devanagari', 'latin'],
  weight: ['400'],
  variable: '--font-tiro-hindi',
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
        url: '/images/blue_tux_sequin.png',
        width: 1200,
        height: 800,
        alt: 'Tharo Bespoke Menswear Kolkata'
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
    image: 'https://tharo.in/images/blue_tux_sequin.png',
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
    <html lang="en" className={`${interTight.variable} ${newsreader.variable} ${tiroHindi.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Subtle Luxury Overlays: Organic Grain and Dot Matrix */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            pointerEvents: 'none',
            opacity: 0.055,
            mixBlendMode: 'overlay',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 59,
            pointerEvents: 'none',
            opacity: 0.018,
            backgroundImage: 'radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)',
            backgroundSize: '3px 3px'
          }}
        />
        {children}
      </body>
    </html>
  );
}
