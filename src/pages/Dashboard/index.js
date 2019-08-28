import React, { useEffect, useState, useMemo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigationFocus } from 'react-navigation';
import { Alert } from 'react-native';

import Header from '~/components/Header';

import { format, subDays, addDays, parseISO, isBefore } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import api from '~/services/api';
import Meetup from '~/components/Meetup';

import {
  Container,
  DateCalendar,
  DateText,
  PrevDayButton,
  NextDayButton,
  List,
  EmptyContainer,
  EmptyText,
} from './styles';

function Dashboard({ isFocused }) {
  const [meetups, setMeetups] = useState([]);

  const [isRefreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: ptBR }),
    [date]
  );

  async function loadMeetups(page = 1) {
    if (loading) return;

    setLoading(true);

    try {
      const response = await api.get('meetups', {
        params: {
          date,
          page,
        },
      });

      let data = [];

      if (response.data.length > 0) {
        const subscriptions = await api.get('subscriptions');

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        data = response.data.map(meetup => {
          const compareDate = utcToZonedTime(parseISO(meetup.date), timezone);

          return {
            ...meetup,
            past: isBefore(compareDate, new Date()),
            subscribed: subscriptions.data.some(
              subscription => subscription.meetup_id === meetup.id
            ),
          };
        });
      }

      data = page >= 2 ? [...meetups, ...data] : data;

      if (response.data.length > 0) {
        setPage(page);
      }

      setMeetups(data);
    } catch {
      Alert.alert(
        'Ops',
        'Não foi possível fazer a conexão com o servidor, tente novamente mais tarde!'
      );
    }

    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    if (!isFocused && !isRefreshing) return;

    loadMeetups();
  }, [isFocused, isRefreshing, date]);

  async function handleSubscribe(id) {
    try {
      const response = await api.post(`meetups/${id}/subscriptions`);

      if (response.status != 200) {
        Alert.alert(
          'Atenção',
          'Não foi possível realizar a sua inscrição, tente novamente mais tarde!'
        );

        return;
      }

      setMeetups(
        meetups.map(meetup =>
          meetup.id === id
            ? {
                ...meetup,
                subscribed: true,
              }
            : meetup
        )
      );

      Alert.alert('Informação', 'Inscrição realizada com sucesso!');
    } catch {
      Alert.alert(
        'Ops',
        'Não foi possível fazer a conexão com o servidor, tente novamente mais tarde!'
      );
    }
  }

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  refreshList = () => {
    setRefreshing(true);
  };

  handleLoadMore = () => {
    if (!loading) {
      const nextPage = page + 1;
      loadMeetups(nextPage);
    }
  };

  renderFooter = () => {
    if (!loading) return null;

    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  };

  return (
    <>
      <Header />
      <Container>
        <DateCalendar>
          <PrevDayButton onPress={() => handlePrevDay()}>
            <Icon name="chevron-left" size={36} color="#fff" />
          </PrevDayButton>

          <DateText>{dateFormatted}</DateText>

          <NextDayButton onPress={() => handleNextDay()}>
            <Icon name="keyboard-arrow-right" size={36} color="#fff" />
          </NextDayButton>
        </DateCalendar>
        {meetups.length > 0 ? (
          <List
            data={meetups}
            onRefresh={this.refreshList}
            refreshing={isRefreshing}
            onEndReached={this.handleLoadMore} //erro: chama função varias vezes
            onEndReachedThreshold={0.05}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Meetup
                data={item}
                textButton={'Realizar inscrição'}
                onPress={() => handleSubscribe(item.id)}
              />
            )}
            //ListFooterComponent={this.renderFooter} //erro: quando ativo, entra em loop
          />
        ) : (
          <EmptyContainer>
            <Icon name="event-available" size={64} color="#999" />
            <EmptyText>Nenhum evento nesse dia.</EmptyText>
          </EmptyContainer>
        )}
      </Container>
    </>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: 'Meetups',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="format-list-bulleted" size={20} color={tintColor} />
  ),
};

export default withNavigationFocus(Dashboard);
