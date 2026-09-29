import React from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { User, Phone, Mail, MapPin, Building, Home, Battery, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CustomerSiteForm: React.FC = () => {
  const customerInfo = useCalculatorStore((state) => state.customerInfo);
  const updateCustomerInfo = useCalculatorStore((state) => state.updateCustomerInfo);
  const appState = useCalculatorStore((state) => state.state);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      updateCustomerInfo({ [name]: checked });
    } else {
      updateCustomerInfo({ [name]: value });
    }
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCustomerInfo({ zone: parseInt(e.target.value, 10) });
  };

  const handleStoreysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCustomerInfo({ storeys: parseInt(e.target.value, 10) });
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] relative overflow-hidden">
      {/* Decorative gradient corner accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Customer & Site Specifications</h2>
            <p className="text-xs text-slate-400">Owner details, physical location, and roof attributes</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/[0.04] text-slate-300 border border-white/[0.08]">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          Region: <span className="text-white font-bold">{appState}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Customer Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Customer Name <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g. John Doe"
              value={customerInfo?.name || ''}
              onChange={handleChange}
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g. 0412 345 678"
              value={customerInfo?.phone || ''}
              onChange={handleChange}
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="customer@example.com"
              value={customerInfo?.email || ''}
              onChange={handleChange}
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Postcode */}
        <div>
          <label htmlFor="postcode" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Installation Postcode
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="postcode"
              name="postcode"
              maxLength={4}
              placeholder="e.g. 3000"
              value={customerInfo?.postcode || ''}
              onChange={handleChange}
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Full Address */}
        <div className="md:col-span-2">
          <label htmlFor="installationAddress" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Installation Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Building className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="installationAddress"
              name="installationAddress"
              placeholder="Street address, Suburb, State"
              value={customerInfo?.installationAddress || ''}
              onChange={handleChange}
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl pl-9 pr-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Zone */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="zone" className="text-xs font-semibold text-slate-300">
              STC Rating Zone
            </label>
            <span className="text-[10px] text-amber-400 font-medium">Configurable</span>
          </div>
          <select
            id="zone"
            name="zone"
            value={customerInfo?.zone || 1}
            onChange={handleZoneChange}
            className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value={1}>Zone 1 (Deemed 1.382)</option>
            <option value={2}>Zone 2 (Deemed 1.382)</option>
            <option value={3}>Zone 3 (Standard Metro - 1.185)</option>
            <option value={4}>Zone 4 (Remote / Low - 0.988)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">Zone assignment requires owner-approved mapping</p>
        </div>

        {/* Storeys */}
        <div>
          <label htmlFor="storeys" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Building Height
          </label>
          <select
            id="storeys"
            name="storeys"
            value={customerInfo?.storeys || 1}
            onChange={handleStoreysChange}
            className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value={1}>Single Storey (Standard Access)</option>
            <option value={2}>Double Storey (Site Fee Applicable)</option>
            <option value={3}>3+ Storeys (Specialist Access Required)</option>
          </select>
        </div>

        {/* Roof Type */}
        <div>
          <label htmlFor="roofType" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Roof Surface Material
          </label>
          <select
            id="roofType"
            name="roofType"
            value={customerInfo?.roofType || 'Tile'}
            onChange={handleChange}
            className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="Tile">Concrete Tile</option>
            <option value="Colorbond">Colorbond / Tin (Metal Sheet)</option>
            <option value="Klip-Lok">Klip-Lok (Non-Penetrative Clamps)</option>
            <option value="Terracotta">Terracotta Tile (Fragile)</option>
            <option value="Flat">Flat Roof (Tilt Frame Required)</option>
            <option value="Other">Custom / Slate / Other</option>
          </select>
        </div>

        {/* Battery Location */}
        <div>
          <label htmlFor="batteryLocation" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Proposed Battery Location
          </label>
          <select
            id="batteryLocation"
            name="batteryLocation"
            value={customerInfo?.batteryLocation || 'Garage'}
            onChange={handleChange}
            className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="Garage">Garage Interior (Standard)</option>
            <option value="External Wall">External Weather-Protected Wall</option>
            <option value="Indoor">Dedicated Indoor Utility Room</option>
            <option value="Other">External Ground Stand / Other</option>
          </select>
        </div>

        {/* Battery Coupling Segmented Toggle */}
        <div className="md:col-span-2 pt-1">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Battery Electrical Coupling
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#0d101d] p-1.5 rounded-xl border border-white/[0.08]">
            {[
              { id: 'ac', label: 'AC Coupled', sub: 'Add-on to any inverter' },
              { id: 'dc', label: 'DC Coupled', sub: 'Hybrid inverter shared' },
              { id: 'na', label: 'Not Applicable', sub: 'PV Solar Only' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateCustomerInfo({ batteryCoupling: opt.id as 'ac' | 'dc' | 'na' })}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                  customerInfo?.batteryCoupling === opt.id
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-600/40 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-xs">{opt.label}</span>
                <span className="text-[10px] opacity-70 hidden sm:inline">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* VIC Rebate & Loan Section */}
        {appState === 'VIC' && (
          <div className="md:col-span-2 mt-2 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#101926] to-emerald-900/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Solar Victoria State Government Incentives
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Qualifying Victorian homeowners are eligible for upfront rebates and interest-free loans.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2.5 cursor-pointer bg-[#0b0d17]/80 px-3 py-2 rounded-lg border border-emerald-500/30 hover:border-emerald-400 transition-all">
                <input
                  type="checkbox"
                  name="vicRebate"
                  checked={customerInfo?.vicRebate || false}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-[#0d101d] border-white/20"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">VIC Rebate</div>
                  <div className="text-[10px] text-emerald-400 font-mono">-$1,400 Deduction</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer bg-[#0b0d17]/80 px-3 py-2 rounded-lg border border-emerald-500/30 hover:border-emerald-400 transition-all">
                <input
                  type="checkbox"
                  name="vicLoan"
                  checked={customerInfo?.vicLoan || false}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-[#0d101d] border-white/20"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">VIC 0% Loan</div>
                  <div className="text-[10px] text-emerald-400 font-mono">-$1,400 Financed</div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
