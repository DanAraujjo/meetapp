import * as Yup from 'yup';
import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const where = {};
    where.canceled_at = null;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      order: ['date'],
      attributes: ['id', 'title', 'description', 'location', 'date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    // validar os dados informados na requisição
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    // verificar se o corpo da requisição é valida
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    // verificar se a data ja passou
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({
        error: 'Não é permitido agendamento para data/hora passada.',
      });
    }

    const meetup = await Meetup.create({
      ...req.body,
      user_id: req.userId,
    });

    return res.status(201).json(meetup);
  }

  async update(req, res) {
    // validar os dados informados na requisição
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      file_id: Yup.number(),
    });

    // verificar se o corpo da requisição é valida
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    // verificar se a nova data ja passou
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({
        error: 'Não é permitido agendamento para data/hora passada.',
      });
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
      return res.status(404).json({ error: 'Evento não localizado!' });
    }

    // verifica se ja passou a data e se é possivel alteração do evento
    if (meetup.past) {
      return res.status(400).json({
        error: 'Ops! Esse evento já ocorreu, não é permitido alteração.',
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
    if (meetup.past) {
      return res.status(400).json({
        error: 'Ops! Esse evento já ocorreu, não é permitido exclusão.',
      });
    }

    meetup.canceled_at = new Date();

    await meetup.save();

    return res.send();
  }
}

export default new MeetupController();
