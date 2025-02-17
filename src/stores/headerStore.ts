import { create } from 'zustand';
import { RadioChangeEvent } from 'antd';

// Define the type for the state
interface HeaderState {
  timeState: string;
  visitorState: string;
  deviceState: string;
  sourceState: string;
  // Time state update functions
  timeToday: () => void;
  timeYesterday: () => void;
  timeSeven: () => void;
  timeThirty: () => void;
  // Visitor state update functions
  visitorAll: () => void;
  visitorNew: () => void;
  visitorOld: () => void;
  // Device state update functions
  deviceAll: () => void;
  deviceComputer: () => void;
  deviceMobile: () => void;
  // Source state update functions
  sourceAll: () => void;
  sourceGoogle: () => void;
  sourceBaidu: () => void;
  sourceYahoo: () => void;
  sourceExternalLink: () => void;
  sourceDirectAccess: () => void;
  // Encapsulated onChange functions
  onChangeTime: (e: RadioChangeEvent) => void;
  onChangeVisitor: (e: RadioChangeEvent) => void;
  onChangeDevice: (e: RadioChangeEvent) => void;
  onChangeSource: (e: string) => void;
}

// Factory function to create a new store
const createHeaderState = () =>
  create<HeaderState>((set, get) => ({
    timeState: 'today',
    visitorState: 'all',
    deviceState: 'all',
    sourceState: 'all',
    // Time state update functions
    timeToday: () => set((state) => ({ ...state, timeState: 'today' })),
    timeYesterday: () => set((state) => ({ ...state, timeState: 'yesterday' })),
    timeSeven: () => set((state) => ({ ...state, timeState: 'seven' })),
    timeThirty: () => set((state) => ({ ...state, timeState: 'thirty' })),
    // Visitor state update functions
    visitorAll: () => set((state) => ({ ...state, visitorState: 'all' })),
    visitorNew: () => set((state) => ({ ...state, visitorState: 'new' })),
    visitorOld: () => set((state) => ({ ...state, visitorState: 'old' })),
    // Device state update functions
    deviceAll: () => set((state) => ({ ...state, deviceState: 'all' })),
    deviceComputer: () =>
      set((state) => ({ ...state, deviceState: 'computer' })),
    deviceMobile: () => set((state) => ({ ...state, deviceState: 'mobile' })),
    // Source state update functions
    sourceAll: () => set((state) => ({ ...state, sourceState: 'all' })),
    sourceGoogle: () => set((state) => ({ ...state, sourceState: 'google' })),
    sourceBaidu: () => set((state) => ({ ...state, sourceState: 'baidu' })),
    sourceYahoo: () => set((state) => ({ ...state, sourceState: 'yahoo' })),
    sourceExternalLink: () =>
      set((state) => ({ ...state, sourceState: 'externalLink' })),
    sourceDirectAccess: () =>
      set((state) => ({ ...state, sourceState: 'directAccess' })),
    // Encapsulated onChange functions
    onChangeTime: (e: RadioChangeEvent) => {
      const { timeToday, timeYesterday, timeSeven, timeThirty } = get();
      switch (e.target.value) {
        case 'today':
          timeToday();
          break;
        case 'yesterday':
          timeYesterday();
          break;
        case 'seven':
          timeSeven();
          break;
        case 'thirty':
          timeThirty();
          break;
      }
    },
    onChangeVisitor: (e: RadioChangeEvent) => {
      const { visitorAll, visitorNew, visitorOld } = get();
      switch (e.target.value) {
        case 'all':
          visitorAll();
          break;
        case 'new':
          visitorNew();
          break;
        case 'old':
          visitorOld();
          break;
      }
    },
    onChangeDevice: (e: RadioChangeEvent) => {
      const { deviceAll, deviceComputer, deviceMobile } = get();
      switch (e.target.value) {
        case 'all':
          deviceAll();
          break;
        case 'computer':
          deviceComputer();
          break;
        case 'mobile':
          deviceMobile();
          break;
      }
    },
    onChangeSource: (e: string) => {
      const {
        sourceAll,
        sourceGoogle,
        sourceBaidu,
        sourceYahoo,
        sourceExternalLink,
        sourceDirectAccess,
      } = get();
      const currentSourceState = get().sourceState;
      if (e !== currentSourceState) {
        switch (e) {
          case 'all':
            sourceAll();
            break;
          case 'google':
            sourceGoogle();
            break;
          case 'baidu':
            sourceBaidu();
            break;
          case 'yahoo':
            sourceYahoo();
            break;
          case 'external_link':
            sourceExternalLink();
            break;
          case 'direct_access':
            sourceDirectAccess();
            break;
        }
      }
    },
  }));

export default createHeaderState;
