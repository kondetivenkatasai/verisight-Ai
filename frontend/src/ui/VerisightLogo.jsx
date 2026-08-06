export default function VerisightLogo({ size = 28, showText = false, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* SVG Icon Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md"
      >
        <defs>
          <linearGradient id="vPrimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          <linearGradient id="vSecGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <radialGradient id="vIrisGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </radialGradient>
        </defs>

        {/* Outer Shield Contour */}
        <path
          d="M 128 140 C 190 120, 322 120, 384 140 C 384 250, 330 360, 256 424 C 182 360, 128 250, 128 140 Z"
          fill="none"
          stroke="url(#vSecGrad)"
          strokeWidth="6"
          strokeOpacity="0.35"
        />

        {/* Left Arm of Geometric V */}
        <path d="M 148 152 L 256 400 L 256 320 L 192 168 Z" fill="url(#vPrimGrad)" />

        {/* Right Arm of Geometric V */}
        <path d="M 364 152 L 256 400 L 256 320 L 320 168 Z" fill="url(#vSecGrad)" />

        {/* Upper Shield Arch */}
        <path d="M 148 152 Q 256 185 364 152 L 320 168 Q 256 198 192 168 Z" fill="url(#vPrimGrad)" opacity="0.9" />

        {/* Eye Aperture (Negative Space Vision Center) */}
        <path d="M 176 220 Q 256 150 336 220 Q 256 290 176 220 Z" fill="#0A0A0F" stroke="url(#vPrimGrad)" strokeWidth="7" />

        {/* Lens Iris */}
        <circle cx="256" cy="220" r="26" fill="url(#vIrisGlow)" />
        <circle cx="256" cy="220" r="12" fill="#FFFFFF" />

        {/* Nodes */}
        <line x1="256" y1="120" x2="256" y2="168" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4,4" />
        <circle cx="256" cy="120" r="7" fill="#38BDF8" />
        <circle cx="148" cy="152" r="7" fill="#06B6D4" />
        <circle cx="364" cy="152" r="7" fill="#7C3AED" />
        <circle cx="192" cy="220" r="5" fill="#3B82F6" />
        <circle cx="320" cy="220" r="5" fill="#3B82F6" />
        <circle cx="256" cy="400" r="8" fill="#38BDF8" />
      </svg>

      {/* Optional Full Typography */}
      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-baseline">
            <span className="text-xl font-extrabold text-white tracking-tight">Verisight</span>
            <span className="text-sm font-normal text-aegis-400 ml-1 tracking-wider">AI</span>
          </div>
          <span className="text-[10px] font-semibold text-surface-400 tracking-widest uppercase">
            See the Truth. Decide with Confidence.
          </span>
        </div>
      )}
    </div>
  );
}
