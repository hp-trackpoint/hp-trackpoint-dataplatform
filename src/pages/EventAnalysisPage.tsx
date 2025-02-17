import React from 'react';
import {
  TimeSelector,
  VisitorSelector,
  DeviceSelector,
  SourceSelector,
} from '../layouts/SelectHeader';
import createHeaderState from '../stores/headerStore';

const useHeaderState = createHeaderState();

export default function EventAnalysisPage() {
  const {
    timeState,
    visitorState,
    deviceState,
    sourceState,
    onChangeTime,
    onChangeVisitor,
    onChangeDevice,
    onChangeSource,
  } = useHeaderState();

  return (
    <div
      style={{
        position: 'fixed',
        top: 65, // 关键定位参数
        width: '100%',
        height: 93,
        zIndex: 1,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 0px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <TimeSelector time={timeState} onChangeTime={onChangeTime}></TimeSelector>

      <VisitorSelector
        visitor={visitorState}
        onChangeVisitor={onChangeVisitor}
      ></VisitorSelector>
      <div style={{ width: '100%' }} />
      <DeviceSelector
        device={deviceState}
        onChangeDevice={onChangeDevice}
      ></DeviceSelector>
      <SourceSelector
        source={sourceState}
        onChangeSource={onChangeSource}
      ></SourceSelector>
    </div>
  );
}
