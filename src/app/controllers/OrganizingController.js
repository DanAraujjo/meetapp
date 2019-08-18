import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizingController {
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
      attributes: ['id', 'title', 'description', 'location', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetup);
  }
}

export default new OrganizingController();
