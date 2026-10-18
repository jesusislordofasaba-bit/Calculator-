import { ThemeId } from '../types/calculator';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  calcBodyClass: string;
  displayBgClass: string;
  displayBorderClass: string;
  displayTextClass: string;
  displaySubTextClass: string;
  numBtnClass: string;
  opBtnClass: string;
  actionBtnClass: string;
  equalsBtnClass: string;
  navClass: string;
  navActive: string;
  navInactive: string;
  accentColor: string;
  isLcd?: boolean;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  oled: {
    id: 'oled',
    name: 'OLED Obsidian',
    bgClass: 'bg-[#090a0f] text-neutral-100',
    calcBodyClass: 'bg-[#12141c] border border-neutral-800/80 shadow-2xl shadow-black/80',
    displayBgClass: 'bg-[#0b0d14]/90',
    displayBorderClass: 'border-neutral-800/70',
    displayTextClass: 'text-neutral-100',
    displaySubTextClass: 'text-neutral-400',
    numBtnClass: 'bg-[#1b1e2a] hover:bg-[#232737] text-neutral-100 border border-neutral-800/60 active:scale-[0.97]',
    opBtnClass: 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 active:scale-[0.97]',
    actionBtnClass: 'bg-[#222533] hover:bg-[#2c3042] text-neutral-300 border border-neutral-700/50 active:scale-[0.97]',
    equalsBtnClass: 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold shadow-md shadow-amber-500/20 active:scale-[0.97]',
    navClass: 'bg-[#12141c] border-neutral-800',
    navActive: 'bg-[#222533] text-amber-400 shadow-sm',
    navInactive: 'text-neutral-400 hover:text-neutral-200',
    accentColor: '#f59e0b',
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Paper',
    bgClass: 'bg-[#f4f5f8] text-slate-800',
    calcBodyClass: 'bg-white border border-slate-200 shadow-xl shadow-slate-300/50',
    displayBgClass: 'bg-slate-50',
    displayBorderClass: 'border-slate-200',
    displayTextClass: 'text-slate-900',
    displaySubTextClass: 'text-slate-500',
    numBtnClass: 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-900 border border-slate-200/80 active:scale-[0.97]',
    opBtnClass: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 active:scale-[0.97]',
    actionBtnClass: 'bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 border border-slate-300 active:scale-[0.97]',
    equalsBtnClass: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 active:scale-[0.97]',
    navClass: 'bg-white border-slate-200',
    navActive: 'bg-slate-900 text-white shadow-sm',
    navInactive: 'text-slate-600 hover:text-slate-900',
    accentColor: '#2563eb',
  },
  retro: {
    id: 'retro',
    name: 'Retro Solar LCD',
    bgClass: 'bg-[#232524] text-neutral-200',
    calcBodyClass: 'bg-[#2b2e2d] border border-neutral-700/70 shadow-2xl shadow-black/60',
    displayBgClass: 'bg-[#b8c2ab]',
    displayBorderClass: 'border-[#8f9b7f] shadow-inner',
    displayTextClass: 'text-[#1a2016]',
    displaySubTextClass: 'text-[#3e4a36]',
    numBtnClass: 'bg-[#383d3b] hover:bg-[#424846] text-neutral-100 border-t border-neutral-600 border-b-2 border-neutral-900 active:scale-[0.97]',
    opBtnClass: 'bg-[#434b48] hover:bg-[#4d5653] text-[#d6ded1] border-t border-neutral-600 border-b-2 border-neutral-900 active:scale-[0.97]',
    actionBtnClass: 'bg-[#505a56] hover:bg-[#5b6662] text-neutral-100 border-t border-neutral-500 border-b-2 border-neutral-900 active:scale-[0.97]',
    equalsBtnClass: 'bg-[#c85a17] hover:bg-[#d86622] text-white font-bold border-t border-orange-400 border-b-2 border-[#823307] active:scale-[0.97]',
    navClass: 'bg-[#2b2e2d] border-neutral-700',
    navActive: 'bg-[#b8c2ab] text-[#1a2016] font-semibold shadow-sm',
    navInactive: 'text-neutral-400 hover:text-neutral-200',
    accentColor: '#c85a17',
    isLcd: true,
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Terminal',
    bgClass: 'bg-[#0d0914] text-neutral-200',
    calcBodyClass: 'bg-[#150f22] border border-fuchsia-900/60 shadow-2xl shadow-fuchsia-950/40',
    displayBgClass: 'bg-[#0a0512] border-cyan-800/60',
    displayBorderClass: 'border-cyan-500/40',
    displayTextClass: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]',
    displaySubTextClass: 'text-fuchsia-400/80',
    numBtnClass: 'bg-[#1d162f] hover:bg-[#281f40] text-cyan-200 border border-cyan-900/40 active:scale-[0.97]',
    opBtnClass: 'bg-[#2f1938] hover:bg-[#3d2049] text-fuchsia-300 border border-fuchsia-800/50 active:scale-[0.97]',
    actionBtnClass: 'bg-[#221833] hover:bg-[#2d2044] text-amber-300 border border-amber-900/40 active:scale-[0.97]',
    equalsBtnClass: 'bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white font-bold active:scale-[0.97]',
    navClass: 'bg-[#150f22] border-fuchsia-900/50',
    navActive: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50',
    navInactive: 'text-neutral-400 hover:text-neutral-200',
    accentColor: '#06b6d4',
  },
  minimal: {
    id: 'minimal',
    name: 'Monochrome Minimal',
    bgClass: 'bg-[#18181b] text-neutral-200',
    calcBodyClass: 'bg-[#27272a] border border-neutral-700/50 shadow-2xl',
    displayBgClass: 'bg-[#18181b]',
    displayBorderClass: 'border-neutral-700',
    displayTextClass: 'text-white',
    displaySubTextClass: 'text-neutral-400',
    numBtnClass: 'bg-[#3f3f46]/70 hover:bg-[#3f3f46] text-white border border-neutral-600/40 active:scale-[0.97]',
    opBtnClass: 'bg-[#52525b]/80 hover:bg-[#52525b] text-white border border-neutral-500/40 active:scale-[0.97]',
    actionBtnClass: 'bg-[#3f3f46] hover:bg-[#52525b] text-neutral-300 border border-neutral-600 active:scale-[0.97]',
    equalsBtnClass: 'bg-white hover:bg-neutral-200 text-black font-bold active:scale-[0.97]',
    navClass: 'bg-[#27272a] border-neutral-700',
    navActive: 'bg-white text-black font-semibold shadow-sm',
    navInactive: 'text-neutral-400 hover:text-white',
    accentColor: '#ffffff',
  },
};
