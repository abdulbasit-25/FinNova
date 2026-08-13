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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">

      {/* HERO */}
    <section className="relative text-center py-12 space-y-8">

  {/* Animated Badge */}
  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full 
                  bg-gradient-to-r from-primary/20 to-primary/10 
                  text-primary text-xs font-semibold tracking-wide
                  transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/40">
    <Sparkles className="h-5 w-5 animate-pulse text-primary" />
    Your Money, Your Power
  </div>

  {/* Hero Heading with gradient animation */}
  <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent 
                 bg-gradient-to-r from-primary via-foreground to-accent
                 bg-[length:200%_200%] animate-[gradient_8s_ease_infinite]">
    Meet <span className="text-accent">FinNova</span>
  </h1>

  {/* Description Card */}
  <div className="relative max-w-2xl mx-auto p-8 rounded-3xl 
                  bg-card/70 backdrop-blur-xl border border-border
                  transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20">

    {/* Lucide Icons for subtle decoration */}
    <Star className="absolute top-4 left-6 h-4 w-4 text-primary/50 animate-bounce" />
    <Activity className="absolute bottom-4 right-8 h-5 w-5 text-accent/50 animate-bounce" />

    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
      <span className="font-bold text-foreground">FinNova</span> = <span className="text-primary font-semibold">Finance</span> + <span className="text-primary font-semibold">Nova</span>.  
      A bright new star in personal finance — track your spending, visualize your money, and take full control with a clean, powerful dashboard.  
      <span className="text-accent font-semibold">Simple. Insightful. Smart.</span>
    </p>
  </div>

</section>

      {/* APP FEATURES */}
<section className="glass-card p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Built for Simplicity & Power
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            FinNova helps you track income, manage expenses, set budgets,
            and analyze spending patterns — all with a clean, intuitive interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FeatureCard icon={<Wallet className="h-4 w-4" />} title="Income & Expenses" />
          <FeatureCard icon={<BarChart3 className="h-4 w-4" />} title="Smart Analytics" />
          <FeatureCard icon={<Target className="h-4 w-4" />} title="Budget & Goals" />
          <FeatureCard icon={<Globe className="h-4 w-4" />} title="Multi-Currency" />
          <FeatureCard icon={<Shield className="h-4 w-4" />} title="Secure Backups" />
          <FeatureCard icon={<Sparkles className="h-4 w-4" />} title="Clean UI Experience" />
        </div>
      </section>

      {/* CREATOR */}
      <section className="glass-card p-8 rounded-2xl space-y-6 
                          relative overflow-hidden 
                          hover:shadow-2xl transition-all duration-300">

        <h2 className="text-xl font-semibold text-foreground">
          Meet the Creator
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">

          {/* Avatar */}
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br 
                          from-primary/40 to-primary/10 
                          flex items-center justify-center 
                          text-primary text-2xl font-bold
                          shadow-lg hover:scale-105 transition">
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
              I design and build intuitive digital experiences that simplify complex workflows.
              FinNova is crafted with performance, usability, and modern design principles.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">

              {/* Portfolio */}
              <HoverButton
                icon={<ExternalLink className="h-4 w-4" />}
                label="Portfolio"
                hoverClass="hover:bg-primary hover:text-primary-foreground"
                onClick={() =>
                  window.open('https://abdulbasit-archer.vercel.app/', '_blank')
                }
              />

              {/* GitHub */}
              <HoverButton
                icon={<Github className="h-4 w-4" />}
                label="GitHub"
                hoverClass="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                onClick={() =>
                  window.open('https://github.com/abdulbasit-25', '_blank')
                }
              />

              {/* LinkedIn */}
              <HoverButton
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
                hoverClass="hover:bg-[#0A66C2] hover:text-white"
                onClick={() =>
                  window.open(
                    'https://www.linkedin.com/in/abdul-basit-741977295/',
                    '_blank'
                  )
                }
              />

              {/* Email */}
              <HoverButton
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                hoverClass="hover:bg-red-500 hover:text-white"
                onClick={() =>
                  (window.location.href = 'mailto:abdulbasit.alpha25@gmail.com')
                }
              />

              {/* WhatsApp */}
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
      </section>

      {/* APP INFO */}
      <section className="glass-card p-8 rounded-2xl space-y-4 
                          hover:shadow-lg transition-all duration-300">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Application Info
        </h3>

        <InfoRow label="Version" value="1.0.0" />
        <InfoRow label="Built With" value="React, TypeScript & Tailwind CSS" />
        <InfoRow label="Last Updated" value="February 2026" />
      </section>

      {/* FOOTER */}
      <div className="text-center pt-6">
        <Badge variant="secondary" className="px-4 py-1 text-xs">
          © 2026 FinNova — Designed & Developed by Abdul Basit
        </Badge>
      </div>
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
    <div className="p-4 rounded-xl border bg-background/60 backdrop-blur
                    hover:shadow-lg hover:-translate-y-1 
                    transition-all duration-300 cursor-default">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h4 className="text-sm font-semibold text-foreground">
          {title}
        </h4>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b pb-2 last:border-none text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
