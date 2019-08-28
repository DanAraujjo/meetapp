import React, { useMemo } from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import {
  Container,
  Banner,
  Info,
  Title,
  Location,
  Person,
  Date,
  SubscribeButton,
} from './styles';

export default function Meetup({ data, onPress, textButton, background }) {
  const dateFormatted = useMemo(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return format(
      utcToZonedTime(parseISO(data.date), timezone),
      "d 'de' MMMM, 'às ' HH'h'",
      {
        locale: ptBR,
      }
    );
  }, [data.date]);

  return (
    <Container past={data.past}>
      <Banner
        source={{ uri: `http://localhost:3333/files/${data.banner.path}` }}
      />
      <Info>
        <Title>{data.title}</Title>

        <Date>
          <Icon name="event" size={20} color="#999" />
          <Text> {dateFormatted}</Text>
        </Date>

        <Location>
          <Icon name="place" size={20} color="#999" />
          <Text> {data.location}</Text>
        </Location>

        <Person>
          <Icon name="person" size={20} color="#999" />
          <Text> {data.user.name}</Text>
        </Person>
      </Info>

      {!data.past && !data.subscribed && (
        <SubscribeButton onPress={onPress}>
          <Text>{textButton}</Text>
        </SubscribeButton>
      )}
    </Container>
  );
}
