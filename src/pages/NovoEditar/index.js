import React, { useState, useMemo, useEffect } from 'react';
import { Form, Input } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { parseISO } from 'date-fns';

import api from '~/services/api';
import history from '~/services/history';

import { MdAddCircleOutline } from 'react-icons/md';

import BannerInput from '~/components/BannerInput';
import DatePicker from '~/components/Datepicker';

import { Container, Loading } from './styles';

const schema = Yup.object().shape({
  title: Yup.string().required('O titulo é obrigatório!'),
  description: Yup.string().required('A descrição é obrigatória!'),
  location: Yup.string().required('A localização é obrigatória!'),
  date: Yup.date().required('A data é obrigatória!'),
  banner_id: Yup.number()
    .transform(value => (!value ? undefined : value))
    .required('Imagem do evento é obrigatório!'),
});

export default function NovoEditar({ match }) {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [meetup, setMeetup] = useState(null);

  const id = useMemo(() => match.params.id, [match.params.id]);

  useEffect(() => {
    async function loadMeetup() {
      setLoadingPage(true);

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

      const data = {
        ...meetup,
        date: parseISO(meetup.date),
      };

      setMeetup(data);
      setLoadingPage(false);
    }

    loadMeetup();
  }, [id]);

  async function handleAddSubmit(data) {
    try {
      setLoading(true);

      data = { ...data, file_id: data.banner_id };
      await api.post('meetups', data);

      setLoading(false);

      toast.info('Cadastro realizado com sucesso!.');

      history.push('/dashboard');
    } catch {
      setLoading(false);
      toast.error('Falha no cadastro, verifique os dados informados!');
    }
  }

  async function handleUpdateSubmit(data) {
    try {
      setLoading(true);

      await api.put(`meetups/${id}`, data);

      setLoading(false);

      toast.info('Cadastro atualizado com sucesso!.');

      history.push('/dashboard');
    } catch {
      setLoading(false);
      toast.error('Falha na atualização, verifique os dados informados!');
    }
  }

  if (loadingPage) {
    return <Loading>Aguarde...</Loading>;
  }

  return (
    <Container>
      <Form
        initialData={meetup}
        schema={schema}
        onSubmit={meetup ? handleUpdateSubmit : handleAddSubmit}
      >
        <BannerInput name="banner_id" />
        <Input name="title" placeholder="Titulo do Meetup" />
        <Input name="description" placeholder="Descrição completa" multiline />
        <DatePicker name="date" placeholder="Data do meetup" />
        <Input name="location" placeholder="Localização" />

        <button type="submit">
          {loading ? (
            <span>Aguarde...</span>
          ) : (
            <>
              <MdAddCircleOutline color={'#fff'} size={20} />
              <span>Salvar meetup</span>
            </>
          )}
        </button>
      </Form>
    </Container>
  );
}
