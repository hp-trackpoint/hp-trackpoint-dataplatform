import { create } from 'zustand';

// 定义状态接口
interface trendState {
  timeState: string;
  visitorState: string;
}

// 创建状态存储，按照规范将名称改为 useTrendStore
const useTrendStore = create<trendState>(() => ({
  timeState: 'today',
  visitorState: 'all',
}));

// 定义更新 timeState 为 'today' 的函数
export const timeToday = () => {
  useTrendStore.setState((state) => ({ ...state, timeState: 'today' }));
};
export const timeYesterday = () => {
  useTrendStore.setState((state) => ({ ...state, timeState: 'yesterday' }));
};
export const timeSeven = () => {
  useTrendStore.setState((state) => ({ ...state, timeState: 'seven' }));
};
export const timeThirty = () => {
  useTrendStore.setState((state) => ({ ...state, timeState: 'thirty' }));
};
export const visitorAll = () => {
  useTrendStore.setState((state) => ({ ...state, visitorState: 'all' }));
};
export const visitorNew = () => {
  useTrendStore.setState((state) => ({ ...state, visitorState: 'new' }));
};
export const visitorOld = () => {
  useTrendStore.setState((state) => ({ ...state, visitorState: 'old' }));
};
export default useTrendStore;
