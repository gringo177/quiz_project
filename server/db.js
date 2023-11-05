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
      text: "A tourist in Israel asks to see that famous place where Jews are wailing. He's given directions to the _____",
      tip: "רשות המסים בישראל",
      answer: "רשות המסים בישראל",
      img: "photo_2021-05-13_12-02-04.jpg",
      likes: 5,
      dislikes: 3,
      comments: ["super", "nice","lol"],
    },
    {
      text: "At a restaurant: American to waitress: Miss, would you please tell us what choices of meat you have? Russian: What is this word, 'choice' ?Pole: What is this word, 'meat' ? Israeli: What is this word, ____?",
      tip:"בבקשה",
      answer: "בבקשה",
      img: "photo_2022-05-11_15-00-27.jpg",
      likes: 1,
      dislikes: 0,
      comments: ["wow", "super"],
    },
    {
      text: "Why do all new repatriates have one shoulder higher than the other? Because sabras constantly come up to them, condescendingly pat them on the shoulder and say: ______",
      tip: "לאט לאט סבלנות",
      answer: "לאט לאט סבלנות",
      img: "photo_2023-05-10_16-01-46.jpg",
      likes: 1,
      dislikes: 0,
    },
    {
      text: "There is a dry leaf on the ground. Another fallen leaf smoothly lands next to him. Who are you? - asks the first one.______, the newcomer answers.",
      tip: "אני אולה חדאש",
      answer: "אני אולה חדאש",
      img: "photo_2023-02-24_16-00-27.jpg",
      likes: 1,
      dislikes: 0,
      comments: ["wow", "super"],
    },
    {
      text: "An ole hadash asked: say in one word eich baaretz? He answeres :tov-And in two words?____",
      tip: "לא טוב",
      answer: "לא טוב",
      img: "https://i1.sndcdn.com/artworks-000066629060-d0q4s6-t500x500.jpg",
      likes: 1,
      dislikes: 0,
      comments: ["wow", "super"],
    },
    {
      text: "The first year Ole Hadash scolds Sokhnut, the second year Ole Hadash scolds the government, and the third year Ole Hadash begins to scold the new olim. And it becomes clear that he is already a _____",
      tip: "וותיק",
      answer: "וותיק",
      img: "https://i1.sndcdn.com/artworks-000066629060-d0q4s6-t500x500.jpg",
      likes: 1,
      dislikes: 0,
      comments: ["wow", "super"],
    },
  ]);
});

module.exports = {
  Question,
  Comment,
};
