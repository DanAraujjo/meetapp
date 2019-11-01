import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { updateProfileRequest } from '~/store/modules/user/actions';

import { Container } from './styles';
import { MdAddCircleOutline } from 'react-icons/md';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório!'),
  email: Yup.string()
    .email('Insira um e-mail válido!')
    .required('O e-email é obrigatório!'),
});

export default function Perfil() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);
  const loading = useSelector(state => state.user.loading);

  function handleSubmit(data) {
    dispatch(updateProfileRequest(data));
  }

  return (
    <Container>
      <Form initialData={profile} schema={schema} onSubmit={handleSubmit}>
        <Input name="name" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu endereço de e-mail" />

        <hr />

        <Input
          name="oldPassword"
          type="password"
          placeholder="Sua senha atual"
        />

        <Input name="password" type="password" placeholder="Sua nova senha" />

        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirmação da senha"
        />

        <button type="submit">
          {loading ? (
            <span>Aguarde...</span>
          ) : (
            <>
              <MdAddCircleOutline color={'#fff'} size={20} />{' '}
              <span>Salvar perfil</span>
            </>
          )}
        </button>
      </Form>
    </Container>
  );
}
