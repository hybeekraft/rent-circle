import Link from 'next/link'
import { Shield, Users, MapPin, Star, ArrowRight, CheckCircle2, Zap } from 'lucide-react'

const STATS = [
  { value: '12,000+', label: 'Active users' },
  { value: '3,400+', label: 'Verified listings' },
  { value: '8,200+', label: 'Matches made' },
  { value: '96%', label: 'Satisfaction rate' },
]

const FEATURES = [
  { icon: Users, title: 'Smart Roommate Matching', desc: 'AI-powered compatibility scoring based on lifestyle, budget, and personality', color: 'bg-purple-50 text-purple-600' },
  { icon: Shield, title: 'Verified Listings', desc: 'Every listing is checked. Every landlord screened. Zero fake listings guaranteed', color: 'bg-green-50 text-green-600' },
  { icon: MapPin, title: 'Nigerian Cities First', desc: 'Built for Lagos, Abuja, and Port Harcourt. Real areas, real landlords, real prices', color: 'bg-blue-50 text-blue-600' },
  { icon: Users, title: 'Group Renting', desc: 'Pool budgets with 2–6 people to afford a bigger, better apartment together', color: 'bg-amber-50 text-amber-600' },
]

const TESTIMONIALS = [
  { name: 'Adaeze N.', role: 'Software Engineer, Lagos', text: 'Found my Lekki roommate in 3 days. The compatibility score was so accurate — we\'re actually great together!', avatar: '🧑🏾‍💼', score: 94 },
  { name: 'Chukwuemeka O.', role: 'NYSC Member, Abuja', text: 'As a corper with limited budget, the group renting feature saved me. We got a 3-bedroom for what I budgeted alone.', avatar: '👨🏾‍🎓', score: 88 },
  { name: 'Fatimah A.', role: 'Remote Worker, Lagos', text: 'The verified badge gave me peace of mind. No scammers, no fake agents. Just real rooms.', avatar: '👩🏾‍💻', score: 91 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-50 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-ink-900 text-lg">RentCircle</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-ink-600 hidden sm:block">Sign in</Link>
            <Link href="/auth/register" className="bg-brand-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-600 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap size={12} /> Nigeria's #1 Roommate Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink-900 leading-tight mb-4">
          Find your perfect<br />
          <span className="gradient-text">roommate in Lagos</span>
        </h1>
        <p className="text-ink-500 text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto">
          Verified listings, smart compatibility matching, and group renting — built for young Nigerians.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-brand-500 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200">
            Find roommates <ArrowRight size={18} />
          </Link>
          <Link href="/listings" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-ink-200 text-ink-700 font-semibold px-6 py-3.5 rounded-2xl hover:bg-ink-50 transition-colors">
            Browse listings
          </Link>
        </div>
        <p className="text-xs text-ink-400 mt-4">Free to join · No credit card needed</p>
      </section>

      {/* Stats */}
      <section className="px-4 pb-12">
        <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center border border-ink-100 shadow-sm">
              <p className="text-2xl font-bold text-brand-600">{value}</p>
              <p className="text-xs text-ink-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-ink-900 text-center mb-2">Everything you need</h2>
          <p className="text-ink-500 text-center text-sm mb-8">Built from scratch for the Nigerian housing market</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-3xl p-5 border border-ink-100 shadow-sm">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-ink-900 mb-1.5">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-16 bg-white">
        <div className="max-w-2xl mx-auto pt-12">
          <h2 className="text-2xl font-bold text-ink-900 text-center mb-2">How RentCircle works</h2>
          <p className="text-ink-500 text-center text-sm mb-10">3 simple steps to your new home</p>
          <div className="flex flex-col gap-6">
            {[
              { step: '01', title: 'Create your profile', desc: 'Tell us about your lifestyle, budget, preferred areas, and habits. Takes 3 minutes.', color: 'bg-brand-500' },
              { step: '02', title: 'Discover & match', desc: 'Browse verified listings and get matched with compatible roommates based on your preferences.', color: 'bg-purple-500' },
              { step: '03', title: 'Chat & move in', desc: 'Message directly in-app, schedule viewings, and move into your perfect home safely.', color: 'bg-green-500' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className={`w-11 h-11 ${color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <span className="text-white font-bold text-sm">{step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">{title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-ink-900 text-center mb-2">Nigerians love RentCircle</h2>
          <p className="text-ink-500 text-center text-sm mb-8">Real stories from real people</p>
          <div className="flex flex-col gap-4">
            {TESTIMONIALS.map(({ name, role, text, avatar, score }) => (
              <div key={name} className="bg-white rounded-3xl p-5 border border-ink-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-ink-100 rounded-full flex items-center justify-center text-xl">{avatar}</div>
                    <div>
                      <p className="font-semibold text-ink-900 text-sm">{name}</p>
                      <p className="text-xs text-ink-500">{role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Star size={11} fill="currentColor" /> {score}% match
                  </div>
                </div>
                <p className="text-sm text-ink-600 leading-relaxed">"{text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto bg-brand-500 rounded-3xl p-8 text-center shadow-xl shadow-brand-200">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to find your people?</h2>
          <p className="text-brand-100 text-sm mb-6">Join 12,000+ Nigerians already using RentCircle</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-semibold px-6 py-3.5 rounded-2xl hover:bg-brand-50 transition-colors">
              Create free account <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4 mt-5">
            {['No fake listings', 'Free to join', 'Lagos & Abuja'].map(t => (
              <span key={t} className="flex items-center gap-1 text-brand-100 text-xs">
                <CheckCircle2 size={12} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200 px-4 py-8">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-ink-700">RentCircle</span>
          </div>
          <p className="text-xs text-ink-400">© 2024 RentCircle. Built for Nigeria 🇳🇬</p>
          <div className="flex gap-4">
            {['Terms', 'Privacy', 'Safety'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="text-xs text-ink-500 hover:text-ink-800">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
