import { useState } from 'react';
import { AppData } from '../utils/store';
import { AccountData } from '../utils/calculator';
import { Plus, Trash, UploadSimple, DownloadSimple, Warning, CaretDown } from '@phosphor-icons/react';
import { useTranslation, Language } from '../utils/i18n';

interface SettingsProps {
  data: AppData;
  onSave: (data: AppData) => void;
}

export default function Settings({ data, onSave }: SettingsProps) {
  const { t, lang, setLanguage } = useTranslation();
  const [defaultPage, setDefaultPage] = useState(data.settings?.default_page || 'dashboard');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  
  const handleSaveDefault = () => {
    onSave({
      ...data,
      settings: { ...data.settings, default_page: defaultPage, language: lang }
    });
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    onSave({
      ...data,
      settings: { ...data.settings, language: newLang }
    });
  };

  const handleAddAccount = () => {
    const id = 'acc_' + Math.random().toString(36).substring(2, 9);
    const newAcc: AccountData = {
      id,
      bank_name: 'New Bank',
      day_count_convention: 360,
      anchor_date: '',
      rate_history: [],
      transactions: []
    };
    onSave({
      ...data,
      accounts: [...data.accounts, newAcc]
    });
  };

  const handleRemoveAccount = (id: string) => {
    if (deletingId === id) {
      onSave({
        ...data,
        accounts: data.accounts.filter(a => a.id !== id),
        settings: {
          ...data.settings,
          default_page: defaultPage === id ? 'dashboard' : defaultPage
        }
      });
      if (defaultPage === id) setDefaultPage('dashboard');
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tagesgeld_data_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string) as AppData;
        if (importedData && importedData.accounts) {
          onSave(importedData);
          alert('Data imported successfully!');
        } else {
          alert('Invalid data format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 3000);
      return;
    }
    onSave({
      settings: { default_page: 'dashboard', language: lang },
      accounts: []
    });
    setDefaultPage('dashboard');
    setConfirmingClear(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50 mb-2">{t('globalSettings')}</h2>
        <p className="text-zinc-400">{t('globalSettingsDesc')}</p>
      </div>

      <div className="glass-panel p-6 rounded-[2rem] mb-8">
        <h3 className="text-xl font-semibold text-zinc-100 mb-6">{t('generalConfig')}</h3>
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-300 mb-2">{t('displayLanguage')}</label>
            <div className="relative">
              <select value={lang} onChange={e => handleLanguageChange(e.target.value as Language)} className="appearance-none w-full bg-zinc-900 border border-white/10 rounded-2xl pl-4 pr-10 h-12 text-white focus:outline-none focus:border-emerald-500">
                <option value="zh">简体中文 (Chinese)</option>
                <option value="en">English (English)</option>
                <option value="de">Deutsch (German)</option>
              </select>
              <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-300 mb-2">{t('defaultStartup')}</label>
            <div className="relative">
              <select value={defaultPage} onChange={e => setDefaultPage(e.target.value)} className="appearance-none w-full bg-zinc-900 border border-white/10 rounded-2xl pl-4 pr-10 h-12 text-white focus:outline-none focus:border-emerald-500">
                <option value="dashboard">{t('dashboard')} (Overview)</option>
                {data.accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.bank_name}</option>
                ))}
              </select>
              <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <button onClick={handleSaveDefault} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-8 h-12 rounded-2xl transition-all active:scale-95 whitespace-nowrap">
            {t('apply')}
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[2rem] mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-zinc-100">{t('manageAccounts')}</h3>
          <button onClick={handleAddAccount} className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t('addAccount')}
          </button>
        </div>
        
        <div className="space-y-4">
          {data.accounts.map(acc => (
            <div key={acc.id} className="flex items-center justify-between bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
              <div>
                <p className="font-semibold text-zinc-100">{acc.bank_name}</p>
                <p className="text-xs text-zinc-500">ID: {acc.id} • {acc.transactions.length} Txs</p>
              </div>
              <button 
                onClick={() => handleRemoveAccount(acc.id)} 
                className={`p-2 rounded-lg transition-colors font-semibold text-xs ${deletingId === acc.id ? 'bg-red-500 text-white hover:bg-red-600' : 'text-red-500 hover:bg-red-500/10'}`}
              >
                {deletingId === acc.id ? t('confirm') : <Trash className="w-5 h-5" />}
              </button>
            </div>
          ))}
          {data.accounts.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              {t('noAccounts')}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[2rem] border-red-500/20">
        <h3 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center gap-2">
          <Warning className="w-6 h-6 text-amber-500" /> {t('dataManagement')}
        </h3>
        <p className="text-zinc-400 mb-6 text-sm">
          {t('dataManagementDesc')}
        </p>
        
        <div className="flex flex-wrap gap-4">
          <label className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <UploadSimple className="w-5 h-5" /> {t('importJSON')}
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          
          <button onClick={handleExport} className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2 whitespace-nowrap">
            <DownloadSimple className="w-5 h-5" /> {t('exportBackup')}
          </button>
          
          <button onClick={handleClearAll} className={`font-medium px-6 py-3 rounded-xl text-sm transition-all ml-auto whitespace-nowrap min-w-[150px] flex justify-center items-center ${confirmingClear ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500'}`}>
            {confirmingClear ? (
              <span className="flex items-center gap-2"><Warning className="w-4 h-4" /> {t('confirmClear')}</span>
            ) : (
              t('clearAllData')
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 mb-4 text-center flex flex-col items-center justify-center space-y-2">
        <div className="text-zinc-500 text-sm font-medium tracking-widest uppercase">
          ZinsRechner <span className="text-zinc-400">v1.0.0</span>
        </div>
        <div className="text-zinc-600/60 text-xs">
          &copy; 2026 Tun & PaMa AG. All rights reserved.
        </div>
      </div>
    </div>
  );
}
