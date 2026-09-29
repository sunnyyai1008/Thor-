import React from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';
import { Lock, FileText, ShieldAlert } from 'lucide-react';

export const OfficeNotes: React.FC = () => {
  const customerInfo = useCalculatorStore((s) => s.customerInfo);
  const updateCustomerInfo = useCalculatorStore((s) => s.updateCustomerInfo);
  const isOwner = usePricingStore((s) => s.isOwner);

  return (
    <div className="space-y-4">
      {/* Office & Operational Notes */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Internal Office & Installation Notes</h3>
            <p className="text-[11px] text-slate-400">
              Internal only. Strictly excluded from customer-facing quotation PDFs.
            </p>
          </div>
        </div>

        <textarea
          id="officeNotes"
          rows={3}
          value={customerInfo?.officeNotes || ''}
          onChange={(e) => updateCustomerInfo({ officeNotes: e.target.value })}
          placeholder="Enter special site access instructions, switchboard photo notes, or installer directions..."
          className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-y"
        />
      </div>

      {/* Owner Private Financial Notes (Only visible if isOwner is true) */}
      {isOwner && (
        <div className="glass-card rounded-2xl p-5 sm:p-6 border-2 border-rose-900/40 bg-gradient-to-r from-rose-950/20 via-[#141829] to-transparent">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-rose-900/30">
            <div className="flex items-center gap-2.5 text-rose-300">
              <Lock className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold tracking-tight">Owner Private Financial Notes</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
              Owner Eyes Only
            </span>
          </div>

          <textarea
            id="ownerNotes"
            rows={3}
            value={customerInfo?.ownerNotes || ''}
            onChange={(e) => updateCustomerInfo({ ownerNotes: e.target.value })}
            placeholder="Record private margin considerations, supplier rebate promises, or non-disclosed discount conditions..."
            className="w-full bg-[#0d101d] border border-rose-900/40 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-rose-500 transition-all placeholder:text-slate-600 resize-y"
          />
        </div>
      )}
    </div>
  );
};
