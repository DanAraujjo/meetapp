import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    // busca o evento
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.meetupId,
        canceled_at: null,
      },
    });

    if (!meetup) {
      return res.status(404).json({ error: 'Evento não localizado!' });
    }

    // verificar se usuario atual é o organizador
    if (meetup.user_id === req.userId) {
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
        user_id: req.userId,
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

    return res.json(subscription);
  }
}

export default new SubscriptionController();
