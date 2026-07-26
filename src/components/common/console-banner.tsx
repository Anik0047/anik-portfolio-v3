'use client';
import { useEffect } from 'react';

function logBanner() {
  console.log(
    `%c
   █████╗ ███╗   ██╗██╗██╗  ██╗    ██████╗  █████╗ ██████╗ ██╗   ██╗ █████╗ 
  ██╔══██╗████╗  ██║██║██║ ██╔╝    ██╔══██╗██╔══██╗██╔══██╗██║   ██║██╔══██╗
  ███████║██╔██╗ ██║██║█████╔╝     ██████╔╝███████║██████╔╝██║   ██║███████║
  ██╔══██║██║╚██╗██║██║██╔═██╗     ██╔══██╗██╔══██║██╔══██╗╚██╗ ██╔╝██╔══██║
  ██║  ██║██║ ╚████║██║██║  ██╗    ██║  ██║██║  ██║██║  ██║ ╚████╔╝ ██║  ██║
  ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝    ██████╗ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝
  %c%c`,
    'color: #ccff00; font: 400 1em monospace;',
    '',
    'background-color: #d2ff00; color: black; font: 400 1em monospace; padding: 0.5em 0; font-weight: bold;',
    '',
  );
}

export function ConsoleBanner() {
  useEffect(() => {
    logBanner();
  }, []);

  return null;
}
