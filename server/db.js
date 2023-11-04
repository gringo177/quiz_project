const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:");

const Question = sequelize.define("Question", {
  text: { type: DataTypes.TEXT },
  tip: { type: DataTypes.TEXT },
  answer: { type: DataTypes.TEXT },
  img: { type: DataTypes.STRING },
  likes: { type: DataTypes.INTEGER },
  dislikes: { type: DataTypes.INTEGER },
});

const Comment = sequelize.define("Comment", {
  text: { type: DataTypes.TEXT },
});

Comment.belongsTo(Question);
Question.hasMany(Comment);

sequelize.sync({ force: true }).then(() => {
  Question.bulkCreate([
    {
      text: "How does the fox?",
      tip: "say",
      answer: "say",
      img: "https://pbs.twimg.com/profile_images/2304496919/image_400x400.jpg",
      likes: 0,
      dislikes: 0,
    },
    {
      text: "How are ___?",
      tip: "you",
      answer: "you",
      img: "https://i1.sndcdn.com/artworks-000066629060-d0q4s6-t500x500.jpg",
      likes: 0,
      dislikes: 0,
    },
  ]);
});

module.exports = {
  Question,
  Comment,
};
