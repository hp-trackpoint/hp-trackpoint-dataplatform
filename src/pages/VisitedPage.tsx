import { TimeSelector } from '../layouts/SelectHeader';
import createHeaderState from '../stores/headerStore';

const useHeaderState = createHeaderState();

export default function VisitedPage() {
  const { timeState, onChangeTime } = useHeaderState();

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
    </div>
  );
}
