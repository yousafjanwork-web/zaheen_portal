/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
// @ts-ignore
const logoUrl = "https://cdn.zaheen.com.pk/zaheen-web-img/zaheen_logo.png";

interface ZaheenLogoProps {
  className?: string;
}

export default function ZaheenLogo({ className = "w-12 h-12" }: ZaheenLogoProps) {
  return (
    <img 
      src={logoUrl} 
      alt="Zaheen MDCAT Prep Logo" 
      className={`${className} object-contain`}
    />
  );
}
