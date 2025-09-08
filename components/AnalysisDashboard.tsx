
import React, { useState } from 'react';
import type { AnalysisResult, Trend, Opportunity } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Spinner } from './Spinner';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onQuery: (query: string) => void;
  isQuerying: boolean;
  queryResult: string | null;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-brand-primary/50 p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
            <div className="text-brand-cyan">{icon}</div>
            <h3 className="text-xl font-semibold text-brand-light tracking-wide">{title}</h3>
        </div>
        <div className="space-y-4 text-brand-text/90">
            {children}
        </div>
    </div>
);

const TrendChart: React.FC<{ data: Trend[] }> = ({ data }) => {
    const chartData = data.map(t => ({ name: t.name, confidence: t.confidence }));
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#415A77" />
                    <XAxis type="number" domain={[0, 100]} stroke="#778DA9" />
                    <YAxis dataKey="name" type="category" stroke="#778DA9" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip
                        cursor={{ fill: 'rgba(119, 141, 169, 0.2)' }}
                        contentStyle={{ backgroundColor: '#1B263B', border: '1px solid #415A77' }}
                    />
                    <Bar dataKey="confidence" fill="#00F5D4" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onQuery, isQuerying, queryResult }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim()) {
            onQuery(query);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in" dir="rtl">
            <SectionCard title="תקציר מנהלים" icon={<ClipboardListIcon />}>
                <p>{result.summary}</p>
            </SectionCard>
            
            <div className="grid md:grid-cols-2 gap-8">
                <SectionCard title="נושאים מרכזיים" icon={<TagIcon />}>
                    <ul className="list-disc list-inside space-y-2">
                        {result.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                    </ul>
                </SectionCard>

                <SectionCard title="הזדמנויות פוטנציאליות" icon={<LightBulbIcon />}>
                    {result.opportunities.map((opp, i) => (
                        <div key={i} className="border-b border-brand-accent pb-2 last:border-b-0 last:pb-0">
                            <h4 className="font-semibold">{opp.title} <span className="text-xs font-normal text-brand-cyan">({opp.potential_score}/100)</span></h4>
                            <p className="text-sm text-brand-light">{opp.description}</p>
                        </div>
                    ))}
                </SectionCard>
            </div>
            
            <SectionCard title="מגמות ודפוסים" icon={<TrendingUpIcon />}>
                <TrendChart data={result.trends} />
                {result.trends.map((trend, i) => (
                    <details key={i} className="text-sm">
                        <summary className="cursor-pointer font-medium hover:text-brand-cyan">{trend.name}</summary>
                        <p className="pl-4 pt-1 text-brand-light">{trend.description}</p>
                    </details>
                ))}
            </SectionCard>
            
            <SectionCard title="שאל שאלה על המידע" icon={<QuestionMarkCircleIcon />}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="למשל: מה הפוטנציאל העסקי של המידע הזה?"
                        className="w-full bg-brand-primary p-3 rounded-lg border border-brand-accent focus:ring-2 focus:ring-brand-cyan focus:outline-none transition-all"
                        rows={3}
                    />
                    <button 
                        type="submit" 
                        disabled={isQuerying}
                        className="w-full bg-brand-light text-brand-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 disabled:bg-brand-accent disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isQuerying ? <Spinner /> : 'שלח שאילתה'}
                    </button>
                </form>

                {isQuerying && <div className="text-center p-4 text-brand-light animate-pulse">ה-AI חושב על תשובה...</div>}
                
                {queryResult && (
                    <div className="mt-4 p-4 bg-brand-primary rounded-lg border border-brand-accent">
                        <h4 className="font-semibold mb-2 text-brand-cyan">תשובת ה-AI:</h4>
                        <p className="whitespace-pre-wrap">{queryResult}</p>
                    </div>
                )}
            </SectionCard>
        </div>
    );
};

// Icons
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-4-4-4m12 8l4-4-4-4" /></svg>;
const LightBulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const QuestionMarkCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

