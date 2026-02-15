import React, { useState, useEffect } from 'react';
import { Megaphone, HelpCircle, Video, Plus, Trash2, Send, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../context/ToastContext';
import { FAQ } from '../types';

interface Props {
  faqs: FAQ[];
  onUpdateFaqs: (faqs: FAQ[]) => void;
}

const MarketingCMS: React.FC<Props> = ({ faqs, onUpdateFaqs }) => {
  const { openConfirm } = useConfirm();
  const { addToast } = useToast();
  const [tickerLeft, setTickerLeft] = useState(['Today at Rabuste', 'New Colombia Drop', 'Workshop Sat 10AM']);
  const [tickerRight, setTickerRight] = useState(['Robusta Highlights', 'High Caffeine Yield', 'Art Reveal Friday']);
  const [heroVideo, setHeroVideo] = useState('https://onyx.com/assets/video/hero.mp4');

  // Email Broadcast States
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  const sendBroadcastEmail = async () => {
    console.log('📧 Send button clicked');
    console.log('Subject:', emailSubject);
    console.log('Content:', emailContent);

    if (!emailSubject || !emailContent) {
      console.log('❌ Validation failed: missing subject or content');
      setStatusMessage('Subject and content are required');
      setSendStatus('error');
      return;
    }

    const confirmSend = await openConfirm({
      title: 'Send Broadcast Email',
      message: `Send broadcast email to all users?\n\nSubject: ${emailSubject}`,
      confirmText: 'Send',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: async () => {},
      onCancel: () => {},
    });

    if (!confirmSend) {
      console.log('User cancelled broadcast');
      return;
    }

    setIsSending(true);
    setSendStatus('idle');

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      console.log('🔑 Token from storage:', token ? 'EXISTS' : 'NOT FOUND');
      console.log('📤 Sending request to:', `${API_BASE_URL}/marketing/broadcast`);

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.post(
        `${API_BASE_URL}/marketing/broadcast`,
        {
          subject: emailSubject,
          textContent: emailContent,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Response:', response.data);
      setStatusMessage(
        `✅ Broadcast sent successfully to ${response.data.recipientCount} users`
      );
      setSendStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setEmailSubject('');
        setEmailContent('');
        setSendStatus('idle');
      }, 2000);
    } catch (error: any) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
      setStatusMessage(error.response?.data?.message || error.message || 'Failed to send broadcast');
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const addFaq = () => {
    onUpdateFaqs([...faqs, { id: Math.random().toString(), question: 'New Question?', answer: 'New Answer.', category: 'General' }]);
  };

  const updateFaq = (id: string, field: keyof FAQ, value: string) => {
    onUpdateFaqs(faqs.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const deleteFaq = (id: string) => {
    onUpdateFaqs(faqs.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-4xl font-serif font-bold tracking-tight text-coffee-100">Marketing & Content</h2>
        <p className="text-coffee-500 mt-1">Dynamic site control for the Rabuste digital experience.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ticker Management */}
        <section className="bg-coffee-900 border border-coffee-800 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-coffee-800 pb-4">
            <Megaphone className="text-coffee-500" />
            <h3 className="text-lg font-serif font-bold text-coffee-100">Dynamic Ticker Lanes</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-2">Left Lane (Rabuste Today)</label>
              {tickerLeft.map((item, i) => (
                <input key={i} value={item} onChange={(e) => {
                  const copy = [...tickerLeft];
                  copy[i] = e.target.value;
                  setTickerLeft(copy);
                }} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm mb-2 text-coffee-100 focus:border-coffee-500 outline-none" />
              ))}
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-2">Right Lane (Highlights)</label>
              {tickerRight.map((item, i) => (
                <input key={i} value={item} onChange={(e) => {
                  const copy = [...tickerRight];
                  copy[i] = e.target.value;
                  setTickerRight(copy);
                }} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm mb-2 text-coffee-100 focus:border-coffee-500 outline-none" />
              ))}
            </div>
          </div>
        </section>

        {/* Hero Media */}
        <section className="bg-coffee-900 border border-coffee-800 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-coffee-800 pb-4">
            <Video className="text-coffee-500" />
            <h3 className="text-lg font-serif font-bold text-coffee-100">Hero Experience</h3>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-2">Main Hero Video URL</label>
            <input value={heroVideo} onChange={(e) => setHeroVideo(e.target.value)} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 outline-none" />
            <p className="text-[10px] text-coffee-600 mt-2 italic">Requires direct link to .mp4 or stream asset.</p>
          </div>
        </section>

        {/* FAQ Manager */}
        <section className="lg:col-span-2 bg-coffee-900 border border-coffee-800 p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-coffee-800 pb-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="text-coffee-500" />
              <h3 className="text-lg font-serif font-bold text-coffee-100">FAQ Intelligence</h3>
            </div>
            <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 bg-coffee-100 text-coffee-950 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors">
              <Plus size={14} /> Add FAQ
            </button>
          </div>
          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.id} className="grid grid-cols-12 gap-4 bg-coffee-950/40 p-4 rounded-2xl border border-coffee-800">
                <div className="col-span-5">
                   <input value={faq.question} onChange={(e) => updateFaq(faq.id, 'question', e.target.value)} className="w-full bg-transparent border-none text-sm font-bold text-coffee-100 outline-none placeholder:text-coffee-600" placeholder="Question" />
                </div>
                <div className="col-span-6">
                   <input value={faq.answer} onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)} className="w-full bg-transparent border-none text-sm text-coffee-600 outline-none placeholder:text-coffee-700" placeholder="Answer" />
                </div>
                <div className="col-span-1 flex justify-end">
                   <button onClick={() => deleteFaq(faq.id)} className="text-coffee-600 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Email Broadcast Section */}
        <section className="lg:col-span-2 bg-coffee-900 border border-coffee-800 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-coffee-800 pb-4">
            <Send className="text-coffee-500" />
            <h3 className="text-lg font-serif font-bold text-coffee-100">Email Broadcast to All Users</h3>
          </div>

          {/* Status Messages */}
          {sendStatus === 'success' && (
            <div className="flex items-center gap-3 bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
              <CheckCircle className="text-green-500" size={20} />
              <p className="text-green-400 text-sm">{statusMessage}</p>
            </div>
          )}

          {sendStatus === 'error' && (
            <div className="flex items-center gap-3 bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-400 text-sm">{statusMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Subject Line */}
            <div>
              <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-2">Email Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g., New Robusta Collection Available!"
                className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 outline-none"
              />
            </div>

            {/* Email Content */}
            <div>
              <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-2">Email Message</label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Enter your message here. Be clear and concise about the announcement regarding Robusta..."
                className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 outline-none h-32 resize-vertical"
              />
            </div>

            {/* Send Broadcast Button */}
            <button
              onClick={sendBroadcastEmail}
              disabled={isSending || !emailSubject || !emailContent}
              className="w-full px-6 py-3 bg-coffee-100 text-coffee-950 font-bold uppercase tracking-widest rounded-lg hover:bg-white disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {isSending ? 'Sending...' : 'Send to All Users'}
            </button>
          </div>

          <div className="bg-coffee-950/40 border border-coffee-800 p-4 rounded-xl text-[10px] text-coffee-600 space-y-2">
            <p>
              <strong>Note:</strong> Emails are sent from your admin account and appear with the admin's name and email address.
            </p>
            <p>
              <strong>Recipients:</strong> All registered users receive the broadcast. Test first to ensure your message is clear and correct.
            </p>
            <p>
              <strong>Best Practice:</strong> Keep messages concise, clear, and focused on important Robusta announcements or updates.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MarketingCMS;