import styled from 'styled-components/native';

import logo from '../../assets/logo.png';

export const Container = styled.SafeAreaView`
  justify-content: center;
  align-items: center;
  background: #000;
`;

export const Logo = styled.Image.attrs({
  source: logo,
  resizeMode: 'cover',
})`
  width: 24px;
  height: 24px;
  margin: 10px;
`;
