import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Brain, Zap, Lock, ArrowRight, CheckCircle, GitBranch } from 'lucide-react';
import Button from '@/ui/Button';
import HeroScene from '@/three/HeroScene';
import { ScrollReveal } from '@/animations/ScrollAnimations';
import { fadeUp, staggerContainer, staggerItem } from '@/animations/variants';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '@/utils/constants';

const features = [
  {
    icon: Brain,
    title: 'Multi-Agent Intelligence',
    description: 'Six specialized AI agents collaborate through a coordinated pipeline to analyze, reason, and decide.',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Watch your cases flow through the agent pipeline in real-time with live status tracking.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, JWT authentication, and role-based access control protect your data.',
  },
  {
    icon: GitBranch,
    title: 'Decision Audit Trail',
    description: 'Every agent decision is logged with confidence scores, reasoning, and verification results.',
  },
];

const steps = [
  { step: '01', title: 'Submit Case', description: 'Upload documents and describe your case with relevant details.' },
  { step: '02', title: 'AI Analysis', description: 'Our multi-agent pipeline analyzes, researches, and reasons through your case.' },
  { step: '03', title: 'Verification', description: 'Results are cross-verified for accuracy and consistency.' },
  { step: '04', title: 'Report', description: 'Receive a comprehensive report with recommendations and risk assessment.' },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-aegis-500/15 via-purple-500/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <HeroScene />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aegis-500/10 border border-aegis-500/20 text-aegis-600 dark:text-aegis-400 text-xs font-semibold tracking-wide">
                <Shield size={14} />
                {APP_TAGLINE}
              </span>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-balance text-surface-900 dark:text-white"
            >
              Intelligent Case{' '}
              <span className="gradient-text">Analysis</span>{' '}
              at Scale
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            >
              {APP_DESCRIPTION}
            </motion.p>
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-4 flex-wrap">
              <Button to="/signup" size="lg" icon={ArrowRight}>
                Start Free Trial
              </Button>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg">
                  See How It Works
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900 dark:text-white mb-4">
              Built for <span className="gradient-text">Critical Decisions</span>
            </h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto font-normal text-base">
              Every feature is designed to give you confidence in your most important analyses.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="group rounded-2xl bg-brand-surface border border-surface-200 dark:border-white/[0.08] p-6 hover:border-aegis-500/40 transition-all duration-200 h-full shadow-subtle-card hover:shadow-elevated-card">
                  <div className="p-3 rounded-xl bg-aegis-500/10 border border-aegis-500/20 inline-flex mb-4 group-hover:bg-aegis-500/20 transition-colors">
                    <feature.icon size={22} className="text-aegis-600 dark:text-aegis-400" />
                  </div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed font-normal">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900 dark:text-white mb-4">
              How <span className="gradient-text">{APP_NAME}</span> Works
            </h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto text-base">
              From case submission to actionable report — in four simple steps.
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <ScrollReveal key={step.step} delay={index * 0.12}>
                <div className="flex items-start gap-6 rounded-2xl bg-brand-surface border border-surface-200 dark:border-white/[0.08] p-6 shadow-subtle-card">
                  <div className="shrink-0 h-12 w-12 rounded-xl bg-aegis-500/10 border border-aegis-500/20 flex items-center justify-center text-aegis-600 dark:text-aegis-400 font-extrabold text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400 font-normal">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <CheckCircle size={20} className="text-emerald-500/50 shrink-0 ml-auto mt-1" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 dark:from-[#0a0f1d] dark:via-[#0f172a] dark:to-[#1e1b4b] border border-indigo-500/30 p-10 sm:p-14 shadow-2xl">
              {/* Background ambient lighting */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                  Ready to Transform Your <span className="gradient-text">Analysis?</span>
                </h2>
                <p className="text-slate-300 dark:text-slate-300 mb-8 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-normal">
                  Join teams already using {APP_NAME} to make faster, more confident decisions with multi-agent intelligence.
                </p>
                <Button to="/signup" size="xl" icon={ArrowRight}>
                  Get Started Now
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

