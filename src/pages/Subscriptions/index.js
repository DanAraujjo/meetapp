import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigationFocus } from 'react-navigation';
import { Alert } from 'react-native';

import Header from '~/components/Header';

import { parseISO, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import api from '~/services/api';
import Meetup from '~/components/Meetup';

import { Container, List, EmptyContainer, EmptyText } from './styles';

function Subscriptions({ isFocused }) {
  const [subscriptions, setSubscriptions] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isFocused && !refreshing) return;

    async function loadSubscriptions() {
      if (loading) return;

      setLoading(true);
      try {
        const response = await api.get('subscriptions');

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const data = response.data.map(subscription => {
          const compareDate = utcToZonedTime(
            parseISO(subscription.Meetup.date),
            timezone
          );

          return {
            ...subscription,
            subscribed: true,
            past: isBefore(compareDate, new Date()),
          };
        });

        setSubscriptions(data);
      } catch {
        Alert.alert(
          'Ops',
          'Não foi possível fazer a conexão com o servidor, tente novamente mais tarde!'
        );
      }

      setLoading(false);
      setRefreshing(false);
    }

    loadSubscriptions();
  }, [isFocused, refreshing, subscriptions]);

  async function handleCancelSubscribe(id) {
    try {
      const response = await api.delete(`meetups/${id}/subscriptions`);

      if (response.status != 200) {
        Alert.alert(
          'Atenção',
          'Não foi possível cancelar a sua inscrição, tente novamente mais tarde!'
        );

        return;
      }

      setSubscriptions(
        subscriptions.map(subscription =>
          subscription.Meetup.id === id
            ? {
                ...subscription,
                subscribed: false,
              }
            : subscription
        )
      );

      Alert.alert('Informação', 'Cancelamento realizada com sucesso!');
    } catch {
      Alert.alert(
        'Ops',
        'Não foi possível fazer a conexão com o servidor, tente novamente mais tarde!'
      );
    }
  }

  refreshList = () => {
    setRefreshing(true);
  };

  return (
    <>
      <Header />
      <Container>
        {subscriptions.length > 0 ? (
          <List
            data={subscriptions}
            keyExtractor={item => String(item.Meetup.id)}
            renderItem={({ item }) =>
              item.subscribed && (
                <Meetup
                  data={item.Meetup}
                  textButton={'Cancelar inscrição'}
                  onPress={() => handleCancelSubscribe(item.Meetup.id)}
                />
              )
            }
            onRefresh={this.refreshList}
            refreshing={refreshing}
          />
        ) : (
          <EmptyContainer>
            <Icon name="event-available" size={64} color="#999" />
            <EmptyText>Você não está inscrito em nenhum evento.</EmptyText>
          </EmptyContainer>
        )}
      </Container>
    </>
  );
}

Subscriptions.navigationOptions = {
  tabBarLabel: 'Inscrições',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="local-offer" size={20} color={tintColor} />
  ),
};

export default withNavigationFocus(Subscriptions);
