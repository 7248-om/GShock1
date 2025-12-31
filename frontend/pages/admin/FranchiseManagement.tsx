import React from 'react';
import { FranchiseLead, LeadStatus } from '../types';
import { Mail, Phone, MapPin, DollarSign, MessageSquare } from 'lucide-react';

interface Props {
  leads: FranchiseLead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const FranchiseManagement: React.FC<Props> = ({ leads, onUpdateStatus }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h2 className="text-4xl font-serif font-bold tracking-tight text-coffee-100">Franchise & Partnerships</h2>
        <p className="text-coffee-500 mt-1">Nurturing global growth and high-ticket leads. {leads.length} total inquiries.</p>
      </header>

      <div className="bg-coffee-900 border border-coffee-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-coffee-800 bg-coffee-950/40">
            <tr>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Applicant</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Contact</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Location & Budget</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-800">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-coffee-600 text-sm">No franchise inquiries yet</p>
                </td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr key={lead._id || lead.id} className="hover:bg-coffee-800/30 transition-colors">
                  <td className="px-6 py-6">
                    <div>
                      <p className="font-bold text-coffee-100">{lead.name}</p>
                      {lead.userName && <p className="text-xs text-coffee-600 mt-1">User: {lead.userName}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <a href={`mailto:${lead.email}`} className="text-xs text-coffee-500 hover:text-coffee-100 flex items-center gap-2 transition">
                        <Mail size={12} /> {lead.email}
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="text-xs text-coffee-600 hover:text-coffee-100 flex items-center gap-2 transition">
                          <Phone size={12} /> {lead.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      {lead.city && (
                        <p className="text-sm flex items-center gap-2 text-coffee-200">
                          <MapPin size={12} /> {lead.city}
                        </p>
                      )}
                      {lead.budgetRange && (
                        <p className="text-xs text-coffee-500 flex items-center gap-2">
                          <DollarSign size={12} /> {lead.budgetRange}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <select 
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead._id || lead.id || '', e.target.value as LeadStatus)}
                      className="bg-coffee-950 border border-coffee-800 text-coffee-100 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-coffee-500 transition-colors cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Negotiation">In Negotiation</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-6">
                    <div className="group relative">
                      <MessageSquare className="text-coffee-600 hover:text-coffee-100 cursor-help transition" size={18} />
                      {lead.message && (
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-72 p-4 bg-coffee-950 border border-coffee-800 rounded-xl hidden group-hover:block z-20 shadow-2xl">
                          <p className="text-[10px] uppercase font-bold text-coffee-500 mb-2">Application Message</p>
                          <p className="text-xs leading-relaxed text-coffee-200 italic">"{lead.message}"</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {leads.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className="bg-coffee-900 border border-coffee-800 rounded-xl p-4">
            <p className="text-[10px] uppercase text-coffee-500 font-bold mb-2">Total Inquiries</p>
            <p className="text-2xl font-bold text-coffee-100">{leads.length}</p>
          </div>
          <div className="bg-coffee-900 border border-coffee-800 rounded-xl p-4">
            <p className="text-[10px] uppercase text-coffee-500 font-bold mb-2">New</p>
            <p className="text-2xl font-bold text-coffee-100">{leads.filter(l => l.status === 'New').length}</p>
          </div>
          <div className="bg-coffee-900 border border-coffee-800 rounded-xl p-4">
            <p className="text-[10px] uppercase text-coffee-500 font-bold mb-2">In Negotiation</p>
            <p className="text-2xl font-bold text-coffee-100">{leads.filter(l => l.status === 'In Negotiation').length}</p>
          </div>
          <div className="bg-coffee-900 border border-coffee-800 rounded-xl p-4">
            <p className="text-[10px] uppercase text-coffee-500 font-bold mb-2">Contacted</p>
            <p className="text-2xl font-bold text-coffee-100">{leads.filter(l => l.status === 'Contacted').length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseManagement;