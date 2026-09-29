# Solar Calculator (Thor)

A modern, high-performance Australian Solar & Battery Calculator built with React, TypeScript, Tailwind CSS v4, and Zustand.

## Overview

The Solar Calculator is an end-to-end quotation, system sizing, and financial analysis tool designed for Australian solar & battery installers. It provides real-time pricing, multi-mode equipment configuration, government incentive deductions (STC & VIC Solar Victoria rebates/loans), and owner-restricted margin analytics.

---

## Key Features

### 1. Multi-Mode System Configuration
- **Panel + Inverter**: Modular panel count sizing with real-time kW calculation and multi-inverter support (String, Hybrid, Microinverters).
- **Panels + Battery Combo**: Ecosystem-driven dependent pairing (inverters and modular battery units filtered by brand/family compatibility).
- **Sigenergy**: SigStor energy controller, modular battery packs (5 kWh increments), and smart gateway integration.
- **Battery Only**: AC-coupled and DC-coupled retrofits, existing system retention without duplicate charging, and backup circuit configuration.

### 2. State & Grid Phase Support
- **VIC & NSW Jurisdiction Switcher**: Contextual rebates and interest-free loans for Victoria (Solar Victoria), STC calculation placeholders.
- **Single Phase vs. Three Phase**: Automatic inverter and equipment filtering based on grid supply.

### 3. Customer & Site Specifications
- Customer details, installation address, and postcode.
- Configurable Zone mappings (STC rating).
- Multi-storey, roof type (Tile, Colorbond, Klip-Lok, Terracotta, Flat), and battery location specifications.

### 4. Dynamic Extras & Add-ons Catalogue
- Categorized add-ons across Roof & Mounting, Battery & Backup, Electrical & Monitoring, and Removal & Specialist.
- Flexible pricing models: Fixed, Per Panel, Per Metre, Per Circuit, and Bundle with overage.
- "Price Pending" flagging for complex custom site work.

### 5. Financial Breakdown & Owner Margin Analysis
- **Sales View (Customer Price Summary)**:
  - System Subtotal & Extras Total
  - Contract Total (inc. GST)
  - Incentive Deductions (STCs, VIC Solar Rebates)
  - Amount After Incentives & Upfront Payable
  - Owner-approved discount display
- **Owner View (Role-Restricted)**:
  - True equipment costs, installation costs, and extra costs.
  - Ex-GST Revenue, company profit before discount.
  - Interactive discount simulation and minimum margin threshold (15%) guardrails.
  - "Company profit remaining after discount" and discount headroom calculations.

### 6. UI & Design System
- Polished dark theme with indigo/violet accents and clean contrast.
- Fully responsive two-column layout with sticky customer price summary.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Search**: [Fuse.js](https://www.fusejs.io/)

---

## Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm or pnpm

### Installation

```bash
# Clone repository
git clone git@github.com:sunnyyai1008/Thor-.git
cd Thor-

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```
