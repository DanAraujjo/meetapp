import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const DateCalendar = styled.View`
  margin: 10px;
  align-self: center;
  align-items: center;
  flex-direction: row;
`;

export const DateText = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  align-self: center;
`;

export const PrevDayButton = styled.TouchableOpacity`
  padding: 6px;
`;

export const NextDayButton = styled.TouchableOpacity`
  padding: 6px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: 20 },
})`
  margin-top: 0;
`;

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
`;
