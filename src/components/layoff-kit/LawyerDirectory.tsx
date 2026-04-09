
import { useState, useMemo } from "react";
import lawyerData from "../../data/lawyers.json";

interface Lawyer {
  name: string;
  firm: string;
  region: string;
  province: string;
  specialties: string[];
  website: string;
  phone: string;
  freeConsultation: boolean;
  notes: string;
}

const lawyers: Lawyer[] = lawyerData;

const PROVINCE_OPTIONS = [
  { value: "ALL", label: "All Provinces" },
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
];

const SPECIALTY_OPTIONS = [
  "wrongful dismissal",
  "severance negotiation",
  "constructive dismissal",
  "executive employment",
  "non-compete",
  "human rights",
  "workplace harassment",
];

export function LawyerDirectory() {
  const [provinceFilter, setProvinceFilter] = useState("ALL");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return lawyers.filter((l) => {
      if (
        provinceFilter !== "ALL" &&
        l.province !== provinceFilter &&
        l.province !== "ALL"
      )
        return false;
      if (
        specialtyFilter &&
        !l.specialties.includes(specialtyFilter)
      )
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          l.name.toLowerCase().includes(q) ||
          l.firm.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q) ||
          l.notes.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [provinceFilter, specialtyFilter, searchQuery]);

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0161EF] focus:ring-1 focus:ring-[#0161EF] outline-none"
        >
          {PROVINCE_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0161EF] focus:ring-1 focus:ring-[#0161EF] outline-none"
        >
          <option value="">All Specialties</option>
          {SPECIALTY_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name, firm, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0161EF] focus:ring-1 focus:ring-[#0161EF] outline-none"
        />
      </div>

      {/* Disclaimer — above the directory */}
      <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Disclaimer:</strong> This directory is for informational purposes only.
          ClearCareer has not independently verified the credentials, disciplinary history,
          or current licensing status of any lawyer listed. ClearCareer does not receive
          referral fees from any listed firm. Inclusion does not constitute an endorsement
          or recommendation. Free consultation availability was last checked April 2026.
          Verify licensing with your provincial law society and confirm consultation terms
          directly with each firm.
        </p>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Showing {filtered.length} of {lawyers.length} firms
      </p>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((l, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-5 hover:border-[#0161EF]/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{l.name}</h3>
                <p className="text-sm text-gray-600">{l.firm}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {l.freeConsultation && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    Free Consult
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {l.region}, {l.province}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {l.notes}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {l.specialties.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-blue-50 text-[#0161EF] px-2 py-0.5 rounded"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-sm">
              <a
                href={l.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0161EF] hover:text-[#0450c8] font-medium"
              >
                Website &rarr;
              </a>
              {l.phone && (
                <a
                  href={`tel:${l.phone}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {l.phone}
                </a>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No lawyers found matching your filters.</p>
            <button
              onClick={() => {
                setProvinceFilter("ALL");
                setSpecialtyFilter("");
                setSearchQuery("");
              }}
              className="text-[#0161EF] text-sm mt-2 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        Always verify a lawyer's licensing status with your provincial law society before retaining them.
      </p>
    </div>
  );
}
