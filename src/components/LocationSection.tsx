import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, Loader2, Sparkles, Bus, Train, Milestone } from 'lucide-react';
import { GroundingSource } from '../server/geminiService.ts';

export const LocationSection: React.FC = () => {
  const [startingPoint, setStartingPoint] = useState('');
  const [transitResult, setTransitResult] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const quickRoutes = [
    "Bharthana Railway Station",
    "Etawah City / Bus Stand",
    "Bakewar Market",
    "Usrahar Road"
  ];

  const fetchDirectionsGuide = async (origin: string) => {
    setIsLoading(true);
    setTransitResult(null);
    setSources([]);
    try {
      let lat: number | undefined;
      let lng: number | undefined;

      // Try reading user coordinates if permitted
      if ('geolocation' in navigator) {
        try {
          const pos: any = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // Geolocation optional, proceed without it
        }
      }

      const res = await fetch('/api/gemini/transit-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, lat, lng })
      });
      const data = await res.json();
      setTransitResult(data.text || 'Directions route guidance generated.');
      setSources(data.sources || []);
    } catch (err) {
      setTransitResult("From Bharthana, follow the main rural connecting road to Mangupur village (approx. 4-5 km). Auto-rickshaws and bikes operate regularly throughout the day.");
      setSources([
        {
          title: "Mangupur Library Google Maps Pin",
          url: "https://maps.app.goo.gl/CSsLMCseLBrxoKgL9"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="directions" className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#DFDBCF] shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#FAF9F5] border-b border-[#EAE7DC] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8F6F26] bg-[#F7F2E6] px-3 py-1 rounded-full border border-[#E1D4B7]">
              Visit & Commute
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#143020] mt-1.5">
              Location & Travel Directions
            </h2>
            <p className="text-xs text-[#526357] mt-0.5">
              Mangupur, Bharthana, Etawah, Uttar Pradesh, India
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/CSsLMCseLBrxoKgL9"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#142E21] text-[#FAF9F5] text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors self-start md:self-auto"
          >
            <Navigation className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>Open in Google Maps App</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Address details & quick info */}
          <div className="space-y-4">
            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E9E6DA] space-y-2.5">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#B88E3E] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[#193623]">Address & Landmark</h3>
                  <p className="text-xs text-[#4E5E53] leading-relaxed mt-0.5">
                    Mangupur Village, Post Bharthana, District Etawah, Uttar Pradesh - 206242, India.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#ECE8DC] text-xs">
                <div className="flex items-center space-x-2 text-[#44584B]">
                  <Train className="w-4 h-4 text-[#B88E3E]" />
                  <span>Bharthana Rly Stn: ~4.5 km</span>
                </div>
                <div className="flex items-center space-x-2 text-[#44584B]">
                  <Bus className="w-4 h-4 text-[#B88E3E]" />
                  <span>Etawah Bus Stand: ~22 km</span>
                </div>
              </div>
            </div>

            {/* Static visual representation of Google Maps location */}
            <div className="bg-[#F0EEE6] rounded-xl border border-[#DFDACB] p-4 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center mx-auto shadow-xs">
                <Compass className="w-5 h-5 text-[#E5C378]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#183623]">Ready to travel for self-study?</h4>
                <p className="text-xs text-[#526357] max-w-sm mx-auto mt-0.5">
                  Click below to open GPS navigation directly to the entrance of Mangupur Library.
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/CSsLMCseLBrxoKgL9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-[#C5BFAD] text-xs font-semibold text-[#1C3A27] hover:bg-[#FAF9F5] transition-colors"
              >
                <span>Navigate via https://maps.app.goo.gl/CSsLMCseLBrxoKgL9</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: AI-Powered Travel Assistant with Google Maps Grounding */}
          <div className="bg-[#FAF8F2] p-4 sm:p-5 rounded-xl border border-[#E6DECB] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-1.5 mb-1 text-[#8A6A23]">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Google Maps Grounding
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#193824]">
                Smart Route & Commute Finder
              </h3>
              <p className="text-xs text-[#55695C] mt-0.5">
                Powered by Gemini 3.8 Flash with live Maps data. Plan your travel from your home village or station.
              </p>

              {/* Quick suggestion buttons */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {quickRoutes.map((route) => (
                  <button
                    key={route}
                    onClick={() => {
                      setStartingPoint(route);
                      fetchDirectionsGuide(route);
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] bg-white hover:bg-[#F3EFE4] text-[#2C4434] border border-[#D5CEBA] transition-colors"
                  >
                    From {route}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Enter your village/town (e.g., Jaswantnagar, Bakewar)..."
                  value={startingPoint}
                  onChange={(e) => setStartingPoint(e.target.value)}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-[#D0C7B2] bg-white text-xs text-[#1C3625] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
                />
                <button
                  onClick={() => fetchDirectionsGuide(startingPoint || 'Bharthana Junction')}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1B3B2B] text-white text-xs font-semibold hover:bg-[#142F21] disabled:opacity-50 flex items-center space-x-1 shrink-0"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Find Route</span>}
                </button>
              </div>
            </div>

            {/* Grounded Result Display */}
            {transitResult && (
              <div className="p-3 bg-white rounded-lg border border-[#DDD4BD] space-y-2 animate-in fade-in duration-200">
                <div className="text-xs text-[#284333] leading-relaxed whitespace-pre-line">
                  {transitResult}
                </div>

                {/* Grounding Source Links (Mandatory when using Maps Grounding) */}
                {sources.length > 0 && (
                  <div className="pt-2 border-t border-[#F1EBDC] space-y-1">
                    <span className="text-[10px] font-bold text-[#866D35] uppercase tracking-wider block">
                      Google Maps Places & Grounded Links:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#FAF7EE] hover:bg-[#F2EDDE] text-[#2C4835] text-[10px] font-medium border border-[#D9D0B8] transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-[#B88E3E]" />
                          <span className="truncate max-w-[200px]">{s.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
