import { create } from 'zustand'
import type { CustomerInfo, CalculatorMode } from '../types/quote'
import type { Product } from '../types/product'
import type { SelectedExtra } from '../types/extras'

interface SystemSelection {
  selectedPanels: { product: Product | null; quantity: number }
  selectedInverters: Array<{ product: Product | null; quantity: number }>
  selectedBatteries: Array<{ product: Product | null; quantity: number }>
  selectedControllers: Array<{ product: Product | null; quantity: number }>
  selectedGateways: Array<{ product: Product | null; quantity: number }>
  selectedAccessories: Array<{ product: Product | null; quantity: number }>
  comboFamily: string | null
  existingSystem: { brand: string; model: string; capacity: number; retainInverter: boolean; notes: string } | null
}

interface CalculatorState {
  state: 'VIC' | 'NSW'
  phase: 'single' | 'three'
  mode: CalculatorMode
  customerInfo: CustomerInfo
  systemSelection: SystemSelection
  selectedExtras: SelectedExtra[]
  isDirty: boolean

  setState: (state: 'VIC' | 'NSW') => void
  setPhase: (phase: 'single' | 'three') => void
  setMode: (mode: CalculatorMode) => void
  updateCustomerInfo: (partial: Partial<CustomerInfo>) => void
  
  setSelectedPanels: (product: Product | null, qty: number) => void
  addInverter: () => void
  removeInverter: (index: number) => void
  updateInverter: (index: number, product: Product | null, qty: number) => void
  
  addBattery: () => void
  removeBattery: (index: number) => void
  updateBattery: (index: number, product: Product | null, qty: number) => void
  
  addController: () => void
  removeController: (index: number) => void
  updateController: (index: number, product: Product | null, qty: number) => void
  
  addGateway: () => void
  removeGateway: (index: number) => void
  updateGateway: (index: number, product: Product | null, qty: number) => void
  
  addAccessory: () => void
  removeAccessory: (index: number) => void
  updateAccessory: (index: number, product: Product | null, qty: number) => void
  
  setComboFamily: (familyId: string | null) => void
  setExistingSystem: (data: SystemSelection['existingSystem']) => void
  
  addExtra: (extra: SelectedExtra) => void
  removeExtra: (id: string) => void
  updateExtraQuantity: (id: string, qty: number) => void
  
  clearIncompatibleSelections: () => void
  markDirty: () => void
  markClean: () => void
  resetCalculator: () => void

  getTotalSolarCapacity: () => number
  getTotalBatteryCapacity: () => number
}

