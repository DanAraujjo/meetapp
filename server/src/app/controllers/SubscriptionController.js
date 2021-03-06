import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      include: [
        {
          model: Meetup,
          attributes: ['id', 'title', 'description', 'location', 'date'],
          where: {
            date: {
              [Op.gte]: new Date(),
            },
          },
          required: true,
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
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    // busca o usuario atual
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email'],
    });

    // busca o evento
    const meetup = await Meetup.findOne({
      attributes: ['id', 'title', 'location', 'date', 'user_id'],
      where: {
        id: req.params.meetupId,
        canceled_at: null,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!meetup) {
      return res.status(404).json({ error: 'Evento não localizado!' });
    }

    // verificar se usuario atual é o organizador
    if (meetup.user_id === user.id) {
      return res
        .status(400)
        .json({ error: 'Você não pode ser inscrever no seu próprio evento!' });
    }

    // verifica se o evento ja passou
    if (meetup.past) {
      return res.status(400).json({
        error: 'Ops! Esse evento já ocorreu!',
      });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
        canceled_at: null,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res.status(400).json({
        error: 'Você já está inscrito em outro evento nesse mesmo horário!',
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    // envio de email
    await Queue.add(SubscriptionMail.key, { meetup, user });

    return res.json(subscription);
  }

  async delete(req, res) {
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.meetupId,
        canceled_at: null,
      },
    });

    if (!meetup) {
      return res.status(404).json({ message: 'Evento não localizado!' });
    }

    if (meetup.past) {
      return res.status(400).json({
        error: 'Ops! Esse evento já ocorreu, não é permitido exclusão.',
      });
    }

    const subscriptions = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: req.params.meetupId,
        canceled_at: null,
      },
    });

    if (!subscriptions) {
      return res.status(404).json({ error: 'Inscrição não localizada!' });
    }

    subscriptions.canceled_at = new Date();

    await subscriptions.save();

    return res.send();
  }
}

export default new SubscriptionController();
