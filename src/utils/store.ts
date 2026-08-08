import { readTextFile, writeTextFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { appLocalDataDir, join } from '@tauri-apps/api/path';
import { AccountData } from './calculator';

export interface AppData {
  settings: {
    default_page: string;
    language?: 'zh' | 'en' | 'de';
  };
  accounts: AccountData[];
}

const DEFAULT_DATA: AppData = {
  settings: {
    default_page: "dashboard"
  },
  accounts: []
};

export async function loadData(): Promise<AppData> {
  try {
    const dataDir = await appLocalDataDir();
    const filePath = await join(dataDir, 'tagesgeld_data.json');
    
    if (await exists(filePath)) {
      const content = await readTextFile(filePath);
      return JSON.parse(content) as AppData;
    }
  } catch (error) {
    console.error("Failed to load data:", error);
  }
  return DEFAULT_DATA;
}

export async function saveData(data: AppData): Promise<void> {
  try {
    const dataDir = await appLocalDataDir();
    if (!(await exists(dataDir))) {
      await mkdir(dataDir, { recursive: true });
    }
    const filePath = await join(dataDir, 'tagesgeld_data.json');
    await writeTextFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to save data:", error);
    throw error;
  }
}
