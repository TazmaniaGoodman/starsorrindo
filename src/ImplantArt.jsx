import React from 'react';

export default function ImplantArt() {
  const threads = Array.from({ length: 9 }, (_, i) => i);
  return <div className="implant-art">
    <span className="art-index"><i /> ESTUDO VISUAL <span>FIG. 01</span></span>
    <svg viewBox="0 0 460 418" role="img" aria-label="Ilustração conceitual de uma coroa e um implante dentário">
      <defs>
        <linearGradient id="ceramic" x1="0" y1="0" x2=".9" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#fff8e7"/><stop offset=".48" stopColor="#e4d6b8"/><stop offset="1" stopColor="#8f7447"/>
        </linearGradient>
        <linearGradient id="titanium"><stop stopColor="#776041"/><stop offset=".27" stopColor="#cfba8a"/><stop offset=".48" stopColor="#f4db9e"/><stop offset=".75" stopColor="#957344"/><stop offset="1" stopColor="#6b5234"/></linearGradient>
        <linearGradient id="rim"><stop stopColor="#b38a4d"/><stop offset=".53" stopColor="#f0d79c"/><stop offset="1" stopColor="#9b7745"/></linearGradient>
        <radialGradient id="aura"><stop stopColor="#9f7c3c" stopOpacity=".26"/><stop offset="1" stopColor="#9f7c3c" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="230" cy="207" r="177" fill="url(#aura)"/>
      <g fill="none" stroke="#d2b477" opacity=".22">
        <circle cx="230" cy="207" r="140"/><circle cx="230" cy="207" r="158" strokeDasharray="2 6"/>
        <path d="M45 207h370M230 28v355" strokeDasharray="3 6"/>
        <circle cx="230" cy="207" r="103"/>
      </g>
      <g fill="none" stroke="#c0a066" strokeWidth="1">
        <path d="M109 146h31l20 16m171 119h-29l-24-15"/><circle cx="160" cy="162" r="3"/><circle cx="278" cy="266" r="3"/>
      </g>
      <g fill="#e0cba6" fontSize="9" letterSpacing="2">
        <text x="50" y="149">COROA</text><text x="334" y="285">IMPLANTE</text>
      </g>
      <g transform="rotate(-10 230 210)">
        <path d="M184 92c16-22 33-21 47-15 12 5 25-10 42-6 29 8 31 31 24 56l-11 35c-5 19-17 28-31 28h-47c-18 0-26-16-29-31l-9-36c-3-13 2-23 14-31Z" fill="url(#ceramic)" stroke="#fff1d0" strokeOpacity=".8"/>
        <path d="M181 106c21-13 31 4 48 2s35-17 54-7m-93 15c16-7 28 10 42 6s24-15 42-14" fill="none" stroke="#9c8158" strokeOpacity=".45"/>
        <path d="M192 153c5 16 14 23 29 24h36" fill="none" stroke="#f5e7ca" strokeOpacity=".55"/>
        <path d="M209 215q25-12 50 0v21q-25 11-50 0Z" fill="url(#titanium)" stroke="#b69057"/>
        <ellipse cx="234" cy="215" rx="25" ry="7.5" fill="#ad8c56" stroke="#e4c890"/>
        <ellipse cx="234" cy="215" rx="14" ry="4" fill="#4b3926"/>
        <path d="M202 247q32-12 64 0l-9 77q-5 26-23 27-19-2-24-27Z" fill="url(#titanium)" stroke="#997548"/>
        {threads.map(i => {
          const y = 252 + i * 10, w = 34 - i * 1.6;
          return <path key={i} d={`M${234-w} ${y} Q234 ${y+13-i*.5} ${234+w} ${y-2} l-2 4 Q234 ${y+18-i*.5} ${237-w} ${y+5} Z`} fill="url(#rim)" stroke="#5a442e" strokeWidth=".9"/>;
        })}
      </g>
    </svg>
    <span className="art-caption">IMPLANTE DENTÁRIO <span>Ilustração conceitual</span></span>
  </div>;
}
