import { create } from 'zustand';
import type { RadioChangeEvent } from 'antd/es/radio';
import { useRef } from 'react';
// 定义状态接口
interface headerState {
  timeState: string;
  visitorState: string;
  deviceState: string;
  sourceState: string;
  // 时间状态更新函数类型
  timeToday: () => void;
  timeYesterday: () => void;
  timeSeven: () => void;
  timeThirty: () => void;
  // 访客状态更新函数类型
  visitorAll: () => void;
  visitorNew: () => void;
  visitorOld: () => void;
  // 设备状态更新函数类型
  deviceAll: () => void;
  deviceComputer: () => void;
  deviceMobile: () => void;
  // 来源状态更新函数类型
  sourceAll: () => void;
  sourceGoogle: () => void;
  sourceBaidu: () => void;
  sourceYahoo: () => void;
  sourceExternalLink: () => void;
  sourceDirectAccess: () => void;
  // 封装的 onChange 函数
  onChangeTime: (e: RadioChangeEvent) => void;
  onChangeVisitor: (e: RadioChangeEvent) => void;
  onChangeDevice: (e: RadioChangeEvent) => void;
  onChangeSource: (e: string) => void;
}

// 创建状态存储的工厂函数
const createHeaderStore = () =>
  create<headerState>((set, get) => {
    // 时间状态更新函数
    const timeToday = () => set((state) => ({ ...state, timeState: 'today' }));
    const timeYesterday = () =>
      set((state) => ({ ...state, timeState: 'yesterday' }));
    const timeSeven = () => set((state) => ({ ...state, timeState: 'seven' }));
    const timeThirty = () =>
      set((state) => ({ ...state, timeState: 'thirty' }));

    // 访客状态更新函数
    const visitorAll = () =>
      set((state) => ({ ...state, visitorState: 'all' }));
    const visitorNew = () =>
      set((state) => ({ ...state, visitorState: 'new' }));
    const visitorOld = () =>
      set((state) => ({ ...state, visitorState: 'old' }));

    // 设备状态更新函数
    const deviceAll = () => set((state) => ({ ...state, deviceState: 'all' }));
    const deviceComputer = () =>
      set((state) => ({ ...state, deviceState: 'computer' }));
    const deviceMobile = () =>
      set((state) => ({ ...state, deviceState: 'mobile' }));

    // 来源状态更新函数
    const sourceAll = () => set((state) => ({ ...state, sourceState: 'all' }));
    const sourceGoogle = () =>
      set((state) => ({ ...state, sourceState: 'google' }));
    const sourceBaidu = () =>
      set((state) => ({ ...state, sourceState: 'baidu' }));
    const sourceYahoo = () =>
      set((state) => ({ ...state, sourceState: 'yahoo' }));
    const sourceExternalLink = () =>
      set((state) => ({ ...state, sourceState: 'external_link' }));
    const sourceDirectAccess = () =>
      set((state) => ({ ...state, sourceState: 'direct_access' }));

    // 时间单选框 onChange 函数
    const onChangeTime = (e: RadioChangeEvent) => {
      if (e.target.value === 'today') {
        timeToday();
      }
      if (e.target.value === 'yesterday') {
        timeYesterday();
      }
      if (e.target.value === 'seven') {
        timeSeven();
      }
      if (e.target.value === 'thirty') {
        timeThirty();
      }
    };

    // 访客单选框 onChange 函数
    const onChangeVisitor = (e: RadioChangeEvent) => {
      if (e.target.value === 'all') {
        visitorAll();
      }
      if (e.target.value === 'new') {
        visitorNew();
      }
      if (e.target.value === 'old') {
        visitorOld();
      }
    };

    // 设备单选框 onChange 函数
    const onChangeDevice = (e: RadioChangeEvent) => {
      if (e.target.value === 'all') {
        deviceAll();
      }
      if (e.target.value === 'computer') {
        deviceComputer();
      }
      if (e.target.value === 'mobile') {
        deviceMobile();
      }
    };

    // 来源单选框 onChange 函数
    const onChangeSource = (e: string) => {
      const currentSourceState = get().sourceState;
      if (e !== currentSourceState) {
        if (e === 'all') {
          sourceAll();
        }
        if (e === 'google') {
          sourceGoogle();
        }
        if (e === 'baidu') {
          sourceBaidu();
        }
        if (e === 'yahoo') {
          sourceYahoo();
        }
        if (e === 'external_link') {
          sourceExternalLink();
        }
        if (e === 'direct_access') {
          sourceDirectAccess();
        }
      }
    };

    return {
      timeState: 'today',
      visitorState: 'all',
      deviceState: 'all',
      sourceState: 'all',
      timeToday,
      timeYesterday,
      timeSeven,
      timeThirty,
      visitorAll,
      visitorNew,
      visitorOld,
      deviceAll,
      deviceComputer,
      deviceMobile,
      sourceAll,
      sourceGoogle,
      sourceBaidu,
      sourceYahoo,
      sourceExternalLink,
      sourceDirectAccess,
      onChangeTime,
      onChangeVisitor,
      onChangeDevice,
      onChangeSource,
    };
  });

// 自定义 Hook 封装状态实例和 onChange 函数
const useHeaderState = () => {
  // 使用 useRef 绑定 Store 到组件实例
  const storeRef = useRef<ReturnType<typeof createHeaderStore>>();

  // 确保只创建一次 Store
  if (!storeRef.current) {
    storeRef.current = createHeaderStore();
  }

  // 从当前实例的 Store 中选择状态
  const { timeState, visitorState, deviceState, sourceState } =
    storeRef.current((state) => ({
      timeState: state.timeState,
      visitorState: state.visitorState,
      deviceState: state.deviceState,
      sourceState: state.sourceState,
    }));

  // 获取更新函数
  const { onChangeTime, onChangeVisitor, onChangeDevice, onChangeSource } =
    storeRef.current.getState();

  return {
    timeState,
    visitorState,
    deviceState,
    sourceState,
    onChangeTime,
    onChangeVisitor,
    onChangeDevice,
    onChangeSource,
  };
};

export default useHeaderState;
