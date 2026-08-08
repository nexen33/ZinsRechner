import { AppData } from '../utils/store';
import { useTranslation } from '../utils/i18n';
import { SquaresFour, Wallet, Gear, Plus, Bank } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface SidebarProps {
  data: AppData;
  activePage: string;
  onNavigate: (pageId: string) => void;
  onCreateAccount: () => void;
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar({ data, activePage, onNavigate, onCreateAccount }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="w-52 border-r border-white/5 bg-[#09090b] flex flex-col pt-8 pb-6 px-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Bank weight="fill" className="text-[#09090b] w-5 h-5" />
        </div>
        <h1 className="font-semibold tracking-tight text-zinc-100 text-lg">{t('appTitle')}</h1>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">{t('overview')}</p>
          <div className="space-y-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative group",
                activePage === 'dashboard' ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
              )}
            >
              {activePage === 'dashboard' && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-lg" />
              )}
              <SquaresFour weight={activePage === 'dashboard' ? "fill" : "regular"} className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{t('dashboard')}</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('accounts')}</h3>
            <button onClick={onCreateAccount} className="text-zinc-500 hover:text-zinc-100 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {data.accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => onNavigate(acc.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative group",
                  activePage === acc.id ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                )}
              >
                {activePage === acc.id && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-lg" />
                )}
                <Wallet weight={activePage === acc.id ? "fill" : "regular"} className="w-5 h-5 relative z-10" />
                <span className="relative z-10 truncate text-left w-full">{acc.bank_name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => onNavigate('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative group",
            activePage === 'settings' ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
          )}
        >
          {activePage === 'settings' && (
            <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-lg" />
          )}
          <Gear weight={activePage === 'settings' ? "fill" : "regular"} className="w-5 h-5 relative z-10" />
          <span className="relative z-10">{t('settings')}</span>
        </button>
      </div>
    </div>
  );
}
