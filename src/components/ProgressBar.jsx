export default function ProgressBar({ current, total, label }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="px-4 py-3" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={label || `Paso ${current} de ${total}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gris-500">
          Paso {current} de {total}
        </span>
        <span className="text-sm font-bold text-azul-600">
          {percentage}%
        </span>
      </div>
      <div className="h-3 bg-gris-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-azul-500 to-azul-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
