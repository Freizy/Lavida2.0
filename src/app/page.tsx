
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { analyzeSymptoms } from '@/ai/flows/symptom-analysis-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AlertCircle, CheckCircle2, Loader2, Stethoscope } from 'lucide-react';

export default function Home() {
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [age, setAge] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validation
    if (!age || !symptoms.trim()) {
      setError('Please provide both age and a description of your symptoms.');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 99) {
      setError('Please enter a valid age between 1 and 99.');
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeSymptoms({
        gender,
        age: ageNum,
        symptoms: symptoms.trim(),
      });
      setResult(response);
    } catch (err) {
      console.error('API Error:', err);
      setError('Oops! Something went wrong while checking your symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadingPlaceholder = PlaceHolderImages.find(img => img.id === 'loading-medical');

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-background">
      <main className="w-full max-w-[320px] flex flex-col gap-8">
        <header className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary rounded-full shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            LaVida Health Buddy 😎
          </h1>
          <p className="text-sm text-muted-foreground">
            Simple, quick symptom analysis powered by AI.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
              className="lavida-input cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium">Age (1-99)</label>
            <input
              id="age"
              type="number"
              min="1"
              max="99"
              placeholder="e.g. 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="lavida-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="symptoms" className="text-sm font-medium">Symptoms</label>
            <textarea
              id="symptoms"
              rows={4}
              placeholder="Describe how you feel..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="lavida-input resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="lavida-button mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </span>
            ) : (
              'Check Symptoms'
            )}
          </button>
        </form>

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4 pt-4 animate-in fade-in duration-500">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
              {loadingPlaceholder && (
                <Image
                  src={loadingPlaceholder.imageUrl}
                  alt="Loading animation"
                  fill
                  className="object-cover animate-pulse"
                  data-ai-hint={loadingPlaceholder.imageHint}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            </div>
            <p className="font-semibold text-primary animate-bounce">Loading possible Conditions...</p>
          </div>
        )}

        {error && (
          <div className="lavida-error-panel flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <section className="mt-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 border-b-2 border-primary pb-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold uppercase tracking-wide">Analysis Result</h2>
            </div>
            <div className="space-y-4 font-bold text-foreground/90 leading-relaxed">
              {result.split('\n').filter(p => p.trim() !== '').map((paragraph, idx) => (
                <p key={idx} className="bg-white/50 p-3 rounded-lg border-l-4 border-primary shadow-sm">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-12 text-center text-xs text-muted-foreground pb-8">
          <p>© {new Date().getFullYear()} LaVidaWeb Health Buddy</p>
          <p className="mt-1 italic">Disclaimer: This is an AI assistant, not a substitute for professional medical advice.</p>
        </footer>
      </main>
    </div>
  );
}
