'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { curriculum } from '@/lib/curriculum';
import { ArrowLeft, CheckCircle2, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Quiz State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already completed
    const progress = localStorage.getItem('completed_lessons');
    if (progress) {
      const completed = JSON.parse(progress);
      if (completed.includes(params.lessonId)) {
        setIsCompleted(true);
      }
    }
  }, [params.lessonId]);

  const lesson = useMemo(() => {
    const unit = curriculum.find(u => u.id.toString() === params.unitId);
    return unit?.lessons.find(l => l.id === params.lessonId);
  }, [params.unitId, params.lessonId]);

  if (!mounted) return null;
  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-xl font-bold">Lesson not found</h1>
        <Link href="/lessons" className="mt-4 text-blue-600 hover:underline">Back to Academy</Link>
      </div>
    );
  }

  const handleMarkComplete = () => {
    const progress = localStorage.getItem('completed_lessons');
    const completed = progress ? JSON.parse(progress) : [];
    if (!completed.includes(lesson.id)) {
      completed.push(lesson.id);
      localStorage.setItem('completed_lessons', JSON.stringify(completed));
    }
    setIsCompleted(true);
    // Optional: add score or confetti
  };

  const isCorrect = selectedOption === lesson.quiz.answerIndex;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Breadcrumbs / Back button */}
        <button 
          onClick={() => router.push('/lessons')}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Academy
        </button>

        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
          {/* Header */}
          <header className="mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              <BookOpen size={12} />
              Unit {params.unitId}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight lg:text-4xl">
              {lesson.title}
            </h1>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              {lesson.description}
            </p>
          </header>

          {/* Tips / Stay Safe Box */}
          <div className="mb-10 rounded-xl bg-emerald-50 p-6 border border-emerald-100">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-800">
              <CheckCircle2 size={16} />
              Key Safety Tips
            </h3>
            <ul className="space-y-3">
              {lesson.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-emerald-700 leading-snug">
                  <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Content */}
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
             {lesson.content.split('\n\n').map((para, i) => (
               <p key={i} className="mb-4">{para}</p>
             ))}
          </div>

          <div className="my-12 border-t border-slate-100" />

          {/* Quiz Section */}
          <section id="quiz">
            <h3 className="mb-8 text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-xs">?</span>
              Check Your Knowledge
            </h3>

            <div className="space-y-3">
              <p className="mb-6 font-semibold text-slate-800">{lesson.quiz.question}</p>
              {lesson.quiz.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    selectedOption === idx 
                      ? isSubmitted 
                        ? isCorrect 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-red-500 bg-red-50 text-red-900'
                        : 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{option}</span>
                  {isSubmitted && idx === lesson.quiz.answerIndex && (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  )}
                  {isSubmitted && selectedOption === idx && !isCorrect && (
                    <AlertCircle size={18} className="text-red-600" />
                  )}
                </button>
              ))}
            </div>

            {!isSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={() => setIsSubmitted(true)}
                className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-4 font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-30"
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-8 animate-fade-in">
                <div className={`rounded-xl p-6 mb-8 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-bold mb-2 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite right.'}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {lesson.quiz.explanation}
                  </p>
                </div>
                
                {!isCompleted ? (
                   <button 
                    onClick={handleMarkComplete}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition-all hover:bg-blue-700"
                  >
                    Mark Lesson as Completed
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 bg-emerald-50 rounded-xl border border-emerald-100">
                     <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                     <p className="font-bold text-emerald-800">Lesson Completed!</p>
                     <Link href="/lessons" className="mt-2 text-sm text-emerald-600 hover:underline">Return to Academy</Link>
                  </div>
                )}
              </div>
            )}
          </section>
        </article>
      </main>
    </div>
  );
}
