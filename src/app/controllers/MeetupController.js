import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    // validar os dados informados na requisição
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    // verificar se o corpo da requisição é valida
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validação falhou!' });
    }

    // verificar se a data ja passou
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({
        error: 'Não é permitido agendamento para data/hora passada.',
      });
    }

    // cria o meetup
    const { title, description, location, date, banner_id } = req.body;

    const meetup = await Meetup.create({
      user_id: req.userId,
      title,
      description,
      location,
      date,
      banner_id,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
