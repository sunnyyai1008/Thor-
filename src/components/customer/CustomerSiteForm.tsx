import React from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';

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
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-6">
      <h2 className="text-white text-base font-semibold mb-6">Customer & Site Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-400 text-[13px] mb-1">Customer Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={customerInfo?.name || ''}
            onChange={handleChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-gray-400 text-[13px] mb-1">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customerInfo?.phone || ''}
            onChange={handleChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-gray-400 text-[13px] mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerInfo?.email || ''}
            onChange={handleChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>

        {/* Postcode */}
        <div className="flex flex-col">
          <label htmlFor="postcode" className="text-gray-400 text-[13px] mb-1">Postcode</label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            maxLength={4}
            value={customerInfo?.postcode || ''}
            onChange={handleChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>

        {/* Installation Address */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="installationAddress" className="text-gray-400 text-[13px] mb-1">Installation Address</label>
          <input
            type="text"
            id="installationAddress"
            name="installationAddress"
            value={customerInfo?.installationAddress || ''}
            onChange={handleChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm w-full"
          />
        </div>

        {/* Zone */}
        <div className="flex flex-col">
          <label htmlFor="zone" className="text-gray-400 text-[13px] mb-1">Zone</label>
          <select
            id="zone"
            name="zone"
            value={customerInfo?.zone || 1}
            onChange={handleZoneChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm appearance-none"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
          <p className="text-gray-500 text-xs mt-1">Zone assignment requires owner-approved mapping</p>
        </div>

        {/* Number of Storeys */}
        <div className="flex flex-col">
          <label htmlFor="storeys" className="text-gray-400 text-[13px] mb-1">Number of Storeys</label>
          <select
            id="storeys"
            name="storeys"
            value={customerInfo?.storeys || 1}
            onChange={handleStoreysChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm appearance-none"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3+</option>
          </select>
        </div>

        {/* Roof Type */}
        <div className="flex flex-col">
          <label htmlFor="roofType" className="text-gray-400 text-[13px] mb-1">Roof Type</label>
          <select
            id="roofType"
            name="roofType"
            value={customerInfo?.roofType || 'Tile'}
            onChange={handleChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm appearance-none"
          >
            <option value="Tile">Tile</option>
            <option value="Colorbond">Colorbond</option>
            <option value="Klip-Lok">Klip-Lok</option>
            <option value="Flat">Flat</option>
            <option value="Terracotta">Terracotta</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Battery Location */}
        <div className="flex flex-col">
          <label htmlFor="batteryLocation" className="text-gray-400 text-[13px] mb-1">Battery Location</label>
          <select
            id="batteryLocation"
            name="batteryLocation"
            value={customerInfo?.batteryLocation || 'Garage'}
            onChange={handleChange}
            className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm appearance-none"
          >
            <option value="Garage">Garage</option>
            <option value="External Wall">External Wall</option>
            <option value="Indoor">Indoor</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Battery Connection */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-gray-400 text-[13px] mb-2">Battery Connection</label>
          <div className="flex p-1 bg-surface-700 rounded-lg border border-surface-600">
            {['ac', 'dc', 'na'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateCustomerInfo({ batteryCoupling: type as 'ac' | 'dc' | 'na' })}
                className={`flex-1 text-sm py-1.5 px-3 rounded-md transition-colors ${
                  customerInfo?.batteryCoupling === type
                    ? 'bg-surface-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {type === 'ac' ? 'AC Coupled' : type === 'dc' ? 'DC Coupled' : 'Not Applicable'}
              </button>
            ))}
          </div>
        </div>

        {/* VIC Only Section */}
        {appState === 'VIC' && (
          <div className="flex flex-col md:col-span-2 gap-3 mt-2 border-t border-surface-600 pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="vicRebate"
                checked={customerInfo?.vicRebate || false}
                onChange={handleChange}
                className="w-4 h-4 rounded border-surface-500 text-primary-500 focus:ring-primary-500 focus:ring-offset-surface-800 bg-surface-700"
              />
              <span className="text-gray-300 text-sm">Apply VIC Solar Rebate</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="vicLoan"
                checked={customerInfo?.vicLoan || false}
                onChange={handleChange}
                className="w-4 h-4 rounded border-surface-500 text-primary-500 focus:ring-primary-500 focus:ring-offset-surface-800 bg-surface-700"
              />
              <span className="text-gray-300 text-sm">Apply VIC Interest-Free Loan</span>
            </label>
          </div>
        )}

      </div>
    </div>
  );
};
