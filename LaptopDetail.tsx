import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft, Star, Cpu, HardDrive, Monitor, Battery, Weight,
  Wifi, Camera, GitCompare, Check, Plug, RefreshCw, RotateCcw,
  ThumbsUp, ThumbsDown, Tag,
} from "lucide-react";
import { LAPTOPS, getLaptopById } from "../data/laptops";
import { useCompare } from "../context/CompareContext";
import { LaptopCard } from "../components/LaptopCard";

const categoryColors: Record<string, string> = {
  ultrabook: "bg-blue-100 text-blue-700",
  gaming: "bg-red-100 text-red-700",
  business: "bg-slate-100 text-slate-700",
  budget: "bg-green-100 text-green-700",
  "2-in-1": "bg-purple-100 text-purple-700",
  workstation: "bg-orange-100 text-orange-700",
};

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}

export function LaptopDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const laptop = getLaptopById(id ?? "");
  const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare();

  if (!laptop) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-gray-800 mb-2">Laptop Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">
          The laptop you're looking for doesn't exist in our database.
        </p>
        <Link
          to="/browse"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Browse All Laptops
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(laptop.id);

  // Similar laptops: same category, excluding this one
  const similar = LAPTOPS.filter(
    (l) => l.category === laptop.category && l.id !== laptop.id
  ).slice(0, 3);

  const processorColorMap: Record<string, string> = {
    Intel: "text-blue-600",
    AMD: "text-red-600",
    Apple: "text-gray-800",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/browse" className="hover:text-blue-600 transition-colors">Browse</Link>
        <span>/</span>
        <span className="text-gray-800">{laptop.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Left: Image */}
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
            <img
              src={laptop.image}
              alt={laptop.name}
              className="w-full h-full object-cover"
            />
            {laptop.badge && (
              <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-sm px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
                {laptop.badge}
              </span>
            )}
          </div>

          {/* Best For Tags */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Best for:
            </p>
            <div className="flex flex-wrap gap-2">
              {laptop.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">{laptop.brand}</p>
              <h1 className="text-gray-900">{laptop.name}</h1>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${categoryColors[laptop.category]}`}>
              {laptop.category}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= Math.round(laptop.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-gray-700" style={{ fontWeight: 600 }}>{laptop.rating.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">({laptop.reviewCount.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-5">
            <p className="text-3xl text-blue-600" style={{ fontWeight: 700 }}>
              ${laptop.price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Estimated retail price (USD)</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{laptop.description}</p>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Processor", value: laptop.specs.processorBrand, color: processorColorMap[laptop.specs.processorBrand] },
              { label: "RAM", value: `${laptop.specs.ram}GB` },
              { label: "Storage", value: `${laptop.specs.storage}GB ${laptop.specs.storageType}` },
              { label: "Display", value: `${laptop.specs.displaySize}" · ${laptop.specs.refreshRate}Hz` },
              { label: "Battery", value: `Up to ${laptop.specs.batteryLife}h` },
              { label: "Weight", value: `${laptop.specs.weight} lbs` },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className={`text-sm ${color ?? "text-gray-900"}`} style={{ fontWeight: 600 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => inCompare ? removeFromCompare(laptop.id) : addToCompare(laptop)}
              disabled={!inCompare && !canAdd}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-sm ${
                inCompare
                  ? "bg-blue-600 text-white border-blue-600"
                  : canAdd
                  ? "border-blue-300 text-blue-700 hover:bg-blue-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {inCompare ? <Check className="w-4 h-4" /> : <GitCompare className="w-4 h-4" />}
              {inCompare ? "Added to Compare" : !canAdd ? "Compare Full (3/3)" : "Add to Compare"}
            </button>
            <Link
              to="/compare"
              className="flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm"
            >
              View Compare
            </Link>
          </div>
        </div>
      </div>

      {/* Full Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-gray-900 mb-4">Full Specifications</h2>
          <SpecRow icon={<Cpu className="w-4 h-4" />} label="Processor" value={laptop.specs.processor} />
          <SpecRow icon={<HardDrive className="w-4 h-4" />} label="Memory (RAM)" value={`${laptop.specs.ram}GB`} />
          <SpecRow icon={<HardDrive className="w-4 h-4" />} label="Storage" value={`${laptop.specs.storage}GB ${laptop.specs.storageType}`} />
          <SpecRow icon={<Monitor className="w-4 h-4" />} label="Display Size" value={`${laptop.specs.displaySize}"`} />
          <SpecRow icon={<Monitor className="w-4 h-4" />} label="Resolution" value={laptop.specs.resolution} />
          <SpecRow icon={<RefreshCw className="w-4 h-4" />} label="Refresh Rate" value={`${laptop.specs.refreshRate}Hz`} />
          <SpecRow icon={<Monitor className="w-4 h-4" />} label="GPU" value={laptop.specs.gpu} />
          <SpecRow icon={<Battery className="w-4 h-4" />} label="Battery Life" value={`Up to ${laptop.specs.batteryLife} hours`} />
          <SpecRow icon={<Weight className="w-4 h-4" />} label="Weight" value={`${laptop.specs.weight} lbs`} />
          <SpecRow icon={<Monitor className="w-4 h-4" />} label="Operating System" value={laptop.specs.os} />
          <SpecRow icon={<Wifi className="w-4 h-4" />} label="Wireless" value={laptop.specs.wireless} />
          <SpecRow icon={<Camera className="w-4 h-4" />} label="Webcam" value={laptop.specs.webcam} />
          <SpecRow
            icon={<RotateCcw className="w-4 h-4" />}
            label="Touchscreen"
            value={laptop.specs.touchscreen ? "Yes" : "No"}
          />
        </div>

        <div className="space-y-5">
          {/* Ports */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-gray-900 mb-3 flex items-center gap-2">
              <Plug className="w-4 h-4 text-gray-500" /> Ports & Connectivity
            </h3>
            <ul className="space-y-1.5">
              {laptop.specs.ports.map((port) => (
                <li key={port} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  {port}
                </li>
              ))}
            </ul>
          </div>

          {/* Pros */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-green-800 mb-3 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" /> Pros
            </h3>
            <ul className="space-y-1.5">
              {laptop.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-red-800 mb-3 flex items-center gap-2">
              <ThumbsDown className="w-4 h-4" /> Cons
            </h3>
            <ul className="space-y-1.5">
              {laptop.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Laptops */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-6">Similar Laptops</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similar.map((l) => (
              <LaptopCard key={l.id} laptop={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
