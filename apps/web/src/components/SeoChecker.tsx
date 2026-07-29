'use client';

import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface SeoCheckerProps {
  title: string;
  description: string;
  keywords: string;
}

export default function SeoChecker({ title, description, keywords }: SeoCheckerProps) {
  // Title Score
  const titleLen = title.length;
  let titleScore: 'good' | 'ok' | 'bad' = 'bad';
  let titleTip = 'Enter a meta title';
  if (titleLen > 0) {
    if (titleLen < 30) {
      titleScore = 'ok';
      titleTip = 'Title is too short (try for 40-60 chars)';
    } else if (titleLen >= 30 && titleLen <= 65) {
      titleScore = 'good';
      titleTip = 'Perfect title length!';
    } else {
      titleScore = 'ok';
      titleTip = 'Title is too long (keep below 65 chars)';
    }
  }

  // Description Score
  const descLen = description.length;
  let descScore: 'good' | 'ok' | 'bad' = 'bad';
  let descTip = 'Enter a meta description';
  if (descLen > 0) {
    if (descLen < 110) {
      descScore = 'ok';
      descTip = 'Description is too short (try for 120-160 chars)';
    } else if (descLen >= 110 && descLen <= 160) {
      descScore = 'good';
      descTip = 'Perfect description length!';
    } else {
      descScore = 'ok';
      descTip = 'Description is too long (keep below 160 chars)';
    }
  }

  // Keywords Score
  const kwList = keywords.split(',').map(k => k.trim()).filter(Boolean);
  let kwScore: 'good' | 'ok' | 'bad' = 'bad';
  let kwTip = 'Provide meta keywords';
  if (kwList.length > 0) {
    if (kwList.length < 3) {
      kwScore = 'ok';
      kwTip = 'Add more keywords (try at least 3-5 tags)';
    } else {
      kwScore = 'good';
      kwTip = `${kwList.length} keywords set successfully`;
    }
  }

  const scoreIcons = {
    good: <CheckCircle2 className="w-4.5 h-4.5 text-green-400 shrink-0" />,
    ok: <AlertTriangle className="w-4.5 h-4.5 text-yellow-400 shrink-0" />,
    bad: <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />,
  };

  const scoreBg = {
    good: 'border-green-500/10 bg-green-500/5',
    ok: 'border-yellow-500/10 bg-yellow-500/5',
    bad: 'border-red-500/10 bg-red-500/5',
  };

  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3.5">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><Info className="w-4 h-4 text-primary-400" /> Yoast SEO Scorecard</h4>
      
      <div className="space-y-2">
        {/* Title Checker */}
        <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${scoreBg[titleScore]} transition-all`}>
          {scoreIcons[titleScore]}
          <div>
            <p className="text-white text-xs font-bold">Meta Title ({titleLen} chars)</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{titleTip}</p>
          </div>
        </div>

        {/* Description Checker */}
        <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${scoreBg[descScore]} transition-all`}>
          {scoreIcons[descScore]}
          <div>
            <p className="text-white text-xs font-bold">Meta Description ({descLen} chars)</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{descTip}</p>
          </div>
        </div>

        {/* Keywords Checker */}
        <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${scoreBg[kwScore]} transition-all`}>
          {scoreIcons[kwScore]}
          <div>
            <p className="text-white text-xs font-bold">Keywords count ({kwList.length} tags)</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{kwTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
