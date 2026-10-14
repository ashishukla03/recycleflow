"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  DollarSign,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText,
  RotateCcw,
  Building2,
} from "lucide-react";
import { ItemAnalysisResult, CircularityOption, ServiceProvider } from "@/types";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [analysis, setAnalysis] = useState<ItemAnalysisResult | null>(null);
  const [selectedAction, setSelectedAction] = useState<CircularityOption | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load from session storage first
    const cached = sessionStorage.getItem("last_analysis");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (!id || parsed.id === id) {
          setAnalysis(parsed);
          setSelectedAction(parsed.recommendedAction);
          if (parsed.matchedProviders && parsed.matchedProviders.length > 0) {
            setSelectedProvider(parsed.matchedProviders[0]);
          }
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Failed to parse cached analysis", e);
      }
    }

    // Fallback: If id provided or no cache, redirect to home if empty
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-charcoal-600">Loading analysis results...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-sage-100 text-forest-800 flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-charcoal-900">No Analysis Found</h2>
        <p className="text-sm text-charcoal-600">
          Please describe an item to run a fresh circularity analysis.
        </p>
        <Link
          href="/#submit-form"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-white text-sm font-medium hover:bg-forest-700 transition"
        >
          <span>Analyze an Item</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const currentAction = selectedAction || analysis.recommendedAction;

  const handleProceedToPlan = () => {
    // Save draft parameters
    const draftPayload = {
      analysis,
      selectedAction: currentAction.type,
      selectedProvider: selectedProvider || undefined,
    };
    sessionStorage.setItem("current_plan_draft", JSON.stringify(draftPayload));
    router.push(`/request?analysisId=${analysis.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner: Detected Item Overview */}
      <div className="bg-white rounded-2xl border border-sage-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-sage-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-forest-100 text-forest-900 border border-forest-200 uppercase tracking-wider">
                {analysis.detectedItem.category}
              </span>
              {analysis.isDemoMode && (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  Demo Evaluation Mode
                </span>
              )}
              <span className="text-xs text-charcoal-500 font-mono">
                Engine: {analysis.aiEngineUsed}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {analysis.detectedItem.name}
            </h1>
            <p className="text-sm text-charcoal-600 mt-1">
              Declared condition:{" "}
              <strong className="text-charcoal-800 font-medium">
                {analysis.detectedItem.conditionSummary}
              </strong>
            </p>
          </div>

          {/* Honest Confidence Gauge */}
          <div className="bg-sage-50 rounded-xl p-4 border border-sage-200/80 max-w-sm">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-xs font-semibold text-charcoal-800">
                Confidence Level
              </span>
              <span className="text-sm font-bold text-forest-800 font-mono">
                {Math.round(analysis.detectedItem.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-forest-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round(analysis.detectedItem.confidence * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-charcoal-500 leading-tight">
              {analysis.detectedItem.confidenceExplanation}
            </p>
          </div>
        </div>

        {/* Circularity Decision Hierarchy Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-forest-700 uppercase tracking-wider block">
                Circularity Hierarchy
              </span>
              <h2 className="text-lg font-bold text-charcoal-900">
                Recommended &amp; Alternative Pathways
              </h2>
            </div>
            <span className="text-xs text-charcoal-500">
              Select any pathway below to customize your action plan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Recommended Card */}
            <div
              onClick={() => setSelectedAction(analysis.recommendedAction)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                currentAction.title === analysis.recommendedAction.title
                  ? "border-forest-700 bg-forest-50/60 shadow-sm"
                  : "border-forest-200 bg-white hover:border-forest-400"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-forest-700 text-white px-2 py-0.5 rounded">
                    ★ Best Circular Pathway
                  </span>
                  <span className="text-xs font-mono font-bold text-forest-800 bg-forest-100 px-2 py-0.5 rounded">
                    Score {analysis.recommendedAction.environmentalScore}/10
                  </span>
                </div>
                <h3 className="text-base font-bold text-charcoal-900 mt-2">
                  {analysis.recommendedAction.title}
                </h3>
                <p className="text-xs text-charcoal-600 mt-1.5 leading-relaxed">
                  {analysis.recommendedAction.description}
                </p>

                <div className="mt-3 pt-3 border-t border-forest-200/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-charcoal-700">
                    <span className="text-charcoal-500">Effort:</span>
                    <span className="font-semibold capitalize">{analysis.recommendedAction.effortLevel}</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-700">
                    <span className="text-charcoal-500">Economics:</span>
                    <span className="font-semibold">{analysis.recommendedAction.costOrRecovery}</span>
                  </div>
                </div>

                {/* Pros */}
                <div className="mt-3 space-y-1">
                  {analysis.recommendedAction.pros.map((pro, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-forest-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-forest-200/80 text-xs font-semibold text-forest-800 flex items-center justify-between">
                <span>{currentAction.title === analysis.recommendedAction.title ? "Selected" : "Select this path"}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Alternative Action Cards */}
            {analysis.alternativeActions.map((alt, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedAction(alt)}
                className={`p-5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  currentAction.title === alt.title
                    ? "border-forest-700 bg-forest-50/60 shadow-sm"
                    : "border-sage-200 bg-white hover:border-sage-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-500 bg-sage-100 px-2 py-0.5 rounded">
                      Alternative: {alt.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-charcoal-700 bg-sage-100 px-2 py-0.5 rounded">
                      Score {alt.environmentalScore}/10
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-charcoal-900 mt-2">
                    {alt.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 mt-1.5 leading-relaxed">
                    {alt.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-sage-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-charcoal-700">
                      <span className="text-charcoal-500">Effort:</span>
                      <span className="font-semibold capitalize">{alt.effortLevel}</span>
                    </div>
                    <div className="flex items-center justify-between text-charcoal-700">
                      <span className="text-charcoal-500">Economics:</span>
                      <span className="font-semibold">{alt.costOrRecovery}</span>
                    </div>
                  </div>

                  {/* Cons or Trade-offs */}
                  <div className="mt-3 space-y-1">
                    {alt.cons.map((con, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5 text-[11px] text-charcoal-600">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sage-200 text-xs font-semibold text-charcoal-700 flex items-center justify-between">
                  <span>{currentAction.title === alt.title ? "Selected" : "Select this path"}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* AI Reasoning Text */}
          <div className="mt-5 p-4 rounded-xl bg-sage-50/60 border border-sage-200 text-xs text-charcoal-700 leading-relaxed">
            <span className="font-semibold text-charcoal-900 block mb-0.5">
              Circularity Rationale:
            </span>
            {analysis.reasoning}
          </div>
        </div>
      </div>

      {/* Safety & Compliance Card (Mandatory Transparency) */}
      <div className="bg-white rounded-2xl border border-red-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 text-red-700 font-bold text-lg mb-2">
          <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
          <h2>Safety, Hazard &amp; Data-Privacy Assessment</h2>
        </div>
        <p className="text-xs text-charcoal-600 max-w-2xl mb-6">
          Deterministic compliance rules protect against thermal runaway battery hazards, toxic
          refrigerant release, and private identity theft.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Battery Hazard */}
          <div
            className={`p-4 rounded-xl border ${
              analysis.safety.batteryHazard
                ? "bg-amber-50/60 border-amber-300 text-amber-950"
                : "bg-sage-50/40 border-sage-200 text-charcoal-700"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm mb-1">
              <AlertTriangle className={`w-4 h-4 ${analysis.safety.batteryHazard ? "text-amber-600" : "text-sage-500"}`} />
              <span>Battery Hazard Status</span>
            </div>
            <p className="text-xs leading-relaxed">
              {analysis.safety.batteryHazard
                ? analysis.safety.batteryDetails || "Lithium-ion cells detected. Do not crush or puncture. Keep terminals insulated."
                : "No hazardous battery cells detected for this item."}
            </p>
          </div>

          {/* Data Privacy Hazard */}
          <div
            className={`p-4 rounded-xl border ${
              analysis.safety.dataPrivacyRisk
                ? "bg-rose-50/60 border-rose-300 text-rose-950"
                : "bg-sage-50/40 border-sage-200 text-charcoal-700"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm mb-1">
              <ShieldAlert className={`w-4 h-4 ${analysis.safety.dataPrivacyRisk ? "text-rose-600" : "text-sage-500"}`} />
              <span>Data Privacy &amp; Storage Security</span>
            </div>
            <p className="text-xs leading-relaxed">
              {analysis.safety.dataPrivacyRisk
                ? analysis.safety.dataPrivacyAdvice || "Item contains persistent storage. Cryptographic wipe or physical drive removal required."
                : "No persistent personal data storage risks associated with this item."}
            </p>
          </div>
        </div>

        {/* General Precautions List */}
        {analysis.safety.generalPrecautions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-sage-200">
            <h4 className="text-xs font-semibold text-charcoal-800 uppercase tracking-wider mb-2">
              Mandatory Handling Precautions:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-700">
              {analysis.safety.generalPrecautions.map((p, i) => (
                <li key={i} className="flex items-start gap-2 bg-sage-50/60 p-2.5 rounded-lg border border-sage-200/60">
                  <span className="text-forest-700 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Environmental Impact Calculation Card */}
      <div className="bg-white rounded-2xl border border-sage-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-forest-800 font-bold text-lg">
            <Leaf className="w-5 h-5 text-forest-600" />
            <h2>Transparent Environmental Impact</h2>
          </div>
          <span className="text-[11px] font-mono text-charcoal-500 bg-sage-100 px-2.5 py-1 rounded-md">
            LCA Verified Model
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-forest-50 p-4 rounded-xl border border-forest-200">
            <span className="text-xs text-forest-800 font-medium block">
              Estimated Greenhouse Gas Avoidance
            </span>
            <p className="text-3xl font-extrabold text-forest-900 mt-1 font-mono">
              ~{analysis.environmentalImpact.co2eAvoidedKg ?? 0} <span className="text-base font-normal">kg CO₂e</span>
            </p>
            <p className="text-[11px] text-forest-700 mt-1">
              Equivalent to avoiding ~{Math.round((analysis.environmentalImpact.co2eAvoidedKg ?? 0) * 2.4)} passenger vehicle miles.
            </p>
          </div>

          <div className="bg-sage-50 p-4 rounded-xl border border-sage-200">
            <span className="text-xs text-charcoal-700 font-medium block">
              Physical Waste Diverted From Landfill
            </span>
            <p className="text-3xl font-extrabold text-charcoal-900 mt-1 font-mono">
              {analysis.environmentalImpact.wasteDivertedKg ?? 0} <span className="text-base font-normal">kg</span>
            </p>
            <p className="text-[11px] text-charcoal-600 mt-1">
              {analysis.environmentalImpact.resourceConservationNote}
            </p>
          </div>
        </div>

        {/* Transparent Methodology Disclaimer */}
        <div className="p-3.5 bg-sage-50/50 rounded-xl border border-sage-200/80 text-xs text-charcoal-600">
          <span className="font-semibold text-charcoal-800">Calculation Basis: </span>
          {analysis.environmentalImpact.calculationMethodology}
        </div>
      </div>

      {/* Matched Nearby Services Directory */}
      <div className="bg-white rounded-2xl border border-sage-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-forest-800 font-bold text-lg">
              <Building2 className="w-5 h-5 text-forest-600" />
              <h2>Matched Local Services</h2>
            </div>
            <p className="text-xs text-charcoal-600 mt-0.5">
              Service facilities equipped for {analysis.detectedItem.category} intake. Select a facility to proceed with your plan.
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs font-semibold text-forest-700 hover:text-forest-900 underline underline-offset-4"
          >
            View full directory &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.matchedProviders.map((prov) => {
            const isSelected = selectedProvider?.id === prov.id;
            return (
              <div
                key={prov.id}
                onClick={() => setSelectedProvider(prov)}
                className={`p-5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? "border-forest-700 bg-forest-50/50 shadow-sm"
                    : "border-sage-200 bg-white hover:border-sage-400"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-charcoal-900 text-sm">{prov.name}</h3>
                      <p className="text-xs text-charcoal-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-forest-600" />
                        <span>{prov.address}, {prov.city}</span>
                        {prov.distanceMiles && <span>({prov.distanceMiles} mi)</span>}
                      </p>
                    </div>

                    {/* Demo Warning Pill */}
                    {prov.isDemo && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                        Demo provider — not verified
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="text-[11px] bg-sage-100 px-2 py-0.5 rounded text-charcoal-700 capitalize">
                      {prov.serviceType}
                    </span>
                    <span className="text-[11px] bg-sage-100 px-2 py-0.5 rounded text-charcoal-700 capitalize">
                      Pricing: {prov.pricing}
                    </span>
                    <span className="text-[11px] bg-sage-100 px-2 py-0.5 rounded text-charcoal-700">
                      {prov.pickupAvailable ? "✓ Pickup Available" : "Drop-off Only"}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-600 mt-2.5">
                    {prov.operatingNotes}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-sage-200/80 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSelected ? "text-forest-800" : "text-charcoal-600"}`}>
                    {isSelected ? "Selected Provider" : "Click to select"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-forest-700" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Call-to-Action Bar */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-forest-300 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-forest-700 font-semibold block uppercase tracking-wider">
            Ready to Take Action?
          </span>
          <p className="text-sm font-bold text-charcoal-900">
            Selected Pathway: <span className="text-forest-800">{currentAction.title}</span>
            {selectedProvider && <span> via {selectedProvider.name}</span>}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/#submit-form"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl border border-sage-300 text-charcoal-700 text-sm font-medium hover:bg-sage-100 transition"
          >
            Start Over
          </Link>
          <button
            onClick={handleProceedToPlan}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-forest-800 hover:bg-forest-700 transition shadow-sm text-sm"
          >
            <span>Create Action Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-charcoal-600">Loading analysis results...</p>
        </div>
      }
    >
      <AnalysisContent />
    </Suspense>
  );
}
