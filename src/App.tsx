import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadData, AppData, saveData } from './utils/store';
import { AccountData } from './utils/calculator';
import { initLanguage } from './utils/i18n';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AccountView from './pages/AccountView';
import Settings from './pages/Settings';
import './index.css';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [newAccountId, setNewAccountId] = useState<string | null>(null);

  useEffect(() => {
    loadData().then((d) => {
      initLanguage(d.settings?.language);
      setData(d);
      if (d.settings?.default_page) {
        setActivePage(d.settings.default_page);
      }
    });
  }, []);

  if (!data) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-950 text-white">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading Vault...
        </motion.div>
      </div>
    );
  }

  const handleSave = async (newData: AppData) => {
    setData(newData);
    await saveData(newData);
  };

  const handleCreateAccount = () => {
    if (!data) return;
    const id = 'acc_' + Math.random().toString(36).substring(2, 9);
    const newAcc: AccountData = {
      id,
      bank_name: 'New Bank',
      day_count_convention: 360,
      anchor_date: '',
      rate_history: [],
      transactions: []
    };
    handleSave({
      ...data,
      accounts: [...data.accounts, newAcc]
    });
    setNewAccountId(id);
    setActivePage(id);
  };

  return (
    <div className="flex min-h-[100dvh] bg-[#09090b] text-zinc-50 overflow-hidden font-sans">
      <Sidebar 
        data={data} 
        activePage={activePage} 
        onNavigate={setActivePage}
        onCreateAccount={handleCreateAccount}
      />
      
      <main className="flex-1 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {activePage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
              className="absolute inset-0 p-6 md:p-8 flex flex-col"
            >
              <Dashboard data={data} onNavigate={setActivePage} />
            </motion.div>
          )}
          {activePage === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
              className="absolute inset-0 p-6 md:p-8 flex flex-col"
            >
              <Settings data={data} onSave={handleSave} />
            </motion.div>
          )}
          {activePage !== 'dashboard' && activePage !== 'settings' && (
            <motion.div
              key={`account-${activePage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
              className="absolute inset-0 p-6 md:p-8 flex flex-col"
            >
              <AccountView 
                account={data.accounts.find(a => a.id === activePage)!} 
                initialTab={activePage === newAccountId ? 'settings' : 'breakdown'}
                onSave={(acc: AccountData) => {
                  const newAccounts = data.accounts.map(a => a.id === acc.id ? acc : a);
                  handleSave({ ...data, accounts: newAccounts });
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
