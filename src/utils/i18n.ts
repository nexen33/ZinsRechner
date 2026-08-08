import { useState, useEffect } from 'react';

export type Language = 'zh' | 'en' | 'de';

const dictionary = {
  en: {
    appTitle: 'ZinsRechner',
    overview: 'Overview',
    dashboard: 'Dashboard',
    accounts: 'Accounts',
    settings: 'Settings',
    totalBalance: 'Total Balance',
    accruedInterest: 'Accrued Interest',
    balance: 'Balance',
    interest: 'Interest',
    rate: 'Rate',
    currentRate: 'Current Rate',
    maxRate: 'Max Rate',
    days: 'Logged Days',
    daysUnit: 'd',
    timeline: 'Timeline',
    transactions: 'Transactions',
    rates: 'Rates',
    config: 'Config',
    targetDate: 'Target Date',
    date: 'Date',
    transaction: 'Transaction',
    dailyInt: 'Daily Int.',
    cumInt: 'Cum. Interest',
    amount: 'Amount (€)',
    note: 'Note',
    add: 'Add',
    delete: 'Delete',
    startDate: 'Start Date',
    annualRate: 'Annual Rate (%)',
    addRate: 'Add Rate',
    bankName: 'Bank Name',
    dayCount: 'Day Count Convention',
    anchorDate: 'Anchor Date (Zero Balance Ref)',
    anchorDateDesc: 'If you know the balance was 0 on a specific date, set it here for reverse timeline deduction',
    saveConfig: 'Save Configuration',
    dangerZone: 'Danger Zone',
    clearAllData: 'Clear All Data',
    clearAllWarning: 'WARNING: This will completely erase all accounts, transactions, and rates. This action cannot be undone. Are you absolutely sure?',
    clearAccountData: 'Clear Current Account Data',
    clearAccountWarning: 'WARNING: This will erase all transactions and rates for this account. Are you sure?',
    globalSettings: 'Global Settings',
    globalSettingsDesc: 'Configure global app behaviors and manage your accounts',
    generalConfig: 'General Configuration',
    defaultStartup: 'Default Startup Page',
    apply: 'Apply',
    manageAccounts: 'Manage Accounts',
    addAccount: 'Add Account',
    noAccounts: 'No accounts added yet',
    dataManagement: 'Data Management',
    dataManagementDesc: 'Import or export your data for backups. All data is securely stored in your system\'s local AppData directory',
    importJSON: 'Import JSON',
    exportBackup: 'Export Backup',
    displayLanguage: 'Display Language',
    action: 'Action',
    confirm: 'Confirm',
    confirmClear: 'Are you sure?'
  },
  de: {
    appTitle: 'ZinsRechner',
    overview: 'Übersicht',
    dashboard: 'Übersicht',
    accounts: 'Konten',
    settings: 'Einstellungen',
    totalBalance: 'Gesamtsaldo',
    accruedInterest: 'Zinsertrag',
    balance: 'Saldo',
    interest: 'Zinsen',
    rate: 'Zins',
    currentRate: 'Aktueller Zins',
    maxRate: 'Max. Zins',
    days: 'Erfasste Tage',
    daysUnit: 'T',
    timeline: 'Verlauf',
    transactions: 'Umsätze',
    rates: 'Zinssätze',
    config: 'Konfig',
    targetDate: 'Zieldatum',
    date: 'Datum',
    transaction: 'Umsatz',
    dailyInt: 'Tageszins',
    cumInt: 'Summe Zinsen',
    amount: 'Betrag (€)',
    note: 'Notiz',
    add: 'Hinzu',
    delete: 'Löschen',
    startDate: 'Startdatum',
    annualRate: 'Jahreszins (%)',
    addRate: 'Zins hinzu',
    bankName: 'Bankname',
    dayCount: 'Zinsmethode',
    anchorDate: 'Ankerdatum (Nullsaldo)',
    anchorDateDesc: 'Wenn der Kontostand an einem bestimmten Tag 0 war, hier für die Rückwärtsberechnung setzen',
    saveConfig: 'Speichern',
    dangerZone: 'Gefahrenzone',
    clearAllData: 'Alle Daten löschen',
    clearAllWarning: 'ACHTUNG: Dies löscht alle Konten, Umsätze und Zinssätze. Dies kann nicht rückgängig gemacht werden. Sind Sie sicher?',
    clearAccountData: 'Aktuelle Kontodaten löschen',
    clearAccountWarning: 'ACHTUNG: Dies löscht alle Umsätze und Zinssätze für dieses Konto. Sind Sie sicher?',
    globalSettings: 'Globale Einstellung',
    globalSettingsDesc: 'App-Verhalten konfigurieren und Konten verwalten',
    generalConfig: 'Allgemein',
    defaultStartup: 'Startseite',
    apply: 'Anwenden',
    manageAccounts: 'Konten verwalten',
    addAccount: 'Konto hinzu',
    noAccounts: 'Keine Konten vorhanden',
    dataManagement: 'Datenverwaltung',
    dataManagementDesc: 'Daten zur Sicherung importieren oder exportieren. Alles wird sicher im AppData-Verzeichnis gespeichert',
    importJSON: 'Importieren',
    exportBackup: 'Exportieren',
    displayLanguage: 'Sprache',
    action: 'Aktion',
    confirm: 'Bestätigen',
    confirmClear: 'Wirklich löschen?'
  },
  zh: {
    appTitle: 'ZinsRechner',
    overview: '概览',
    dashboard: '概览',
    accounts: '账户列表',
    settings: '全局设置',
    totalBalance: '总余额',
    accruedInterest: '累计利息',
    balance: '余额',
    interest: '利息',
    rate: '利率',
    currentRate: '当前利率',
    maxRate: '最高利率',
    days: '记录天数',
    daysUnit: '天',
    timeline: '计息推演',
    transactions: '交易流水',
    rates: '利率变动',
    config: '账户配置',
    targetDate: '目标推演日',
    date: '日期',
    transaction: '交易金额',
    dailyInt: '当日利息',
    cumInt: '累计利息',
    amount: '变动金额 (€)',
    note: '备注 (可选)',
    add: '添加',
    delete: '删除',
    startDate: '生效起始日',
    annualRate: '年化利率 (%)',
    addRate: '添加利率',
    bankName: '账户/银行名称',
    dayCount: '计息基准天数',
    anchorDate: '基准清零日 (Anchor Date)',
    anchorDateDesc: '如已知某天余额为0，可设定此日用于逆向推导历史余额',
    saveConfig: '保存配置',
    dangerZone: '危险操作',
    clearAllData: '清空所有数据',
    clearAllWarning: '警告：这将永久删除所有账户、流水与利率记录！确认操作？',
    clearAccountData: '清空当前帐户数据',
    clearAccountWarning: '警告：这将永久删除该账户的所有流水与利率记录！确认操作？',
    globalSettings: '全局设置',
    globalSettingsDesc: '配置应用全局行为与账户管理',
    generalConfig: '通用配置',
    defaultStartup: '默认启动页面',
    apply: '应用',
    manageAccounts: '账户管理',
    addAccount: '添加新账户',
    noAccounts: '暂无账户',
    dataManagement: '数据管理',
    dataManagementDesc: '导入或导出您的数据以进行备份。所有数据均安全存储于系统的本地 AppData 目录中',
    importJSON: '导入 JSON',
    exportBackup: '导出备份',
    displayLanguage: '显示语言',
    action: '操作',
    confirm: '确认删除',
    confirmClear: '确认删除？'
  }
};

let currentLang: Language = 'zh';
const listeners = new Set<() => void>();

function detectLanguage(): Language {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('de')) return 'de';
  return 'en';
}

export function setLanguage(lang: Language) {
  currentLang = lang;
  listeners.forEach(fn => fn());
}

export function getLanguage(): Language {
  return currentLang;
}

export function initLanguage(lang?: string) {
  if (lang === 'zh' || lang === 'en' || lang === 'de') {
    setLanguage(lang);
  } else {
    setLanguage(detectLanguage());
  }
}

export function useTranslation() {
  const [_, setTick] = useState(0);
  
  useEffect(() => {
    const trigger = () => setTick(t => t + 1);
    listeners.add(trigger);
    return () => {
      listeners.delete(trigger);
    };
  }, []);

  const t = (key: keyof typeof dictionary['en']) => {
    return dictionary[currentLang][key] || dictionary['en'][key] || key;
  };

  return { t, lang: currentLang, setLanguage };
}
