import {
  TimeSelector,
  VisitorSelector,
  DeviceSelector,
  SourceSelector,
} from '../layouts/SelectHeader';
import createHeaderState from '../stores/headerStore';
const useHeaderState = createHeaderState();

export default function DeviceAnalysisPage() {
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
    <div style={{ background: 'white' }}>
      <div
        style={{
          position: 'fixed',
          top: 65, // 关键定位参数
          width: '100%',
          height: 96,
          zIndex: 1,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 0px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TimeSelector
          time={timeState}
          onChangeTime={onChangeTime}
        ></TimeSelector>

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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          padding: '20px',
          marginTop: 103,
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ color: 'rgb(135, 206, 250)', textAlign: 'center' }}>
            新用户
          </h2>
          <div style={{ textAlign: 'center' }}>
            <img src="/src/img/person.png"></img>

            <p>浏览量： 583875</p>
            <p>访客数： 344568</p>
            <p>跳出率： 79.98%</p>
            <p>平均访问时长： 00:01:52</p>
            <p>平均访问页数： 1.43</p>
          </div>
        </div>
        <div>
          <h2 style={{ color: 'rgb(135, 206, 250)', textAlign: 'center' }}>
            老用户
          </h2>
          <div style={{ textAlign: 'center' }}>
            <img src="/src/img/person1.png"></img>
          </div>
        </div>
      </div>
    </div>
  );
}
