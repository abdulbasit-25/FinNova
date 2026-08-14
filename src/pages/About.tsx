import {
  Github,
  ExternalLink,
  Mail,
  Sparkles,
  Shield,
  BarChart3,
  Wallet,
  Target,
  Star,
  Activity,
  Globe,
  Linkedin,
  MessageCircle,
  Tag,
  Code2,
  CalendarClock,
  Download,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 px-4 sm:px-0">
      {/* Self-contained gradient keyframes — no tailwind.config changes needed */}
      <style>{`
        @keyframes finova-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* HERO */}
      <motion.section
        className="relative text-center py-10 sm:py-12 space-y-6 sm:space-y-8"
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Badge */}
        <div
          className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full
                     bg-gradient-to-r from-primary/20 to-primary/10
                     text-primary text-xs font-semibold tracking-wide
                     transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/40"
        >
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse text-primary" />
          Your Money, Your Power
        </div>

        {/* Hero Heading with gradient animation */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent
                     bg-gradient-to-r from-primary via-foreground to-accent
                     bg-[length:200%_200%]"
          style={{ animation: 'finova-gradient 8s ease infinite' }}
        >
          Meet <span className="text-accent">FinNova</span>
        </h1>

        {/* Description Card */}
        <div
          className="relative max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl
                     bg-card/70 backdrop-blur-xl border border-border
                     transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20"
        >
          <Star className="absolute top-4 left-6 h-4 w-4 text-primary/50 animate-bounce" />
          <Activity className="absolute bottom-4 right-8 h-5 w-5 text-accent/50 animate-bounce [animation-delay:0.4s]" />

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            <span className="font-bold text-foreground">FinNova</span> ={' '}
            <span className="text-primary font-semibold">Finance</span> +{' '}
            <span className="text-primary font-semibold">Nova</span>. A
            bright new star in personal finance — track your spending,
            visualize your money, and take full control with a clean,
            powerful dashboard.{' '}
            <span className="text-accent font-semibold">
              Simple. Insightful. Smart.
            </span>
          </p>
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-hidden rounded-[28px] border border-border/80 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 sm:p-8 shadow-lg shadow-primary/5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Download className="h-3.5 w-3.5" />
              APK Available
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Install FinNova on Android
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Download the latest FinNova APK and take your budget, spending insights,
                and financial planning with you wherever you go.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() =>
                  window.open(
                    'https://drive.google.com/file/d/1ZawANOFho0W4GgwsKifuQ-FTQ4uCpweq/view',
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
              >
                <Download className="h-4 w-4" />
                Download APK
              </Button>

              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Safe and ready to install
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
            <div className="relative flex h-32 w-24 items-center justify-center rounded-[28px] border border-border/80 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[24px] bg-gradient-to-b from-primary/10 to-background p-3">
                <Smartphone className="h-10 w-10 text-primary" />
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Android
                  </p>
                  <p className="text-lg font-bold text-foreground">FinNova</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="glass-card p-6 sm:p-8 rounded-2xl space-y-6
                   relative overflow-hidden
                   hover:shadow-2xl transition-all duration-300"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2 className="text-xl font-semibold text-foreground">
          Meet the Creator
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div
            className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl bg-gradient-to-br
                       from-primary/40 to-primary/10
                       flex items-center justify-center
                       text-primary text-2xl font-bold
                       shadow-lg ring-1 ring-primary/20
                       transition-all duration-300 hover:scale-105 hover:ring-primary/50 hover:shadow-primary/30"
          >
            AB
          </div>

          {/* Info */}
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Abdul Basit (Archer)
              </h3>
              <p className="text-sm text-muted-foreground">
                Full Stack Developer & UI/UX Designer
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              I design and build intuitive digital experiences that
              simplify complex workflows. FinNova is crafted with
              performance, usability, and modern design principles.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 pt-4">
              <HoverButton
                icon={<ExternalLink className="h-4 w-4" />}
                label="Portfolio"
                hoverClass="hover:bg-primary hover:text-primary-foreground"
                onClick={() =>
                  window.open('https://abdulbasit-archer.vercel.app/', '_blank')
                }
              />
              <HoverButton
                icon={<Github className="h-4 w-4" />}
                label="GitHub"
                hoverClass="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                onClick={() =>
                  window.open('https://github.com/abdulbasit-25', '_blank')
                }
              />
              <HoverButton
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
                hoverClass="hover:bg-[#0A66C2] hover:text-white"
                onClick={() =>
                  window.open(
                    'https://www.linkedin.com/in/abdul-basit-741977295/',
                    '_blank',
                  )
                }
              />
              <HoverButton
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                hoverClass="hover:bg-red-500 hover:text-white"
                onClick={() =>
                  (window.location.href = 'mailto:abdulbasit.alpha25@gmail.com')
                }
              />
              <HoverButton
                icon={<MessageCircle className="h-4 w-4" />}
                label="WhatsApp"
                hoverClass="hover:bg-[#25D366] hover:text-white"
                onClick={() =>
                  window.open('https://wa.me/923415878569', '_blank')
                }
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* APP FEATURES */}
      <motion.section
        className="glass-card p-6 rounded-2xl space-y-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Built for Simplicity & Power
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            FinNova helps you track income, manage expenses, set budgets,
            and analyze spending patterns — all with a clean, intuitive
            interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <FeatureCard icon={<Wallet className="h-4 w-4" />} title="Income & Expenses" />
          <FeatureCard icon={<BarChart3 className="h-4 w-4" />} title="Smart Analytics" />
          <FeatureCard icon={<Target className="h-4 w-4" />} title="Budget & Goals" />
          <FeatureCard icon={<Globe className="h-4 w-4" />} title="Multi-Currency" />
          <FeatureCard icon={<Shield className="h-4 w-4" />} title="Secure Backups" />
          <FeatureCard icon={<Sparkles className="h-4 w-4" />} title="Clean UI Experience" />
        </div>
      </motion.section>

      {/* CREATOR */}

      {/* APP INFO */}
      <motion.section
        className="glass-card p-6 sm:p-8 rounded-2xl space-y-4
                   hover:shadow-lg transition-all duration-300"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Application Info
        </h3>

        <InfoRow icon={<Tag className="h-4 w-4" />} label="Version" value="1.0.0" />
        <InfoRow icon={<Code2 className="h-4 w-4" />} label="Built With" value="React, TypeScript & Tailwind CSS" />
        <InfoRow icon={<CalendarClock className="h-4 w-4" />} label="Last Updated" value="February 2026" />
      </motion.section>

      {/* FOOTER */}
      <motion.div
        className="text-center pt-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Badge
          variant="secondary"
          className="px-4 py-1 text-xs transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          © 2026 FinNova — Designed & Developed by Abdul Basit
        </Badge>
      </motion.div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function FeatureCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div
      className="group p-4 rounded-xl border bg-background/60 backdrop-blur
                 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40
                 transition-all duration-300 cursor-default"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg
                     bg-primary/10 text-primary transition-colors duration-300
                     group-hover:bg-primary group-hover:text-primary-foreground"
        >
          {icon}
        </span>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
    </div>
  );
}

function HoverButton({
  icon,
  label,
  onClick,
  hoverClass,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  hoverClass: string;
}) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      className={`gap-2 transition-all duration-300
                  hover:scale-105 hover:shadow-md
                  border-muted
                  ${hoverClass}`}
    >
      {icon}
      {label}
    </Button>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center border-b pb-2 last:border-none text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}