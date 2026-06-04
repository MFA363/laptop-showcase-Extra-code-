import { Link } from "react-router";
import { X, Check, Minus, GitCompare, ArrowRight } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import { LAPTOPS } from "../data/laptops";
import { LaptopCard } from "../components/LaptopCard";

// Fields shown in the comparison table
const compareFields: { label: string; key: (l: (typeof LAPTOPS)[0]) => string | number | boolean }[] = [
  { label: "Price", key: (l) => `$${l.price.toLocaleString()}` },
  { label: "Rating", key: (l) => `${l.rating}/5 (${l.reviewCount.toLocaleString()} reviews)` },
  { label: "Category", key: (l) => l.category },
  { label: "Processor", key: (l) => l.specs.processor },
  { label: "Processor Brand", key: (l) => l.specs.processorBrand },
  { label: "RAM", key: (l) => `${l.specs.ram}GB` },
  { label: "Storage", key: (l) => `${l.specs.storage}GB ${l.specs.storageType}` },
  { label: "GPU", key: (l) => l.specs.gpu },
  { label: "Display Size", key: (l) => `${l.specs.displaySize}"` },
  { label: "Resolution", key: (l) => l.specs.resolution },
  { label: "Refresh Rate", key: (l) => `${l.specs.refreshRate}Hz` },
  { label: "Battery Life", key: (l) => `Up to ${l.specs.batteryLife}h` },
  { label: "Weight", key: (l) => `${l.specs.weight} lbs` },
  { label: "Operating System", key: (l) => l.specs.os },
  { label: "Wireless", key: (l) => l.specs.wireless },
  { label: "Webcam", key: (l) => l.specs.webcam },
  { label: "Touchscreen", key: (l) => l.specs.touchscreen },
  { label: "Best For", key: (l) => l.bestFor.join(", ") },
];

// Rows where we try to highlight the "best" value
const numericFields: Record<string, "higher" | "lower"> = {
  RAM: "higher",
  Storage: "higher",
  "Refresh Rate": "higher",
  "Battery Life": "higher",
  Weight: "lower",
  Price: "lower",
  Rating: "higher",
};

function getBestIndex(
  laptops: (typeof LAPTOPS)[0][],
  label: string
): number | null {
  const direction = numericFields[label];
  if (!direction) return null;

  const values = laptops.map((l) => {
    const field = compareFields.find((f) => f.label === label)!;
    const raw = field.key(l).toString();
    return parseFloat(raw.replace(/[^0-9.]/g, ""));
  });

  if (values.some(isNaN)) return null;

  const best =
    direction === "higher" ? Math.max(...values) : Math.min(...values);
  const idx = values.indexOf(best);
  return values.filter((v) => v === best).length === 1 ? idx : null;
}

export function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const isEmpty = compareList.length === 0;
  const hasOne = compareList.length === 1;

  if (isEmpty) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-gray-800 mb-2">No Laptops to Compare</h2>
        <p className="text-gray-500 text-sm mb-6">
          Add 2–3 laptops from the browse page to compare them side-by-side.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Browse Laptops <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Show some suggestions */}
        <div className="mt-14 text-left">
          <h3 className="text-gray-700 mb-4">Popular comparisons to start with:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LAPTOPS.slice(0, 4).map((laptop) => (
              <LaptopCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasOne) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-gray-900 mb-2">Compare Laptops</h1>
        <p className="text-gray-500 text-sm mb-8">Add at least one more laptop to start comparing.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {compareList.map((laptop) => (
            <LaptopCard key={laptop.id} laptop={laptop} />
          ))}
          {/* Empty slots */}
          {Array.from({ length: 3 - compareList.length }).map((_, i) => (
            <Link
              key={i}
              to="/browse"
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl border-2 border-dashed border-current flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                +
              </div>
              <p className="text-sm">Add laptop to compare</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900">Compare Laptops</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Comparing {compareList.length} laptop{compareList.length > 1 ? "s" : ""} side-by-side
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/browse"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            + Add more
          </Link>
          <button
            onClick={clearCompare}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Laptop Headers */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
        <div />
        {compareList.map((laptop) => (
          <div key={laptop.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="relative">
              <img
                src={laptop.image}
                alt={laptop.name}
                className="w-full h-36 object-cover"
              />
              <button
                onClick={() => removeFromCompare(laptop.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors shadow"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {laptop.badge && (
                <span className="absolute bottom-2 left-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                  {laptop.badge}
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-500">{laptop.brand}</p>
              <Link
                to={`/laptop/${laptop.id}`}
                className="text-gray-900 text-sm hover:text-blue-600 transition-colors line-clamp-2"
                style={{ fontWeight: 600 }}
              >
                {laptop.name}
              </Link>
              <p className="text-blue-600 mt-1" style={{ fontWeight: 700 }}>
                ${laptop.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add empty slot if less than 3 */}
      {compareList.length < 3 && (
        <div
          className="grid gap-4 mb-6"
          style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr) 1fr` }}
        >
          <div />
          {compareList.map((l) => <div key={l.id} />)}
          <Link
            to="/browse"
            className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors text-sm flex-col gap-2"
          >
            <span className="text-2xl">+</span>
            <span>Add laptop</span>
          </Link>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {compareFields.map((field, i) => {
          const bestIdx = getBestIndex(compareList, field.label);
          const isBoolean = typeof field.key(compareList[0]) === "boolean";

          return (
            <div
              key={field.label}
              className={`grid ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}
            >
              <div className="px-4 py-3 flex items-center">
                <span className="text-xs text-gray-500" style={{ fontWeight: 600 }}>{field.label}</span>
              </div>
              {compareList.map((laptop, idx) => {
                const val = field.key(laptop);
                const isBest = idx === bestIdx;
                const isWorst = bestIdx !== null && !isBest;

                return (
                  <div
                    key={laptop.id}
                    className={`px-4 py-3 border-l border-gray-100 flex items-center ${
                      isBest ? "bg-green-50" : ""
                    }`}
                  >
                    {isBoolean ? (
                      val ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-300" />
                      )
                    ) : (
                      <span
                        className={`text-xs ${
                          isBest
                            ? "text-green-700 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {val.toString()}
                        {isBest && (
                          <span className="ml-1.5 text-green-600" title="Best value">★</span>
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* View Details Links */}
      <div
        className="grid gap-4 mt-4"
        style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}
      >
        <div />
        {compareList.map((laptop) => (
          <Link
            key={laptop.id}
            to={`/laptop/${laptop.id}`}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            View Full Specs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
