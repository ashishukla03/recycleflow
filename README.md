# RecycleFlow — Give Every Item a Better Next Life

An AI-assisted circular economy decision platform helping individuals and organizations find the optimal circular pathway for unwanted electronics, furniture, appliances, clothing, books, and household goods.

---

## Key Features

1. **Item Understanding & Classification**
   - Natural-language item input with auto-detection of categories, component materials, and failure modes.
   - Example prompt chips covering electronics, furniture, packing materials, appliances, and textiles.
   - Honest confidence scoring with transparent explanations of model certainty.

2. **6-Agent Circularity Intelligence Architecture**
   - **Item Understanding Agent**: Extracts material tags, nuances, and item specificity.
   - **Circularity Decision Agent**: Ranks options via the waste hierarchy (*Repair > Direct Reuse > Donation > Resale > Specialist Recycling*), weighting user priorities (free disposal, fastest option, donation first, etc.).
   - **Safety & Compliance Agent**: Deterministically verifies lithium-ion battery fire hazards, cryptographic storage sanitization (NIST 800-88), high-voltage capacitors, and CFC/refrigerant compliance.
   - **Local Discovery Agent**: Matches items against service providers based on accepted materials, proximity, and pickup requirements.
   - **Comparison Agent**: Compares and ranks service options by distance, pricing, and pickup convenience.
   - **Action Coordinator Agent**: Generates tailored pre-disposal preparation checklists and governs strict draft-to-scheduled state transitions.

3. **Deterministic Demo Mode & Gemini SDK Integration**
   - Fully operational out-of-the-box without requiring an API key.
   - Supports Google Gen AI SDK (`@google/genai`) when `GEMINI_API_KEY` is configured.
   - Reads model name dynamically from `GEMINI_MODEL` (e.g. `gemini-2.5-flash`).
   - Fictional testing providers explicitly tagged: **"Demo provider — not verified"**.

4. **Verifiable Environmental Impact Accounting**
   - Calculates greenhouse gas avoidance ($\text{kg CO}_2\text{e}$) and mass diverted ($\text{kg}$) citing peer-reviewed lifecycle baselines (EPA WARM v15 and WRAP).

5. **End-to-End Action Plan & Dashboard Tracking**
   - Draft creation vs. verified submission.
   - Status tracking across `draft`, `pending_review`, `scheduled`, `in_progress`, and `completed`.

---

## Quickstart

### Prerequisites
- Node.js 18+ (tested with Node.js v20.18 LTS)
- npm 10+

### Run Locally

```bash
# Navigate to project directory
cd "C:\Users\HP\.gemini\antigravity\scratch\recycleflow"

# Install dependencies (already installed)
npm install

# Run unit tests
npm test

# Run production build
npm run build

# Start the application server
npm run start
# Server listens at http://localhost:3000
```

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configurable variables:
- `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key. If omitted, the app smoothly operates in Deterministic Demo Mode.
- `GEMINI_MODEL`: *(Optional)* Defaults to `gemini-2.5-flash` (or `gemini-1.5-flash`).
- `NEXT_PUBLIC_APP_URL`: Base application URL (default: `http://localhost:3000`).

---

## Application Structure

```
recycleflow/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts      # Multi-agent analysis endpoint
│   │   │   ├── requests/route.ts     # Action plan & status transition endpoint
│   │   │   └── services/route.ts     # Provider discovery endpoint
│   │   ├── analyze/page.tsx          # Analysis Results & Decision page
│   │   ├── dashboard/page.tsx        # User Activity Dashboard & Request Tracker
│   │   ├── request/page.tsx          # Action Plan review & scheduling page
│   │   ├── services/page.tsx         # Circular Services Directory
│   │   ├── globals.css               # Warm off-white & forest green theme
│   │   ├── layout.tsx                # App shell, Navbar & Footer
│   │   └── page.tsx                  # Landing page & submission form
│   ├── components/
│   │   ├── ItemSubmissionForm.tsx    # Interactive form with prompt chips & loading steps
│   │   ├── Navbar.tsx                # Navigation header & active agent pill
│   │   └── Footer.tsx                # Attribution & circular standards
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── agents/
│   │   │   │   ├── action-coordinator.ts
│   │   │   │   ├── circularity-decision.ts
│   │   │   │   ├── comparison.ts
│   │   │   │   ├── item-understanding.ts
│   │   │   │   ├── local-discovery.ts
│   │   │   │   └── safety-compliance.ts
│   │   │   └── orchestrator.ts       # Central AI Orchestrator
│   │   ├── demo/
│   │   │   └── demo-data.ts          # Deterministic demo analyses & sample scenarios
│   │   ├── providers/
│   │   │   ├── demo-repository.ts    # Seeded provider directory
│   │   │   └── repository.ts         # IProviderRepository adapter interface
│   │   ├── storage/
│   │   │   └── request-store.ts      # In-memory store
│   │   └── validation/
│   │       └── schemas.ts            # Zod validation schemas
│   └── types/
│       └── index.ts                  # Shared TypeScript interfaces
├── tests/
│   └── recycleflow.test.ts           # Vitest unit test suite (13 tests)
├── package.json
└── tailwind.config.ts
```
