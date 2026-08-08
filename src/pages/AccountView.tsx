import { useState, useMemo, useEffect } from 'react';
import { AccountData } from '../utils/calculator';
import { calculateInterestTimeline } from '../utils/calculator';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartLineUp, ListDashes, Gear, TrendUp, Plus, CaretDown, CaretLeft, CaretRight, Warning } from '@phosphor-icons/react';
import { useTranslation } from '../utils/i18n';

interface AccountViewProps {
  account: AccountData;
  onSave: (updated: AccountData) => void;
  initialTab?: 'breakdown' | 'tx' | 'rates' | 'settings';
}

export default function AccountView({ account, onSave, initialTab = 'breakdown' }: AccountViewProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'breakdown' | 'tx' | 'rates' | 'settings'>(initialTab);
  const [calcDate, setCalcDate] = useState(() => new Date().toISOString().split('T')[0]);

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

  // TX states
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [txAmount, setTxAmount] = useState('');
  const [txNote, setTxNote] = useState('');

  // Rate states
  const [rateDate, setRateDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [rateVal, setRateVal] = useState('');

  // Local settings states
  const [bankName, setBankName] = useState(account.bank_name);
  const [dayBase, setDayBase] = useState(account.day_count_convention);
  const [anchor, setAnchor] = useState(account.anchor_date || '');
  const [confirmingClear, setConfirmingClear] = useState(false);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const addYear = (d?: string) => {
      if (d && d.length >= 4) {
        const y = parseInt(d.substring(0, 4));
        if (!isNaN(y)) years.add(y);
      }
    };
    addYear(account.anchor_date);
    account.transactions.forEach(t => addYear(t.date));
    account.rate_history.forEach(r => addYear(r.start_date));
    const currentY = new Date().getFullYear();
    years.add(currentY);
    return Array.from(years).sort((a, b) => a - b);
  }, [account]);

  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears, selectedYear]);

  const handleYearChange = (dir: 1 | -1) => {
    const idx = availableYears.indexOf(selectedYear);
    if (idx >= 0) {
      const nextIdx = idx + dir;
      if (nextIdx >= 0 && nextIdx < availableYears.length) {
        const newYear = availableYears[nextIdx];
        setSelectedYear(newYear);
        const currentY = new Date().getFullYear();
        const today = new Date().toISOString().split('T')[0];
        setCalcDate(newYear === currentY ? today : `${newYear}-12-31`);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      setBankName(account.bank_name);
      setDayBase(account.day_count_convention);
      setAnchor(account.anchor_date || '');
    }
  }, [activeTab, account]);

  const res = useMemo(() => calculateInterestTimeline(account, calcDate), [account, calcDate]);

  const yearData = useMemo(() => {
    const yStr = selectedYear.toString();
    const logs = res.daily_logs.filter(l => l.date.startsWith(yStr));
    const totalInterest = logs.reduce((sum, l) => sum + l.daily_interest, 0);
    
    let cumIntYear = 0;
    const yearLogs = logs.map(l => {
      cumIntYear += l.daily_interest;
      return { ...l, cumIntYear };
    });

    const maxRate = logs.length > 0 ? Math.max(...logs.map(l => l.rate_pct)) : res.current_rate;
    const isCurrentYear = selectedYear === new Date().getFullYear();

    return {
      logs: yearLogs,
      totalInterest,
      balance: res.current_balance,
      rate: isCurrentYear ? res.current_rate : maxRate,
      isCurrentYear,
      days: logs.length
    };
  }, [res, selectedYear]);

  const yearTxs = useMemo(() => account.transactions.filter(tx => tx.date.startsWith(selectedYear.toString())), [account.transactions, selectedYear]);
  const yearRates = useMemo(() => account.rate_history.filter(r => r.start_date.startsWith(selectedYear.toString())), [account.rate_history, selectedYear]);

  const handleAddTx = () => {
    if (!txDate || !txAmount) return;
    const val = parseFloat(txAmount);
    if (isNaN(val)) return;
    const updated = {
      ...account,
      transactions: [...account.transactions, { date: txDate, amount: val, note: txNote }]
    };
    onSave(updated);
    setTxAmount('');
    setTxNote('');
  };

  const handleDelTx = (idx: number) => {
    const updatedTxs = [...account.transactions];
    updatedTxs.splice(idx, 1);
    onSave({ ...account, transactions: updatedTxs });
  };

  const handleAddRate = () => {
    if (!rateDate || !rateVal) return;
    const val = parseFloat(rateVal);
    if (isNaN(val)) return;
    const existingIdx = account.rate_history.findIndex(r => r.start_date === rateDate);
    const updatedRates = [...account.rate_history];
    if (existingIdx >= 0) {
      updatedRates[existingIdx].rate = val;
    } else {
      updatedRates.push({ start_date: rateDate, rate: val });
    }
    onSave({ ...account, rate_history: updatedRates });
    setRateVal('');
  };

  const handleDelRate = (idx: number) => {
    const updatedRates = [...account.rate_history];
    updatedRates.splice(idx, 1);
    onSave({ ...account, rate_history: updatedRates });
  };

  const handleSaveSettings = () => {
    onSave({
      ...account,
      bank_name: bankName,
      day_count_convention: dayBase,
      anchor_date: anchor
    });
  };

  const handleClearAccount = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 3000);
      return;
    }
    onSave({...account, transactions: [], rate_history: []});
    setConfirmingClear(false);
  };

  const tabs = [
    { id: 'breakdown', label: t('timeline'), icon: ChartLineUp },
    { id: 'tx', label: t('transactions'), icon: ListDashes },
    { id: 'rates', label: t('rates'), icon: TrendUp },
    { id: 'settings', label: t('config'), icon: Gear },
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-5xl md:text-[3.25rem] font-semibold tracking-tight text-zinc-50 mb-1 leading-none">{account.bank_name}</h2>
          <p className="text-zinc-400 mt-2">ACT/{account.day_count_convention}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="group flex items-center gap-2 bg-zinc-900/30 px-2 py-1 rounded-xl border border-white/5 transition-all hover:bg-zinc-900/60">
            <button 
              onClick={() => handleYearChange(-1)} 
              disabled={availableYears.indexOf(selectedYear) <= 0}
              className="text-zinc-500 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-500 transition-colors p-0.5"
            >
              <CaretLeft weight="bold" className="w-3 h-3" />
            </button>
            <span className="text-sm font-bold tracking-widest text-zinc-200 w-10 text-center">{selectedYear}</span>
            <button 
              onClick={() => handleYearChange(1)} 
              disabled={availableYears.indexOf(selectedYear) >= availableYears.length - 1}
              className="text-zinc-500 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-500 transition-colors p-0.5"
            >
              <CaretRight weight="bold" className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-white/10 rounded-lg shadow-sm border border-white/10" />
              )}
              <tab.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('balance'), value: yearData.balance, unit: '€', color: 'text-emerald-400' },
          { label: t('interest'), value: yearData.totalInterest, unit: '€', color: 'text-amber-400' },
          { label: yearData.isCurrentYear ? t('currentRate') : t('maxRate'), value: yearData.rate, unit: '%', color: 'text-blue-400' },
          { label: t('days'), value: yearData.days, unit: t('daysUnit'), color: 'text-purple-400', isInt: true }
        ].map((kpi, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{kpi.label}</p>
            <div className={`text-2xl font-bold flex items-baseline ${kpi.color}`}>
              {kpi.isInt ? kpi.value : formatSmallDec(kpi.value as number)} <span className="text-zinc-500 text-sm ml-1">{kpi.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 glass-panel rounded-[2rem] p-6 overflow-hidden flex flex-col relative min-h-[250px]">
        <AnimatePresence mode="wait">
          {activeTab === 'breakdown' && (
            <motion.div key="breakdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full absolute inset-0 p-6">
              <div className="flex items-center gap-4 mb-5">
                <label className="text-sm text-zinc-400">{t('targetDate')}:</label>
                <input 
                  type="date" 
                  value={calcDate} 
                  onChange={e => setCalcDate(e.target.value)}
                  className="bg-zinc-900 border border-white/10 rounded-2xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              <div className="flex-1 overflow-auto rounded-xl border border-white/5 bg-zinc-950/50">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-3">{t('date')}</th>
                      <th className="px-6 py-3 text-right">{t('transaction')}</th>
                      <th className="px-6 py-3 text-right">{t('balance')}</th>
                      <th className="px-6 py-3 text-right">{t('rate')}</th>
                      <th className="px-6 py-3 text-right">{t('dailyInt')}</th>
                      <th className="px-6 py-3 text-right">{t('cumInt')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...yearData.logs].reverse().map((log, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3 text-zinc-300">{log.date}</td>
                        <td className={`px-6 py-3 text-right font-medium ${log.tx_today > 0 ? 'text-emerald-400' : log.tx_today < 0 ? 'text-red-400' : 'text-zinc-600'}`}>
                          {log.tx_today !== 0 ? (log.tx_today > 0 ? '+' : '') + log.tx_today.toLocaleString('de-DE', {minimumFractionDigits: 2}) : '-'}
                        </td>
                        <td className="px-6 py-3 text-right text-zinc-100">{log.balance.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td className="px-6 py-3 text-right text-zinc-400">{log.rate_pct.toFixed(2)}%</td>
                        <td className="px-6 py-3 text-right text-amber-500/80">{log.daily_interest.toFixed(4)}</td>
                        <td className="px-6 py-3 text-right text-amber-400">{log.cumIntYear.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'tx' && (
            <motion.div key="tx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full absolute inset-0 p-6">
              <div className="flex gap-4 mb-5 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1">{t('date')}</label>
                  <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1">{t('amount')}</label>
                  <input type="number" placeholder="-500" value={txAmount} onChange={e => setTxAmount(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex-[2]">
                  <label className="block text-xs text-zinc-500 mb-1">{t('note')}</label>
                  <input type="text" placeholder="..." value={txNote} onChange={e => setTxNote(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <button onClick={handleAddTx} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-2 rounded-2xl flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap">
                  <Plus weight="bold" /> {t('add')}
                </button>
              </div>

              <div className="flex-1 overflow-auto rounded-xl border border-white/5 bg-zinc-950/50">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-3">{t('date')}</th>
                      <th className="px-6 py-3 text-right">{t('amount')}</th>
                      <th className="px-6 py-3">{t('note')}</th>
                      <th className="px-6 py-3 text-right">{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...yearTxs].sort((a,b) => b.date.localeCompare(a.date)).map((tx, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-6 py-3 text-zinc-300">{tx.date}</td>
                        <td className={`px-6 py-3 text-right font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('de-DE', {minimumFractionDigits: 2})} €
                        </td>
                        <td className="px-6 py-3 text-zinc-500">{tx.note}</td>
                        <td className="px-6 py-3 text-right">
                          <button onClick={() => handleDelTx(account.transactions.indexOf(tx))} className="text-red-500 hover:text-red-400 text-xs font-semibold px-3 py-1 rounded bg-red-500/10 whitespace-nowrap">{t('delete')}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'rates' && (
            <motion.div key="rates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full absolute inset-0 p-6">
               <div className="flex gap-4 mb-5 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1">{t('startDate')}</label>
                  <input type="date" value={rateDate} onChange={e => setRateDate(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1">{t('annualRate')}</label>
                  <input type="number" placeholder="3.5" value={rateVal} onChange={e => setRateVal(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <button onClick={handleAddRate} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-2 rounded-2xl flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap">
                  <Plus weight="bold" /> {t('addRate')}
                </button>
              </div>

              <div className="flex-1 overflow-auto rounded-xl border border-white/5 bg-zinc-950/50">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-3">{t('startDate')}</th>
                      <th className="px-6 py-3">{t('annualRate')}</th>
                      <th className="px-6 py-3 text-right">{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...yearRates].sort((a,b) => b.start_date.localeCompare(a.start_date)).map((r, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-6 py-3 text-zinc-300">{r.start_date}</td>
                        <td className="px-6 py-3 font-medium text-blue-400">{r.rate.toFixed(2)} %</td>
                        <td className="px-6 py-3 text-right">
                          <button onClick={() => handleDelRate(account.rate_history.indexOf(r))} className="text-red-500 hover:text-red-400 text-xs font-semibold px-3 py-1 rounded bg-red-500/10 whitespace-nowrap">{t('delete')}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0 p-6 overflow-y-auto">
              <div className="grid grid-cols-[minmax(0,6fr)_auto_minmax(0,4fr)] gap-x-8 gap-y-8 max-w-4xl">
                
                {/* Divider */}
                <div className="col-start-2 row-start-1 row-span-3 w-px bg-white/5"></div>

                {/* Row 1 */}
                <div className="col-start-1">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">{t('bankName')}</label>
                  <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 h-12 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="col-start-3 flex items-end">
                  <button onClick={handleSaveSettings} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-8 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-95">
                    {t('saveConfig')}
                  </button>
                </div>
                
                {/* Row 2 */}
                <div className="col-start-1">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">{t('dayCount')}</label>
                  <div className="relative">
                    <select value={dayBase} onChange={e => setDayBase(parseInt(e.target.value))} className="appearance-none w-full bg-zinc-900 border border-white/10 rounded-2xl pl-4 pr-10 h-12 text-white focus:outline-none focus:border-emerald-500">
                      <option value={360}>ACT/360</option>
                      <option value={365}>ACT/365</option>
                    </select>
                    <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="col-start-1">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">{t('anchorDate')}</label>
                  <p className="text-xs text-zinc-500 mb-2">{t('anchorDateDesc')}</p>
                  <input type="date" value={anchor} onChange={e => setAnchor(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 h-12 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="col-start-3 flex items-end">
                  <button 
                    onClick={handleClearAccount}
                    className={`w-full px-6 h-12 flex items-center justify-center rounded-2xl text-sm font-medium transition-colors ${confirmingClear ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500'}`}
                  >
                    {confirmingClear ? (
                      <span className="flex items-center gap-2"><Warning className="w-4 h-4" /> {t('confirmClear')}</span>
                    ) : (
                      t('clearAccountData')
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
