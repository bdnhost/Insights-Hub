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

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
    <div className={`bg-brand-secondary/60 backdrop-blur-sm border border-brand-accent/50 p-4 sm:p-6 rounded-2xl shadow-lg ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
            <div className="text-brand-cyan flex-shrink-0">{icon}</div>
            <h3 className="text-xl font-semibold text-brand-text tracking-wide">{title}</h3>
        </div>
        <div className="space-y-4 text-brand-text/90">
            {children}
        </div>
    </div>
);

const TrendChart: React.FC<{ data: Trend[] }> = ({ data }) => {
    const chartData = data.map(t => ({ name: t.name, confidence: t.confidence }));
    return (
        <div className="h-64 w-full -ml-4">
            <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#415A77" strokeOpacity={0.5} />
                    <XAxis type="number" domain={[0, 100]} stroke="#778DA9" tick={{ fill: '#778DA9', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#778DA9" width={100} tick={{ fill: '#E0E1DD', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: 'rgba(0, 245, 212, 0.1)' }}
                        contentStyle={{ backgroundColor: '#1B263B', border: '1px solid #415A77', borderRadius: '0.75rem' }}
                        labelStyle={{ color: '#E0E1DD' }}
                    />
                    <Bar dataKey="confidence" fill="#00F5D4" barSize={15} radius={[0, 10, 10, 0]} />
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
        <div className="space-y-8 animate-fade-in-up" dir="rtl">
            <SectionCard title="תקציר מנהלים" icon={<ClipboardListIcon />} className="md:col-span-2">
                <p className="leading-relaxed">{result.summary}</p>
            </SectionCard>
            
            <div className="grid md:grid-cols-2 gap-8">
                <SectionCard title="נושאים מרכזיים" icon={<TagIcon />}>
                    <ul className="flex flex-wrap gap-2">
                        {result.topics.map((topic, i) => <li key={i} className="bg-brand-primary/80 text-brand-cyan font-medium py-1 px-3 rounded-full text-sm border border-brand-accent/50">{topic}</li>)}
                    </ul>
                </SectionCard>

                <SectionCard title="הזדמנויות פוטנציאליות" icon={<LightBulbIcon />}>
                    {result.opportunities.map((opp, i) => (
                        <div key={i} className="border-b border-brand-accent/30 pb-3 last:border-b-0 last:pb-0">
                            <h4 className="font-semibold">{opp.title} <span className="text-xs font-normal bg-brand-cyan/10 text-brand-cyan py-0.5 px-1.5 rounded-md">({opp.potential_score}/100)</span></h4>
                            <p className="text-sm text-brand-light mt-1">{opp.description}</p>
                        </div>
                    ))}
                </SectionCard>
            </div>
            
            <SectionCard title="מגמות ודפוסים" icon={<TrendingUpIcon />} className="md:col-span-2">
                <TrendChart data={result.trends} />
                <div className="space-y-2 pt-4">
                {result.trends.map((trend, i) => (
                    <details key={i} className="text-sm bg-brand-primary/50 p-3 rounded-lg">
                        <summary className="cursor-pointer font-medium hover:text-brand-cyan transition-colors">
                          {trend.name}
                          <span className="text-xs font-normal text-brand-cyan ml-2">({trend.confidence}/100)</span>
                        </summary>
                        <p className="pl-4 pt-2 text-brand-light border-r-2 border-brand-accent/50 mr-1 pr-3">{trend.description}</p>
                    </details>
                ))}
                </div>
            </SectionCard>
            
            <SectionCard title="שאל שאלה על המידע" icon={<QuestionMarkCircleIcon />} className="md:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="למשל: מה הפוטנציאל העסקי של המידע הזה?"
                        className="w-full bg-brand-primary p-3 rounded-lg border border-brand-accent/50 focus:ring-2 focus:ring-brand-cyan focus:outline-none transition-all duration-300 placeholder:text-brand-accent"
                        rows={3}
                    />
                    <button 
                        type="submit" 
                        disabled={isQuerying || !query.trim()}
                        className="w-full bg-gradient-to-r from-brand-light to-gray-300 text-brand-primary font-bold py-2.5 px-4 rounded-lg hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-400/20 active:scale-[0.98] transition-all duration-300 ease-in-out disabled:from-brand-accent disabled:to-brand-light disabled:text-brand-secondary disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center space-x-2"
                    >
                        {isQuerying ? <Spinner /> : <SendIcon />}
                        <span>{isQuerying ? 'חושב...' : 'שלח שאילתה'}</span>
                    </button>
                </form>
                
                {queryResult && (
                    <div className="mt-6 animate-fade-in">
                        <div className="flex items-start space-x-3 space-x-reverse">
                            <div className="flex-shrink-0">
                               <RobotIcon />
                            </div>
                            <div className="flex-1 bg-brand-primary/60 p-4 rounded-xl border border-brand-accent/50">
                                <h4 className="font-semibold mb-2 text-brand-cyan">תשובת ה-AI:</h4>
                                <p className="whitespace-pre-wrap leading-relaxed text-brand-text/90">{queryResult}</p>
                            </div>
                        </div>
                    </div>
                )}
            </SectionCard>
        </div>
    );
};

// Icons
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>;
const LightBulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const QuestionMarkCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const RobotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-cyan bg-brand-secondary p-1.5 rounded-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>