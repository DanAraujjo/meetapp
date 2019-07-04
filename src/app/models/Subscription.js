import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        meetup_id: Sequelize.NUMBER,
        user_id: Sequelize.NUMBER,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
  }
}

export default Subscription;
