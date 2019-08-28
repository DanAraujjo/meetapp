import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 20 },
})``;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 20px;
`;

export const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 18px;
  color: #999;
  text-align: center;
`;
