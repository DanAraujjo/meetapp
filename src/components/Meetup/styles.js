import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.View`
  background: #fff;
  border-radius: 4px;
  margin-bottom: 15px;
  overflow: hidden;

  opacity: ${props => (props.past ? 0.6 : 1)};
`;

export const Banner = styled.Image`
  width: 100%;
  height: 150px;
`;

export const Info = styled.View`
  margin: 20px;
`;

export const Title = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 6px;
`;

export const Date = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

export const Location = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

export const Person = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SubscribeButton = styled(Button)`
  margin: 10px;
`;
