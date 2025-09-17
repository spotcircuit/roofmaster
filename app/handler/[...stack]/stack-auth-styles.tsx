'use client';

import { useEffect } from 'react';

export default function StackAuthStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Make Stack Auth text white */
      .stack-scope h1,
      .stack-scope h2,
      .stack-scope h3,
      .stack-scope p,
      .stack-scope span:not(button span),
      .stack-scope label,
      .stack-scope a {
        color: white !important;
      }

      /* Hide ONLY sign up link, not the heading */
      .stack-scope a[href*="sign-up"],
      .stack-scope p:has(a[href*="sign-up"]) {
        display: none !important;
      }

      /* Hide forgot password link */
      .stack-scope a[href*="forgot"],
      .stack-scope a[href*="password-reset"],
      .stack-scope p:has(a[href*="forgot"]),
      .stack-scope p:has(a[href*="password-reset"]) {
        display: none !important;
      }

      /* Hide email and password input fields and their labels */
      .stack-scope input[type="email"],
      .stack-scope input[type="password"],
      .stack-scope label[for*="email"],
      .stack-scope label[for*="password"],
      .stack-scope input[name*="email"],
      .stack-scope input[name*="password"] {
        display: none !important;
      }

      /* Hide show/hide password toggle button/icon */
      .stack-scope button[aria-label*="password"],
      .stack-scope button[aria-label*="Password"],
      .stack-scope button[type="button"]:has(svg),
      .stack-scope [aria-label*="toggle password"],
      .stack-scope [aria-label*="show password"],
      .stack-scope [aria-label*="hide password"] {
        display: none !important;
      }


      /* Hide the Sign In submit button (usually at the bottom) */
      .stack-scope button[type="submit"]:not([aria-label*="Google"]):not([aria-label*="GitHub"]) {
        display: none !important;
      }


      /* Style GitHub button with dark background */
      .stack-scope button[aria-label*="GitHub"] {
        background: #24292e !important;
        color: white !important;
      }

      /* Style Google button with white background */
      .stack-scope button[aria-label*="Google"] {
        background: white !important;
        color: black !important;
      }

      /* Keep button text its original color */
      .stack-scope button span {
        color: inherit !important;
      }
    `;
    document.head.appendChild(style);

    // Add "Sign in to your account" heading if it doesn't exist
    // and hide "Or continue with" text
    setTimeout(() => {
      const stackScope = document.querySelector('.stack-scope');
      if (stackScope && !stackScope.querySelector('h2.custom-heading')) {
        const firstButton = stackScope.querySelector('button');
        if (firstButton && !document.querySelector('h2.custom-heading')) {
          const heading = document.createElement('h2');
          heading.className = 'custom-heading';
          heading.textContent = 'Sign in to your account';
          heading.style.cssText = 'color: white; text-align: center; margin-bottom: 24px; font-size: 24px; font-weight: 600;';
          firstButton.parentElement?.insertBefore(heading, firstButton);
        }
      }

    }, 100);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null;
}