import Head from 'next/head';

import { criticalImages } from '@/lib/images';

export function PreloadImages() {
  return (
    <Head>
      {Object.values(criticalImages).map((image) => (
        <link
          key={image.src}
          rel="preload"
          as="image"
          href={image.src}
          imageSrcSet={`${image.src} 1x, ${image.src} 2x`}
        />
      ))}
    </Head>
  );
} 