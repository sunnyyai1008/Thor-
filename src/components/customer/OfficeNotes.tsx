import React from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';
import { Lock } from 'lucide-react';

export const OfficeNotes: React.FC = () => {
  const customerInfo = useCalculatorStore((s) => s.customerInfo);
  const updateCustomerInfo = useCalculatorStore((s) => s.updateCustomerInfo);
  const isOwner = usePricingStore((s) => s.isOwner);

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="officeNotes" className="text-sm font-medium text-white flex justify-between items-center">
          Notes for Office
        </label>
        <p className="text-xs text-surface-400 mb-1">
          These notes are internal only and will not appear on customer-facing documents
        </p>
        <textarea
          id="officeNotes"
          value={customerInfo?.officeNotes || ''}
          onChange={(e) => updateCustomerInfo({ officeNotes: e.target.value })}
          rows={4}
          className="w-full bg-surface-700 border border-surface-500 rounded-lg p-3 text-white focus:outline-none focus:border-primary-500 resize-y"
          placeholder="Enter operational or administrative notes here..."
        />
      </div>

      {isOwner && (
        <div className="flex flex-col gap-2">
          <label htmlFor="ownerNotes" className="text-sm font-medium text-white flex items-center gap-2">
            Owner Private Notes
            <Lock size={14} className="text-surface-400" />
          </label>
          <p className="text-xs text-error-400 mb-1">
            Only visible to owner accounts
          </p>
          <textarea
            id="ownerNotes"
            value={customerInfo?.ownerNotes || ''}
            onChange={(e) => updateCustomerInfo({ ownerNotes: e.target.value })}
            rows={4}
            className="w-full bg-surface-700 border border-error-900/50 rounded-lg p-3 text-white focus:outline-none focus:border-error-500 resize-y"
            placeholder="Enter private notes for owners here..."
          />
        </div>
      )}
    </div>
  );
};
