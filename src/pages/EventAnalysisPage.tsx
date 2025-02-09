import React from 'react';
import { TimeSelector } from '../layouts/SelectHeader';

export default function EventAnalysisPage() {
  return <TimeSelector onChangeTime={() => {}} time="today"></TimeSelector>;
}
