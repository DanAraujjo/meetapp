import React from 'react';
import { useSelector } from 'react-redux';

import Background from '~/components/Background';

import createRouter from './routes';

export default function App() {
  const signed = useSelector(state => state.auth.signed);

  const Routes = createRouter(signed);

  return (
    <Background>
      <Routes />
    </Background>
  );
}
