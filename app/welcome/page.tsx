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
  const [isHeroSignInVisible, setIsHeroSignInVisible] = useState(true);

  useEffect(() => {
    const heroSignInButton = document.querySelector('.animate-on-load-04');
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroSignInVisible(entry.isIntersecting);
      },
      {
        threshold: 0
      }
    );

    if (heroSignInButton) {
      observer.observe(heroSignInButton);
    }

    return () => {
      if (heroSignInButton) {
        observer.unobserve(heroSignInButton);
      }
    };
  }, []);

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
      <div className={`body-2 ${montserrat.className}`}>
        <div className="fixednavbar">
          <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar pricingg w-nav">
            <div className="container navbar-container">
              <div className="navbar-holder">
                <div className="navbar-container">
                  <a href="/welcome" aria-current="page" className="brand w-nav-brand w--current">
                    <Image
                      {...criticalImages.logo}
                      alt="Brand logo"
                      priority={true}
                      className="brand-image"
                    />
                  </a>
                  <nav role="navigation" className="nav-menu w-nav-menu">
                    <div className="nav-menu-link-holder">
                      <div className="nav-menu-link-container adjustingmiddlemobilenav">
                        <div className="nav-links">
                          <a href="#features" className="nav-link _2 w-nav-link">Features</a>
                          <a href="#plans" className="nav-link w-nav-link">Plans</a>
                        </div>
                      </div>
                    </div>
                  </nav>
                  <div className="menu-cart-holder newlogin">
                    <div data-node-type="commerce-cart-wrapper" data-open-product="" data-wf-cart-type="rightDropdown" data-wf-cart-query="" data-wf-page-link-href-prefix="" data-wf-cart-duration="400" className="w-commerce-commercecartwrapper">
                      <div data-node-type="commerce-cart-container-wrapper" style={{ display: 'none' }} className="w-commerce-commercecartcontainerwrapper w-commerce-commercecartcontainerwrapper--cartType-rightDropdown">
                        <div role="dialog" data-node-type="commerce-cart-container" className="w-commerce-commercecartcontainer cart-container">
                          <div className="w-commerce-commercecartheader cart-header">
                            <h4 className="w-commerce-commercecartheading">Your Cart</h4>
                            <a href="#" data-node-type="commerce-cart-close-link" role="button" aria-label="Close cart" className="w-commerce-commercecartcloselink w-inline-block">
                              <Image
                                src="/images/X-Icon.svg"
                                alt="Close cart"
                                width={24}
                                height={24}
                                className="x-icon"
                              />
                            </a>
                          </div>
                          <div className="w-commerce-commercecartformwrapper cart-form-wrapper">
                            <form data-node-type="commerce-cart-form" style={{ display: 'none' }} className="w-commerce-commercecartform">
                              <script type="text/x-wf-template" id="wf-template-6ec2beb4-4f69-d272-1424-83d47f66afe0"></script>
                              <div className="w-commerce-commercecartlist cart-list" data-wf-collection="database.commerceOrder.userItems" data-wf-template-id="wf-template-6ec2beb4-4f69-d272-1424-83d47f66afe0"></div>
                              <div className="w-commerce-commercecartfooter cart-footer">
                                <div aria-atomic="true" aria-live="polite" className="w-commerce-commercecartlineitem">
                                  <div className="sub-total">Subtotal</div>
                                  <div className="w-commerce-commercecartordervalue product-cart-price"></div>
                                </div>
                                <div>
                                  <div data-node-type="commerce-cart-quick-checkout-actions">
                                    <a data-node-type="commerce-cart-apple-pay-button" role="button" tabIndex={0} aria-label="Apple Pay" aria-haspopup="dialog" style={{ backgroundImage: '-webkit-named-image(apple-pay-logo-white)', backgroundSize: '100% 50%', backgroundPosition: '50% 50%', backgroundRepeat: 'no-repeat' }} className="w-commerce-commercecartapplepaybutton">
                                      <div></div>
                                    </a>
                                    <a data-node-type="commerce-cart-quick-checkout-button" role="button" tabIndex={0} aria-haspopup="dialog" style={{ display: 'none' }} className="w-commerce-commercecartquickcheckoutbutton">
                                      <svg className="w-commerce-commercequickcheckoutgoogleicon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                        <defs>
                                          <polygon id="google-mark-a" points="0 .329 3.494 .329 3.494 7.649 0 7.649"></polygon>
                                          <polygon id="google-mark-c" points=".894 0 13.169 0 13.169 6.443 .894 6.443"></polygon>
                                        </defs>
                                        <g fill="none" fillRule="evenodd">
                                          <path fill="#4285F4" d="M10.5967,12.0469 L10.5967,14.0649 L13.1167,14.0649 C14.6047,12.6759 15.4577,10.6209 15.4577,8.1779 C15.4577,7.6339 15.4137,7.0889 15.3257,6.5559 L7.8887,6.5559 L7.8887,9.6329 L12.1507,9.6329 C11.9767,10.6119 11.4147,11.4899 10.5967,12.0469"></path>
                                          <path fill="#34A853" d="M7.8887,16 C10.0137,16 11.8107,15.289 13.1147,14.067 C13.1147,14.066 13.1157,14.065 13.1167,14.064 L10.5967,12.047 C10.5877,12.053 10.5807,12.061 10.5727,12.067 C9.8607,12.556 8.9507,12.833 7.8887,12.833 C5.8577,12.833 4.1387,11.457 3.4937,9.605 L0.8747,9.605 L0.8747,11.648 C2.2197,14.319 4.9287,16 7.8887,16"></path>
                                          <g transform="translate(0 4)">
                                            <mask id="google-mark-b" fill="#fff">
                                              <use xlinkHref="#google-mark-a"></use>
                                            </mask>
                                            <path fill="#FBBC04" d="M3.4639,5.5337 C3.1369,4.5477 3.1359,3.4727 3.4609,2.4757 L3.4639,2.4777 C3.4679,2.4657 3.4749,2.4547 3.4789,2.4427 L3.4939,0.3287 L0.8939,0.3287 C0.8799,0.3577 0.8599,0.3827 0.8459,0.4117 C-0.2821,2.6667 -0.2821,5.3337 0.8459,7.5887 L0.8459,7.5997 C0.8549,7.6167 0.8659,7.6317 0.8749,7.6487 L3.4939,5.6057 C3.4849,5.5807 3.4729,5.5587 3.4639,5.5337" mask="url(#google-mark-b)"></path>
                                          </g>
                                          <mask id="google-mark-d" fill="#fff">
                                            <use xlinkHref="#google-mark-c"></use>
                                          </mask>
                                          <path fill="#EA4335" d="M0.894,4.3291 L3.478,6.4431 C4.113,4.5611 5.843,3.1671 7.889,3.1671 C9.018,3.1451 10.102,3.5781 10.912,4.3671 L13.169,2.0781 C11.733,0.7231 9.85,-0.0219 7.889,0.0001 C4.941,0.0001 2.245,1.6791 0.894,4.3291" mask="url(#google-mark-d)"></path>
                                        </g>
                                      </svg>
                                      <svg className="w-commerce-commercequickcheckoutmicrosofticon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <g fill="none" fillRule="evenodd">
                                          <polygon fill="#F05022" points="7 7 1 7 1 1 7 1"></polygon>
                                          <polygon fill="#7DB902" points="15 7 9 7 9 1 15 1"></polygon>
                                          <polygon fill="#00A4EE" points="7 15 1 15 1 9 7 9"></polygon>
                                          <polygon fill="#FFB700" points="15 15 9 15 9 9 15 9"></polygon>
                                        </g>
                                      </svg>
                                      <div>Pay with browser.</div>
                                    </a>
                                  </div>
                                  <a href="/checkout" data-node-type="cart-checkout-button" className="w-commerce-commercecartcheckoutbutton button add-to-cart" data-loading-text="Hang Tight...">Checkout</a>
                                </div>
                              </div>
                            </form>
                            <div className="w-commerce-commercecartemptystate empty-state">
                              <div aria-live="polite" aria-label="This cart is empty">No items found.</div>
                            </div>
                            <div aria-live="assertive" style={{ display: 'none' }} data-node-type="commerce-cart-error" className="w-commerce-commercecarterrorstate error-message small">
                              <div className="w-cart-error-msg" data-w-cart-quantity-error="Product is not available in this quantity." data-w-cart-general-error="Something went wrong when adding this item to the cart." data-w-cart-checkout-error="Checkout is disabled on this site." data-w-cart-cart_order_min-error="The order minimum was not met. Add more items to your cart to continue." data-w-cart-subscription_error-error="Before you purchase, please use your email invite to verify your address so we can send order updates.">Product is not available in this quantity.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="nav-menu-button-holder clerkplus">
                    <a 
                      href="/login" 
                      id="chameleonbutton" 
                      className="button w-button"
                      style={{ 
                        display: isHeroSignInVisible ? 'none' : 'block',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                        padding: '7px 20px',
                        fontSize: '16px'
                      }}
                    >
                      <span style={{ fontWeight: 400 }}>Sign in</span>
                    </a>
                    <div id="user-button" className="user-button homepage"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="signin" className="section hero-section">
          <div className="container hero-container" style={{ 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="hero-section-holder" style={{ marginTop: '-40px' }}>
              <div className="hero-section-container sneakpeakspace" style={{ 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '800px'
              }}>
                <div className="animate-on-load-01">
                </div>
                <div className="hero-section-header-holder">
                  <div className="animate-on-load-02">
                    <h1 className="hero-title" style={{
                      textAlign: 'center',
                      maxWidth: '800px',
                      margin: '0 auto',
                      fontSize: '48px',
                      lineHeight: '1.2',
                      fontWeight: 300
                    }}>Intelligence for Advancers</h1>
                    <p className="hero-subtitle" style={{
                      textAlign: 'center',
                      maxWidth: '600px',
                      margin: '24px auto 0',
                      fontSize: '20px',
                      lineHeight: '1.4',
                      color: '#9BA1A6'
                    }}>Built on the Advancers Philosophy (<a href="https://advancers.org" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>View</a>)</p>
                  </div>
                </div>
                <div className="hero-section-paragraph-holder">
                  <p className="paragraph-4"></p>
                </div>
                <div className="animate-on-load-04" style={{ display: 'flex', justifyContent: 'center' }}>
                  <a href="/login" className="button w-button" style={{ 
                    minWidth: '160px',
                    textAlign: 'center'
                  }}><span style={{ fontWeight: 400 }}>Try now</span></a>
                </div>
              </div>
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
        <div className="section">
          <div id="features" className="container sneakpeakcontainer">
            <div className="holdingnova">
              <div className="textholdernova">
                <div className="textpoint">
                  <div className="text-block-34">Truth-seeking</div>
                  <div className="text-block-35">Aspires to understand the nature of reality</div>
                </div>
              </div>
              <div className="diamondholdernnova">
                <Image
                  {...criticalImages.aiStar}
                  alt="AI Star"
                  className="image-13"
                  priority={true}
                />
              </div>
              <div className="textholdernova">
                <div className="textpoint">
                  <div className="text-block-34">Empowering</div>
                  <div className="text-block-35">Accelerates the unlock of human potential</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div id="content-wrapper" className="pricing-wrapper">
            <div id="plans" className="container containermobile containerpricing">
              <div className="center-text">
                <div className="title-holder">
                  <div className="title-container">
                    <h2 className="title pricingtitle">Plans</h2>
                  </div>
                </div>
              </div>
              <div className="pricing-holder">
                <div data-current="Tab 1" data-easing="ease" data-duration-in="0" data-duration-out="0" className="pricing-content-tabs w-tabs">
                  <div className="tabs-content w-tab-content">
                    <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active">
                      <div className="pricing-content">
                        <div id="w-node-_2cf8f3e6-80d6-c6d4-9830-3fbe7772c3ba-f0e18ac1" className="pricingcard center procard" style={{ width: '100%' }}>
                          <div className="content">
                            <div className="herologoholder">
                              <Image
                                {...criticalImages.pricingLogo}
                                alt="Pricing logo"
                                className="lgoholer"
                              />
                            </div>
                            <div className="fade-in-on-scroll">
                              <div className="totalvalue">
                                <div className="totalvaluetext">Pro</div>
                              </div>
                              <div className="price">$20<span className="annualy">/ month</span></div>
                            </div>
                            <ul role="list" className="list-2 w-list-unstyled">
                              <li>
                                <div className="list">
                                  <div className="list-text">Everything in Free, plus:</div>
                                </div>
                              </li>
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/Vector_1Vector.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Much more usage than Free</div>
                                </div>
                              </li>
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/Vector_1Vector.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Early access to new features</div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div id="w-node-_780484ad-a70b-6b78-eb15-bb60b06b31ec-f0e18ac1" className="pricingcard center" style={{ width: '100%' }}>
                          <div className="content">
                            <div className="herologoholder">
                              <Image
                                {...criticalImages.pricingLogo}
                                alt="Pricing logo"
                                className="lgoholer"
                              />
                            </div>
                            <div className="fade-in-on-scroll">
                              <div className="totalvalue">
                                <div className="totalvaluetext">Free</div>
                              </div>
                              <div className="price">$0<span className="annualy">/ month</span></div>
                            </div>
                            <ul role="list" className="list-2 w-list-unstyled">
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/Vector_1Vector.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Full functionality</div>
                                </div>
                              </li>
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/Vector_1Vector.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Runs on Grok from xAI</div>
                                </div>
                              </li>
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/Vector_1Vector.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Prompt engineered</div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-w-tab="Tab 2" className="w-tab-pane">
                      <div className="pricing-content">
                        <div id="w-node-_2cf8f3e6-80d6-c6d4-9830-3fbe7772c4a0-f0e18ac1" className="pricingcard center">
                          <div className="content">
                            <div className="fade-in-on-scroll">
                              <div className="totalvalue">
                                <div className="totalvaluetext">Pro</div>
                              </div>
                              <div className="totalvalue2">
                                <div className="totalvaluetext2">Full access to the platform</div>
                              </div>
                              <div className="price">$19 <em className="italic-text-2">$25</em> <span className="annualy">/ month</span></div>
                            </div>
                            <div className="fade-in-on-scroll annualbestvalue">
                              <p className="paragraph">Billed monthly</p>
                            </div>
                            <div className="fade-in-on-scroll">
                              <a href="https://buy.stripe.com/4gw9B48tn6JfaFG3cB" className="button _100width w-button"><strong>Join Now</strong> <em className="italic-text-3">➔</em></a>
                            </div>
                            <ul role="list" className="list-2 w-list-unstyled">
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/check-p-500.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Unlimited access to courses</div>
                                </div>
                              </li>
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/check-p-500.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Receive all course updates</div>
                                </div>
                              </li>
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/check-p-500.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Access the community forums</div>
                                </div>
                              </li>
                              <li>
                                <div className="list">
                                  <Image
                                    src="/images/check-p-500.png"
                                    alt="Check icon"
                                    width={18}
                                    height={18}
                                    className="list-icon"
                                  />
                                  <div className="list-text">Save $250k+ in software deals</div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="pricing" className="section">
          <div id="Early-Access" className="pricing-wrapper"></div>
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
                    <a href="/welcome" className="link-20 pagelink w--current">© 2024 Bird Interfaces, GmbH.</a>
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