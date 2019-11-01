import React, { useState, useMemo, useEffect } from 'react';

import { toast } from 'react-toastify';

import { format, parseISO, isBefore } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import api from '~/services/api';
import history from '~/services/history';

import { MdEdit, MdDelete, MdLocationOn, MdEvent } from 'react-icons/md';

import { Container, Button, Loading } from './styles';

export default function Detalhes({ match }) {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [meetup, setMeetup] = useState(null);

  const id = useMemo(() => match.params.id, [match.params.id]);

  useEffect(() => {
    async function loadMeetup() {
      setLoadingPage(true);
      try {
        if (!id) {
          setMeetup(null);
          setLoadingPage(false);
          return;
        }

        const response = await api.get('meetups');

        const meetup = response.data.find(meetup => meetup.id === parseInt(id));

        if (!meetup) {
          toast.warn('Meetup não encontrado.');
          history.push('/dashboard');
          return;
        }

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const compareDate = utcToZonedTime(parseISO(meetup.date), timezone);

        const dateFormatted = format(
          utcToZonedTime(parseISO(meetup.date), timezone),
          "d 'de' MMMM, 'às ' HH'h'",
          {
            locale: ptBR,
          }
        );

        const data = {
          ...meetup,
          dateFormatted,
          past: isBefore(compareDate, new Date()),
        };

        setMeetup(data);
        setLoadingPage(false);
      } catch (err) {
        setLoadingPage(false);
        toast.error('Ops! Ocorreu um problema na hora de carregar os dados!');
        history.push('/dashboard');
      }
    }

    loadMeetup();
  }, [id]);

  async function handleDelete(id) {
    try {
      setLoading(true);

      await api.delete(`meetups/${id}`);

      setLoading(false);

      toast.info('Evento excluído com sucesso!.');

      history.push('/dashboard');
    } catch {
      setLoading(false);
      toast.error('Falha na exclusão, verifique os dados informados!');
    }
  }

  if (loadingPage) {
    return <Loading>Aguarde...</Loading>;
  }

  return (
    <Container>
      <header>
        <strong>{meetup.title}</strong>
        {!meetup.past && (
          <ul>
            <li>
              <Button
                blue
                type="button"
                onClick={() => history.push(`/novo-editar/${meetup.id}`)}
              >
                <MdEdit size={18} color="#fff" /> <span>Editar</span>
              </Button>
            </li>
            <li>
              <Button type="button" onClick={() => handleDelete(meetup.id)}>
                {loading ? (
                  <span>Aguarde...</span>
                ) : (
                  <>
                    <MdDelete size={18} color="#fff" /> <span>Cancelar</span>
                  </>
                )}
              </Button>
            </li>
          </ul>
        )}
      </header>

      <aside>
        <span>
          <img src={meetup.banner.url} alt="" />
        </span>

        {meetup.description}
      </aside>

      <footer>
        <ul>
          <li>
            <MdEvent size={16} />
            <span> {meetup.dateFormatted}</span>
          </li>
          <li>
            <MdLocationOn size={16} />
            <span>{meetup.location}</span>
          </li>
        </ul>
      </footer>
    </Container>
  );
}
