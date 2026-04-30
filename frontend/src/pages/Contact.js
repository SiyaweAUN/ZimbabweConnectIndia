// src/pages/Contact.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Mail, Phone, MapPin, Send, Loader2,
  MessageCircle, Clock, CheckCircle,
  Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const faqs = [
  { q: 'Is the application process free?', a: 'Yes, completely free. We never charge students for registering or applying through our platform.' },
  { q: 'How long does the process take?', a: 'From registration to receiving an offer letter typically takes 4–8 weeks, depending on the university and program.' },
  { q: 'Do I need IELTS or TOEFL?', a: 'Most partner universities accept Zimbabwean O/A Level English results. Some postgraduate programs may require IELTS/TOEFL.' },
  { q: 'Is the scholarship guaranteed?', a: 'Scholarships are merit-based. Our advisors help you build the strongest possible application to maximise your chances.' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/contact', data);
      setSubmitted(true);
      reset();
      toast.success('Message sent! We\'ll reply within 24 hours.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold mb-4 tracking-wider uppercase">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">We're Here to Help</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Have questions about studying in India or our scholarship programs? Our advisors are ready to guide you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Left: Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/263771234567?text=Hello%20ZimbabweConnectIndia%2C%20I%20need%20help%20with%20my%20application"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 transition-all hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <WhatsAppIcon />
                </div>
                <div>
                  <p className="font-semibold">Chat on WhatsApp</p>
                  <p className="text-green-100 text-sm">+263 77 123 4567 — usually replies within 1 hour</p>
                </div>
              </a>

              {/* Contact Cards */}
              <div className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Email Us</p>
                  <a href="mailto:info@zimbabweconnectindia.com" className="text-brand-600 dark:text-brand-400 text-sm hover:underline">
                    info@zimbabweconnectindia.com
                  </a>
                  <p className="text-xs text-gray-400 mt-0.5">Response within 24 hours</p>
                </div>
              </div>

              <div className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Call Us</p>
                  <a href="tel:+263771234567" className="text-accent-600 dark:text-accent-400 text-sm hover:underline">
                    +263 77 123 4567
                  </a>
                  <p className="text-xs text-gray-400 mt-0.5">Mon–Fri, 8 AM – 6 PM CAT</p>
                </div>
              </div>

              <div className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Offices</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    🇿🇼 Harare, Zimbabwe<br />
                    🇮🇳 New Delhi, India
                  </p>
                </div>
              </div>

              <div className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Office Hours</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monday – Friday: 8:00 AM – 6:00 PM</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Saturday: 9:00 AM – 1:00 PM</p>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { Icon: Facebook, href: '#', label: 'Facebook', color: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
                    { Icon: Twitter, href: '#', label: 'Twitter', color: 'text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20' },
                    { Icon: Instagram, href: '#', label: 'Instagram', color: 'text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20' },
                    { Icon: Linkedin, href: '#', label: 'LinkedIn', color: 'text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
                  ].map(({ Icon, href, label, color }) => (
                    <a key={label} href={href} aria-label={label}
                      className={`w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center ${color} transition-all`}>
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Thank you for reaching out. One of our advisors will contact you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="card p-8">
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Send a Message</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Fill in the form below and our team will get back to you promptly.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input
                          className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                          placeholder="Takudzwa Moyo"
                          {...register('name', { required: 'Name is required', maxLength: { value: 100, message: 'Too long' } })}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="label">Email Address *</label>
                        <input
                          type="email"
                          className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                          placeholder="you@example.com"
                          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Phone Number</label>
                        <input
                          className="input-field"
                          placeholder="+263 77 ..."
                          {...register('phone')}
                        />
                      </div>
                      <div>
                        <label className="label">Category</label>
                        <select className="input-field" {...register('category')}>
                          <option value="general">General Inquiry</option>
                          <option value="scholarship">Scholarship</option>
                          <option value="application">Application</option>
                          <option value="visa">Visa & Travel</option>
                          <option value="university">University Info</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="label">Subject *</label>
                      <input
                        className={`input-field ${errors.subject ? 'border-red-400' : ''}`}
                        placeholder="What's your question about?"
                        {...register('subject', { required: 'Subject is required', maxLength: { value: 200, message: 'Too long' } })}
                      />
                      {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label className="label">Message *</label>
                      <textarea
                        rows={5}
                        className={`input-field resize-none ${errors.message ? 'border-red-400' : ''}`}
                        placeholder="Tell us about your educational goals, current qualifications, or any questions you have..."
                        {...register('message', {
                          required: 'Message is required',
                          minLength: { value: 10, message: 'Message too short' },
                          maxLength: { value: 2000, message: 'Message too long (max 2000 chars)' },
                        })}
                      />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                      {loading
                        ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                        : <><Send className="w-4 h-4" /> Send Message</>
                      }
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle mx-auto text-center">Quick answers to common queries</p>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{q}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