const defaultSystemSelection: SystemSelection = {
  selectedPanels: { product: null, quantity: 0 },
  selectedInverters: [],
  selectedBatteries: [],
  selectedControllers: [],
  selectedGateways: [],
  selectedAccessories: [],
  comboFamily: null,
  existingSystem: null,
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  state: 'VIC',
  phase: 'single',
  mode: 'panel_inverter',
  customerInfo: {
    name: '',
    phone: '',
    email: '',
    installationAddress: '',
    postcode: '',
    zone: 1 as const,
    storeys: 1,
    roofType: '',
    batteryLocation: '',
    batteryCoupling: undefined,
    vicRebate: false,
    vicLoan: false,
    officeNotes: '',
    ownerNotes: '',
  } as CustomerInfo,
  systemSelection: defaultSystemSelection,
  selectedExtras: [],
  isDirty: false,

  setState: (state) => set((s) => ({ state, isDirty: true })),
  setPhase: (phase) => set({ phase, isDirty: true }),
  setMode: (mode) => set((state) => {
    const newSelection = { ...state.systemSelection }
    if (mode === 'battery_only') {
      newSelection.selectedPanels = { product: null, quantity: 0 }
      newSelection.comboFamily = null
    }
    return { mode, systemSelection: newSelection, isDirty: true }
  }),
  updateCustomerInfo: (partial) => set((state) => ({ 
    customerInfo: { ...state.customerInfo, ...partial },
    isDirty: true
  })),

  setSelectedPanels: (product, qty) => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedPanels: { product, quantity: qty } },
    isDirty: true
  })),
  
  addInverter: () => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedInverters: [...state.systemSelection.selectedInverters, { product: null, quantity: 1 }] },
    isDirty: true
  })),
  removeInverter: (index) => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedInverters: state.systemSelection.selectedInverters.filter((_, i) => i !== index) },
    isDirty: true
  })),
  updateInverter: (index, product, qty) => set((state) => {
    const newInverters = [...state.systemSelection.selectedInverters]
    while (newInverters.length <= index) newInverters.push({ product: null, quantity: 1 })
    newInverters[index] = { product, quantity: qty }
    return { systemSelection: { ...state.systemSelection, selectedInverters: newInverters }, isDirty: true }
  }),

  addBattery: () => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedBatteries: [...state.systemSelection.selectedBatteries, { product: null, quantity: 1 }] },
    isDirty: true
  })),
  removeBattery: (index) => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedBatteries: state.systemSelection.selectedBatteries.filter((_, i) => i !== index) },
    isDirty: true
  })),
  updateBattery: (index, product, qty) => set((state) => {
    const newBatteries = [...state.systemSelection.selectedBatteries]
    while (newBatteries.length <= index) newBatteries.push({ product: null, quantity: 1 })
    newBatteries[index] = { product, quantity: qty }
    return { systemSelection: { ...state.systemSelection, selectedBatteries: newBatteries }, isDirty: true }
  }),

  addController: () => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedControllers: [...state.systemSelection.selectedControllers, { product: null, quantity: 1 }] },
    isDirty: true
  })),
  removeController: (index) => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedControllers: state.systemSelection.selectedControllers.filter((_, i) => i !== index) },
    isDirty: true
  })),
  updateController: (index, product, qty) => set((state) => {
    const newControllers = [...state.systemSelection.selectedControllers]
    while (newControllers.length <= index) newControllers.push({ product: null, quantity: 1 })
    newControllers[index] = { product, quantity: qty }
    return { systemSelection: { ...state.systemSelection, selectedControllers: newControllers }, isDirty: true }
  }),

  addGateway: () => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedGateways: [...state.systemSelection.selectedGateways, { product: null, quantity: 1 }] },
    isDirty: true
  })),
  removeGateway: (index) => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedGateways: state.systemSelection.selectedGateways.filter((_, i) => i !== index) },
    isDirty: true
  })),
  updateGateway: (index, product, qty) => set((state) => {
    const newGateways = [...state.systemSelection.selectedGateways]
    while (newGateways.length <= index) newGateways.push({ product: null, quantity: 1 })
    newGateways[index] = { product, quantity: qty }
    return { systemSelection: { ...state.systemSelection, selectedGateways: newGateways }, isDirty: true }
  }),

  addAccessory: () => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedAccessories: [...state.systemSelection.selectedAccessories, { product: null, quantity: 1 }] },
    isDirty: true
  })),
  removeAccessory: (index) => set((state) => ({
    systemSelection: { ...state.systemSelection, selectedAccessories: state.systemSelection.selectedAccessories.filter((_, i) => i !== index) },
    isDirty: true
  })),
  updateAccessory: (index, product, qty) => set((state) => {
    const newAccessories = [...state.systemSelection.selectedAccessories]
    newAccessories[index] = { product, quantity: qty }
    return { systemSelection: { ...state.systemSelection, selectedAccessories: newAccessories }, isDirty: true }
  }),

  setComboFamily: (familyId) => set((state) => ({
    systemSelection: {
      ...state.systemSelection,
      comboFamily: familyId,
      selectedInverters: [],
      selectedBatteries: []
    },
    isDirty: true
  })),
  
  setExistingSystem: (data) => set((state) => ({
    systemSelection: { ...state.systemSelection, existingSystem: data },
    isDirty: true
  })),

  addExtra: (extra) => set((state) => ({
    selectedExtras: [...state.selectedExtras, extra],
    isDirty: true
  })),
  removeExtra: (id) => set((state) => ({
    selectedExtras: state.selectedExtras.filter((e) => e.id !== id),
    isDirty: true
  })),
  updateExtraQuantity: (id, qty) => set((state) => ({
    selectedExtras: state.selectedExtras.map((e) => e.id === id ? { ...e, quantity: qty } : e),
    isDirty: true
  })),

  clearIncompatibleSelections: () => set((state) => {
    return { isDirty: true }
  }),
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
  resetCalculator: () => set({
    state: 'VIC',
    phase: 'single',
    mode: 'panel_inverter',
    systemSelection: defaultSystemSelection,
    selectedExtras: [],
    isDirty: false
  }),

  getTotalSolarCapacity: () => {
    const { selectedPanels } = get().systemSelection
    if (!selectedPanels.product) return 0
    const wattage = selectedPanels.product.powerWatts || 0
    return (selectedPanels.quantity * wattage) / 1000
  },
  getTotalBatteryCapacity: () => {
    const { selectedBatteries } = get().systemSelection
    return selectedBatteries.reduce((total, b) => {
      if (!b.product) return total
      const capacity = b.product.capacityKwh || 0
      return total + (capacity * b.quantity)
    }, 0)
  }
}))
