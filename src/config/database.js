module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'db_meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
