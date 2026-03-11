import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Onboarding() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const semesters = useStore((s) => s.semesters);
  const updateSemester = useStore((s) => s.updateSemester);

  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name === 'Estudante' ? '' : profile.name);

  const activeSem = semesters.find((s) => s.active);
  const [semName, setSemName] = useState(activeSem?.name || '2025/1');
  const [semStart, setSemStart] = useState(activeSem?.startDate || '2025-03-03');
  const [semEnd, setSemEnd] = useState(activeSem?.endDate || '2025-07-12');

  const steps = [
    // Welcome
    () => (
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
          Bem-vindo ao Study<span className="text-primary">OS</span>
        </h1>
        <p className="text-text-secondary text-sm font-body max-w-md mx-auto mb-8">
          Seu sistema pessoal de gestão acadêmica. Vamos configurar tudo em poucos passos.
        </p>
        <button onClick={() => setStep(1)} className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus">
          Começar
        </button>
      </div>
    ),
    // Name
    () => (
      <div className="text-center max-w-sm mx-auto">
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Como você se chama?</h2>
        <p className="text-text-secondary text-sm mb-6">Esse nome será usado na saudação do dashboard.</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          className="w-full h-11 px-4 rounded-md bg-secondary border border-border text-center text-foreground font-heading glow-focus mb-6"
          autoFocus
        />
        <button
          onClick={() => { if (name.trim()) { updateProfile({ name: name.trim() }); setStep(2); } }}
          className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus"
        >
          Continuar
        </button>
      </div>
    ),
    // Semester
    () => (
      <div className="text-center max-w-sm mx-auto">
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Semestre atual</h2>
        <p className="text-text-secondary text-sm mb-6">Configure o período do seu semestre.</p>
        <div className="space-y-3 mb-6">
          <input value={semName} onChange={(e) => setSemName(e.target.value)} placeholder="2025/1" className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-sm text-foreground text-center font-heading" />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={semStart} onChange={(e) => setSemStart(e.target.value)} className="h-10 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            <input type="date" value={semEnd} onChange={(e) => setSemEnd(e.target.value)} className="h-10 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
          </div>
        </div>
        <button
          onClick={() => {
            if (activeSem) updateSemester(activeSem.id, { name: semName, startDate: semStart, endDate: semEnd });
            setStep(3);
          }}
          className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus"
        >
          Continuar
        </button>
      </div>
    ),
    // Done
    () => (
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Tudo pronto! 🎉</h2>
        <p className="text-text-secondary text-sm font-body max-w-md mx-auto mb-8">
          Seu StudyOS está configurado com dados de exemplo. Explore o dashboard, adicione suas disciplinas e comece a organizar seus estudos.
        </p>
        <button
          onClick={completeOnboarding}
          className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus"
        >
          Abrir StudyOS
        </button>
      </div>
    ),
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : i < step ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-border'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {steps[step]()}
          </motion.div>
        </AnimatePresence>

        {step > 0 && step < 3 && (
          <div className="text-center mt-8">
            <button onClick={completeOnboarding} className="text-xs text-text-tertiary hover:text-text-secondary transition-colors font-heading">
              Pular configuração
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
