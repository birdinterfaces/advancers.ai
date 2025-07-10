"use client";

import { Bold } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import '../../public/css/normalize.css';
import '../../public/css/webflow.css';
import '../../public/css/advancers-club-ef3cf37311bfc4b53cc064fc.webflow.css';
import '../../public/css/stars.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

import { PreloadImages } from '@/components/PreloadImages';
import { criticalImages } from '@/lib/images';

const Welcome = () => {

  useEffect(() => {
    // Load external scripts
    const webFontScript = document.createElement('script');
    webFontScript.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    webFontScript.async = true;
    document.body.appendChild(webFontScript);

    const gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-GR4PEECWG6';
    gtagScript.async = true;
    document.body.appendChild(gtagScript);

    const gtagInlineScript = document.createElement('script');
    gtagInlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('set', 'developer_id.dZGVlNj', true);
      gtag('config', 'G-GR4PEECWG6');
    `;
    document.body.appendChild(gtagInlineScript);

    return () => {
      document.body.removeChild(webFontScript);
      document.body.removeChild(gtagScript);
      document.body.removeChild(gtagInlineScript);
    };
  }, []);

  return (
    <>
      <PreloadImages />
      <Head>
        <title>AdvancersAI</title>
        <meta name="description" content="AI that assists in research and innovation" />
        <meta property="og:title" content="AdvancersAI" />
        <meta property="og:description" content="AI that assists in research and innovation" />
        <meta property="twitter:title" content="AdvancersAI" />
        <meta property="twitter:description" content="AI that assists in research and innovation" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/images/webclip.png" />
      </Head>
      <style jsx>{`
        .hero-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .hero-link:hover {
          color: white;
        }
        
        .hero-container-custom {
          min-height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 60px !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
          padding: 0 2rem !important;
          flex-direction: row !important;
        }
        
        @media (max-width: 768px) {
          .hero-container-custom {
            flex-direction: column !important;
            gap: 40px !important;
            text-align: center !important;
          }
          
          .hero-container-custom .hero-section-container {
            text-align: center !important;
            align-items: center !important;
          }
          
          .hero-container-custom .hero-title {
            text-align: center !important;
            font-size: 36px !important;
          }
          
          .hero-container-custom .hero-subtitle {
            text-align: center !important;
          }
          
          .hero-container-custom .animate-on-load-04 {
            justify-content: center !important;
          }
        }
      `}</style>
      <div className={`body-2 ${montserrat.className}`}>
        <div id="signin" className="section hero-section">
          <div className="container hero-container hero-container-custom">
            <div className="hero-section-holder" style={{ flex: '1', maxWidth: '600px' }}>
              <div className="hero-section-container sneakpeakspace" style={{ 
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <div className="animate-on-load-01">
                </div>
                <div className="hero-section-header-holder">
                  <div className="animate-on-load-02">
                    <h1 className="hero-title" style={{
                      textAlign: 'left',
                      margin: '0',
                      fontSize: '48px',
                      lineHeight: '1.2',
                      fontWeight: 400,
                      marginBottom: '24px'
                    }}>The most aligned AI for advancing knowledge and civilization</h1>
                    <p className="hero-subtitle" style={{
                      textAlign: 'left',
                      margin: '0',
                      fontSize: '20px',
                      lineHeight: '1.4',
                      color: '#9BA1A6',
                      marginBottom: '32px'
                    }}><a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="hero-link">Grok 4</a> x <a href="https://advancers.org" target="_blank" rel="noopener noreferrer" className="hero-link">The Advancers Philosophy</a></p>
                  </div>
                </div>
                <div className="hero-section-paragraph-holder">
                  <p className="paragraph-4"></p>
                </div>
                <div className="animate-on-load-04" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <a href="/login" className="button w-button" style={{ 
                    minWidth: '160px',
                    textAlign: 'center'
                  }}><span style={{ fontWeight: 400 }}>Try now</span></a>
                </div>
              </div>
            </div>
            <div className="hero-image-container" style={{ 
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image
                {...criticalImages.aiStar}
                alt="AI Star"
                className="image-13"
                priority={true}
                style={{
                  width: '400px',
                  height: 'auto',
                  maxWidth: '100%',
                  filter: 'blur(50px)',
                  opacity: 0.8
                }}
              />
            </div>
          </div>
          <div data-w-id="526c4d65-fc15-6ad7-ed13-afa9bccb5ee3" className="hero-bacgkround"></div>
          <div className="html-embed w-embed">
            <div className="container">
              <div className="sky">
                <div className="stars"></div>
                <div className="stars1"></div>
                <div className="stars2"></div>
                <div className="shooting-stars"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="content-wrapper" className="section prcig">
          <div className="footer pricing">
            <div className="container">
              <div className="footer-divider">
                <div className="footerleft">
                  <div className="footer-copyright-holder">
                    <a href="/terms" className="link-2">Terms</a>
                  </div>
                  <div className="footer-holder">
                    <a href="/imprint" className="link-2">Imprint</a>
                  </div>
                  <div className="footer-holder">
                    <a href="/privacy" className="link-2">Privacy</a>
                  </div>
                </div>
                <div className="footermiddle"></div>
                <div className="footerright">
                  <div className="footer-holder">
                    <a href="/welcome" className="link-20 pagelink w--current">© 2025 Bird Interfaces, GmbH.</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media screen and (max-width: 479px) {
          .hero-title {
            font-size: 32px;
            line-height: 1.2;
            font-weight: 300;
          }

          .hero-subtitle {
            font-size: 18px;
            line-height: 1.4;
            margin-top: 20px;
          }

          .paragraph-4 {
            font-size: 18px;
            line-height: 1.4;
          }

          .text-block-34 {
            font-size: 20px;
            line-height: 1.3;
          }

          .text-block-35 {
            font-size: 14px;
            line-height: 1.4;
          }

          .totalvaluetext {
            font-size: 28px;
          }

          .price {
            font-size: 16px;
          }
          
          .price .annualy {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default Welcome; 