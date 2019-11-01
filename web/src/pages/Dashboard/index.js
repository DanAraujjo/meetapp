import React, { useEffect, useState } from 'react';

import { format, parseISO, isBefore } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import { MdAddCircleOutline, MdChevronRight } from 'react-icons/md';

import api from '~/services/api';
import history from '~/services/history';
import { Container, Meetup } from './styles';

export default function Dashboard() {
  const [organizing, setOrganizing] = useState([]);

  useEffect(() => {
    async function loadOrganizing() {
      const response = await api.get('organizing');

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const data = response.data.map(meetup => {
        const compareDate = utcToZonedTime(parseISO(meetup.date), timezone);
        const dateFormatted = format(
          utcToZonedTime(parseISO(meetup.date), timezone),
          "d 'de' MMMM, 'às ' HH'h'",
          {
            locale: ptBR,
          }
        );

        return {
          ...meetup,
          dateFormatted,
          past: isBefore(compareDate, new Date()),
        };
      });

      setOrganizing(data);
    }

    loadOrganizing();
  }, []);

  return (
    <Container>
      <header>
        <strong>Meus meetups</strong>
        <button type="button" onClick={() => history.push('/novo-editar')}>
          <MdAddCircleOutline size={18} color="#fff" /> <span>Novo meetup</span>
        </button>
      </header>

      <ul>
        {organizing.map(meetup => (
          <Meetup key={meetup.id} past={meetup.past}>
            <strong>{meetup.title}</strong>
            <span>
              {meetup.dateFormatted}
              <button
                type="button"
                onClick={() => history.push(`/detalhes/${meetup.id}`)}
              >
                <MdChevronRight size={20} />
              </button>
            </span>
          </Meetup>
        ))}
      </ul>
    </Container>
  );
}
