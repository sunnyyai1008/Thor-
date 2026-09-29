import { create } from 'zustand'
import type { Quote, QuoteStatus } from '../types/quote'

interface QuoteState {
  currentQuote: Quote | null
  quoteStatus: QuoteStatus
  discountRequest: { amount: number; reason: string } | null
  discountApproval: { amount: number; approvedBy: string; timestamp: string } | null
  hasConflict: boolean
  lastSavedVersion: number

  saveDraft: (quoteData: Partial<Quote>) => void
  requestDiscount: (amount: number, reason: string) => void
  approveDiscount: (amount: number, approvedBy: string) => void
  rejectDiscount: (reason: string) => void
  generateQuotePDF: () => void
  checkForConflicts: (serverVersion: number) => void
  reconcileConflict: (resolution: 'keep_mine' | 'accept_server') => void
  loadQuote: (quote: Quote) => void
  newQuote: () => void
}

export const useQuoteStore = create<QuoteState>((set) => ({
  currentQuote: null,
  quoteStatus: 'draft',
  discountRequest: null,
  discountApproval: null,
  hasConflict: false,
  lastSavedVersion: 0,

  saveDraft: (quoteData) => set((state) => ({
    currentQuote: { ...state.currentQuote, ...quoteData } as Quote,
    lastSavedVersion: state.lastSavedVersion + 1,
    quoteStatus: 'draft'
  })),
  
  requestDiscount: (amount, reason) => set({
    discountRequest: { amount, reason },
    quoteStatus: 'discount_requested'
  }),
  
  approveDiscount: (amount, approvedBy) => set({
    discountApproval: { amount, approvedBy, timestamp: new Date().toISOString() },
    quoteStatus: 'discount_approved',
    discountRequest: null
  }),
  
  rejectDiscount: (reason) => set({
    discountRequest: null,
    quoteStatus: 'draft'
  }),
  
  generateQuotePDF: () => {
    console.log('Generating PDF...')
  },
  
  checkForConflicts: (serverVersion) => set((state) => ({
    hasConflict: serverVersion > state.lastSavedVersion
  })),
  
  reconcileConflict: (resolution) => set((state) => ({
    hasConflict: false,
  })),
  
  loadQuote: (quote) => set({
    currentQuote: quote,
    quoteStatus: quote.status || 'draft',
    lastSavedVersion: quote.version || 0,
    hasConflict: false
  }),
  
  newQuote: () => set({
    currentQuote: null,
    quoteStatus: 'draft',
    discountRequest: null,
    discountApproval: null,
    hasConflict: false,
    lastSavedVersion: 0
  })
}))
