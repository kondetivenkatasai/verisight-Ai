import VerisightLogo from '@/ui/VerisightLogo';
import { APP_NAME, APP_DESCRIPTION } from '@/utils/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-800/30 bg-surface-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <VerisightLogo size={20} />
              <span className="text-lg font-bold text-white tracking-tight">{APP_NAME}</span>
            </div>
            <p className="text-surface-400 text-sm max-w-md leading-relaxed">
              {APP_DESCRIPTION}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'How It Works', 'Security', 'Documentation'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-surface-400 hover:text-aegis-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About', 'Privacy', 'Terms', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-surface-400 hover:text-aegis-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/30 text-center">
          <p className="text-xs text-surface-500">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
