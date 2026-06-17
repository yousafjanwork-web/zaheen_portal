/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom'; // 1. Link import karein
// @ts-ignore
import logoUrl from '../../assets/images/zaheen_logo.png';

interface ZaheenLogoProps {
  className?: string;
}

export default function ZaheenLogo({ className = "w-12 h-12" }: ZaheenLogoProps) {
  return (
    // 2. Link se wrap karein aur "to" path dein
    <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
      <img 
        src={logoUrl} 
        alt="Zaheen MDCAT Prep Logo" 
        className={`${className} object-contain`}
      />
    </Link>
  );
}