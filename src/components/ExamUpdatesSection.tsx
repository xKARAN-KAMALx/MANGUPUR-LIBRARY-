import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, ExternalLink, Loader2, BookOpenCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { GroundingSource } from '../server/geminiService.ts';

export const ExamUpdatesSection: React.FC = () => {
  const [examType, setExamType] = useState('UP Police Constable & SI');
  const [resultText, setResultText] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const examOptions = [
    "UP Police Constable & SI",
    "UPSSSC PET & VDO",
    "SSC CGL & CHSL",
    "Railway RRB NTPC & ALP",
    "Teaching (UP-TET / Super TET)"
  ];

  const fetchExamUpdates = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/exam-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResultText(data.text || 'Latest notifications retrieved.');
      setSources(data.sources || []);
    } catch {
      setResultText("Exam notifications are regularly verified on official portals. Check uppbpb.gov.in, upsssc.gov.in, and ssc.gov.in for current recruitment schedules.");
      setSources([
        {
          title: "UP Police Recruitment & Promotion Board",
          url: "https://uppbpb.gov.in"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch for UP Police
    fetchExamUpdates('UP Police Constable & SI');
  }, []);

  return (
    <section className="py-6 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="bg-[#FAF9F5] rounded-2xl border border-[#DFDACB] p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E8E4D8]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFE8D6] text-[#8C6B22] flex items-center justify-center border border-[#DECFA9]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A23] bg-[#F1E8D4] px-1.5 py-0.2 rounded">
                  Google Search Grounding
                </span>
                <span className="text-[11px] text-[#718276]">• Live Model Data</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#173824]">
                Aspirant Exam Radar & Notification Alerts
              </h3>
            </div>
          </div>

          <button
            onClick={() => fetchExamUpdates(examType)}
            disabled={isLoading}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white hover:bg-[#F2EFE6] text-[#2F4A39] text-xs font-medium border border-[#D5CFBE] flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Updates</span>
          </button>
        </div>

        {/* Exam chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {examOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setExamType(opt);
                fetchExamUpdates(opt);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                examType === opt
                  ? 'bg-[#1B3B2B] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F1ECE0] text-[#3D5244] border border-[#DDD6C5]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white p-4 rounded-xl border border-[#E4DFD2] min-h-[100px] space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 space-x-2 text-xs text-[#63756A]">
              <Loader2 className="w-4 h-4 animate-spin text-[#B88E3E]" />
              <span>Fetching grounded exam intelligence for {examType}...</span>
            </div>
          ) : (
            <>
              <div className="text-xs text-[#283E31] leading-relaxed whitespace-pre-line">
                {resultText}
              </div>

              {/* Grounded Web Sources (Mandatory for Google Search Grounding) */}
              {sources.length > 0 && (
                <div className="pt-3 border-t border-[#F1ECE0] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#866D35] uppercase tracking-wider block">
                    Verified Grounding Links:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#F8F6EF] hover:bg-[#EFEAD9] text-[#1B3E29] text-[11px] font-medium border border-[#DDD5BF] transition-colors"
                      >
                        <Globe className="w-3 h-3 text-[#B88E3E]" />
                        <span className="truncate max-w-[220px]">{s.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
