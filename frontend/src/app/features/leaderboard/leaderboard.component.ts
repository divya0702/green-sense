import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Data Interface ---
interface LeaderboardEntry {
  rank: number;
  userName: string;
  avatarUrl: string;
  co2Saved: number;
  levelProgress: number; // A number from 0-100
  badges: ('leaf' | 'recycle' | 'bolt' | 'commute')[];
}

// --- Mock Data ---
const MOCK_DATA: {
  week: LeaderboardEntry[];
  month: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
} = {
  week: [
    { rank: 1, userName: 'EcoWarriorJane', avatarUrl: 'https://placehold.co/100x100/green/white?text=JW', co2Saved: 120, levelProgress: 75, badges: ['leaf', 'commute'] },
    { rank: 2, userName: 'RecycleMike', avatarUrl: 'https://placehold.co/100x100/blue/white?text=RM', co2Saved: 95, levelProgress: 40, badges: ['recycle'] },
    { rank: 3, userName: 'SolarSam', avatarUrl: 'https://placehold.co/100x100/yellow/black?text=SS', co2Saved: 88, levelProgress: 20, badges: ['bolt'] },
  ],
  month: [
    { rank: 1, userName: 'EcoWarriorJane', avatarUrl: 'https://placehold.co/100x100/green/white?text=JW', co2Saved: 510, levelProgress: 88, badges: ['leaf', 'commute', 'recycle'] },
    { rank: 2, userName: 'CarbonCrusher', avatarUrl: 'https://placehold.co/100x100/purple/white?text=CC', co2Saved: 450, levelProgress: 50, badges: ['bolt', 'commute'] },
    { rank: 3, userName: 'RecycleMike', avatarUrl: 'https://placehold.co/100x100/blue/white?text=RM', co2Saved: 390, levelProgress: 45, badges: ['recycle'] },
    { rank: 4, userName: 'SolarSam', avatarUrl: 'https://placehold.co/100x100/yellow/black?text=SS', co2Saved: 350, levelProgress: 20, badges: ['bolt'] },
    { rank: 5, userName: 'GreenThumb', avatarUrl: 'https://placehold.co/100x100/orange/white?text=GT', co2Saved: 220, levelProgress: 10, badges: ['leaf'] },
  ],
  allTime: [
    { rank: 1, userName: 'EcoWarriorJane', avatarUrl: 'https://placehold.co/100x100/green/white?text=JW', co2Saved: 8900, levelProgress: 95, badges: ['leaf', 'commute', 'recycle', 'bolt'] },
    { rank: 2, userName: 'CarbonCrusher', avatarUrl: 'https://placehold.co/100x100/purple/white?text=CC', co2Saved: 7200, levelProgress: 80, badges: ['bolt', 'commute', 'recycle'] },
    { rank: 3, userName: 'RecycleMike', avatarUrl: 'https://placehold.co/100x100/blue/white?text=RM', co2Saved: 6100, levelProgress: 50, badges: ['recycle', 'leaf'] },
  ],
};

// --- SVG Icons ---
const SVG_LEAF = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2c-3 0-5.5 2-5.5 5 0 1.2.5 2.3 1.4 3.1L12 21l4.1-10.9c0.9-0.8 1.4-1.9 1.4-3.1 0-3-2.5-5-5.5-5zM12 3c2.5 0 4.5 1.8 4.5 4 0 0.9-.4 1.8-1.1 2.5L12 18.5 8.6 9.5c-0.7-0.7-1.1-1.6-1.1-2.5 0-2.2 2-4 4.5-4z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v15M7.5 7h9" /></svg>`;

const SVG_RECYCLE = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`;

const SVG_BOLT = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`;

const SVG_COMMUTE = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6.75m-9.75 0H3.375c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5m-6.75 0H15m-9.75 0v3m3-3v3m6-3v3m-3-3H8.25m3 0h3m-3 0V12m0 0v.75m0 0h-1.5m1.5 0h1.5m-1.5 0V12m1.5 0h1.5m-1.5 0h-3m3 0v-.75m0 0V12m0 0v.75" /></svg>`;

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent {
  // --- State ---
  activeTab = signal<'week' | 'month' | 'allTime'>('month');
  private data = MOCK_DATA;

  // --- Computed Data ---
  displayedData = computed(() => {
    return this.data[this.activeTab()];
  });

  // --- Badge Icons ---
  svgIcons = {
    leaf: SVG_LEAF,
    recycle: SVG_RECYCLE,
    bolt: SVG_BOLT,
    commute: SVG_COMMUTE
  };

  // --- Methods ---
  selectTab(tab: 'week' | 'month' | 'allTime') {
    this.activeTab.set(tab);
  }

  calculateTrees(co2: number): number {
    return Math.floor(co2 / 50);
  }

  getActiveTabClass(tab: 'week' | 'month' | 'allTime'): string {
    return this.activeTab() === tab ? 'btn btn-primary active-tab' : 'btn btn-outline-primary';
  }
}
