import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
// import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetup = await Meetup.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
        /* date: {
          [Op.gte]: new Date(),
        }, */
      },
      order: ['date'],
      attributes: ['id', 'title', 'description', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'file',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetup);
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

    return res.status(201).json(meetup);
  }

  async update(req, res) {
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

    // localizar evento
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
        canceled_at: null,
        /* date: {
          [Op.gte]: new Date(),
        }, */
      },
    });

    if (!meetup) {
      return res.status(404).json({ message: 'Evento não localizado!' });
    }

    // verifica se ja passou a data e se é possivel alteração do evento
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: 'Ops! Esse evento já ocorreu, não é permitido alteração.',
      });
    }

    // verificar se a nova data ja passou
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({
        error: 'Não é permitido agendamento para data/hora passada.',
      });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
        canceled_at: null,
      },
    });

    if (!meetup) {
      return res.status(404).json({ message: 'Evento não localizado!' });
    }

    // verifica se ja passou a data e se é possivel exclusão do evento
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: 'Ops! Esse evento já ocorreu, não é permitido exclusão.',
      });
    }

    meetup.canceled_at = new Date();

    await meetup.save();

    return res.json(meetup);
  }
}

export default new MeetupController();
