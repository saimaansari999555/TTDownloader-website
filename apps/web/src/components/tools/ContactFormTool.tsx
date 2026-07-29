'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContact } from '@/lib/api';

export default function ContactFormTool() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setError(null);
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl flex gap-4 items-start shadow-md">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-0.5">Email Support</p>
              <p className="text-white font-bold text-sm">support@site.com</p>
              <p className="text-text-secondary text-xs">Replies within 24 hours</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl shadow-md">
            <h4 className="text-white font-bold mb-3">Response SLA</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              We process support requests in a queue. DMCA and copyright notices are handled with high priority.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-12 rounded-2xl text-center h-full flex flex-col items-center justify-center shadow-lg">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-text-secondary mb-6 font-medium">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => setSuccess(false)} className="btn-primary rounded-xl px-6 py-3 font-bold shadow-md">Send Another Message</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Your Name *</label>
                  <input required name="name" value={form.name} onChange={handleChange} type="text" placeholder="John Doe" className="w-full glass-input rounded-xl py-3 px-4" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email Address *</label>
                  <input required name="email" value={form.email} onChange={handleChange} type="email" placeholder="john@example.com" className="w-full glass-input rounded-xl py-3 px-4" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Subject *</label>
                <select required name="subject" value={form.subject} onChange={handleChange} className="w-full glass-input rounded-xl py-3 px-4">
                  <option value="">Select a subject...</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Business Partnership">Business Partnership</option>
                  <option value="DMCA / Legal">DMCA / Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Message *</label>
                <textarea required name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Describe your inquiry in detail..." className="w-full glass-input rounded-xl py-3 px-4 resize-none" />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-accent-400 bg-accent-500/10 px-4 py-3 rounded-xl border border-accent-500/20 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full btn-primary rounded-xl py-4 flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-70 shadow-md">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-5 h-5" />Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
