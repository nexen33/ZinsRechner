import { AppData } from '../utils/store';
import { calculateInterestTimeline } from '../utils/calculator';
import { useTranslation } from '../utils/i18n';
import { motion } from 'framer-motion';
import { TrendUp, Wallet, ChartLineUp } from '@phosphor-icons/react';

interface DashboardProps {
  data: AppData;
  onNavigate: (pageId: string) => void;
}

export default function Dashboard({ data, onNavigate }: DashboardProps) {
  const { t } = useTranslation();

  const formatSmallDec = (val: number) => {
    const parts = val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',');
    return (
      <>
        {parts[0]}
        <span className="text-[0.65em] opacity-80 mx-[1px]">,</span>
        <span className="text-[0.65em] opacity-80">{parts[1]}</span>
      </>
    );
  };

  const aggregated = data.accounts.map(acc => {
    const res = calculateInterestTimeline(acc);
    return {
      ...acc,
      res
    };
  });

  const totalBalance = aggregated.reduce((acc, curr) => acc + curr.res.current_balance, 0);
  const totalInterest = aggregated.reduce((acc, curr) => acc + curr.res.total_interest, 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50 mb-2">{t('dashboard')}</h2>
      </div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        <motion.div variants={item} className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <Wallet weight="duotone" className="w-24 h-24 text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4">{t('totalBalance')}</p>
          <div className="text-5xl font-bold tracking-tighter text-white mb-2 flex items-baseline">
            {formatSmallDec(totalBalance)} <span className="text-zinc-500 text-3xl ml-2">€</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <TrendUp weight="duotone" className="w-24 h-24 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4">{t('accruedInterest')}</p>
          <div className="text-5xl font-bold tracking-tighter text-white mb-2 flex items-baseline">
            {formatSmallDec(totalInterest)} <span className="text-zinc-500 text-3xl ml-2">€</span>
          </div>
        </motion.div>
      </motion.div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-zinc-100">{t('accounts')}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aggregated.map((acc, i) => (
          <motion.div 
            key={acc.id}
            onClick={() => onNavigate(acc.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1), type: "spring" }}
            className="glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-semibold text-lg text-zinc-100">{acc.bank_name}</h4>
                <p className="text-xs text-zinc-500">ACT/{acc.day_count_convention}</p>
              </div>
              <div className="bg-zinc-800/50 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                <ChartLineUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">{acc.res.current_rate.toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">{t('balance')}</p>
                <p className="text-2xl font-semibold text-zinc-100 flex items-baseline">{formatSmallDec(acc.res.current_balance)} <span className="text-sm text-zinc-500 ml-1">€</span></p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">{t('interest')}</p>
                <p className="text-lg font-medium text-amber-400 flex items-baseline">{formatSmallDec(acc.res.total_interest)} <span className="text-sm opacity-50 ml-1">€</span></p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
