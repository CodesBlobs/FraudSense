'use client';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Lock, FileText } from 'lucide-react';
import { curriculum } from '@/lib/curriculum';

export default function LessonsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    // Load completion progress from localStorage
    const savedProgress = localStorage.getItem('completed_lessons');
    if (savedProgress) {
      setCompletedLessons(JSON.parse(savedProgress));
    }
  }, []);

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-sm text-center bg-white border border-slate-200 p-6 rounded-xl">
            <Lock className="mx-auto mb-3 text-slate-300" size={36} />
            <h2 className="mb-1 text-lg font-bold text-slate-900">Members Only</h2>
            <p className="text-sm text-slate-500 mb-4">
              Sign in to access the training curriculum.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Go Home to Sign In
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={24} className="text-emerald-600" />
            Academy
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            5 units · 50 lessons covering the most common scam tactics
          </p>
        </div>

        <div className="space-y-3">
          {curriculum.map((unit) => {
            const Icon = unit.icon;
            const isExpanded = expandedUnit === unit.id;

            return (
              <div 
                key={unit.id}
                className={`overflow-hidden rounded-xl border bg-white transition-all ${
                  isExpanded ? 'border-slate-300 shadow-sm' : 'border-slate-200'
                }`}
              >
                <div 
                  className="flex cursor-pointer items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${unit.color}12` }}>
                      <Icon size={20} style={{ color: unit.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Unit {unit.id}: {unit.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{unit.lessons.length} lessons</p>
                    </div>
                  </div>
                  <span className={`text-xs text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-5 animate-fade-in">
                    <div className="grid gap-4 md:grid-cols-2">
                      {unit.lessons.map((lesson) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        return (
                          <Link 
                            key={lesson.id} 
                            href={`/lessons/${unit.id}/${lesson.id}`}
                            className="group block rounded-lg bg-white p-4 border border-slate-100 transition-all hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                <FileText size={14} className="text-slate-400 group-hover:text-blue-400" />
                                {lesson.title}
                              </h4>
                              {isCompleted && (
                                <CheckCircle size={14} className="text-emerald-500" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mb-0 leading-relaxed line-clamp-2">
                              {lesson.description}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
