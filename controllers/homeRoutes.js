const { response } = require('express');
const { User, Question, Answer, Result, Character } = require('../models');
//const withAuth = require('../utils/auth');
//const questData = require('../seeds/questionsData.json');
const { init } = require('../models/User');
const router = require('express').Router();


router.get('/', (req, res) => {
  //Serves the body of the page aka "main.handlebars" 
  res.render('blank', { loggedIn: req.session.logged_in});
  });

// This route works! yay. 
// I had to remove the withAuth for insomnia and put in async await. 
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
        include: [Answer]
    });
    const rawQuestion = JSON.parse(JSON.stringify(question));
    res.render('questions', {
      ...rawQuestion,
      loggedIn: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// write an if statement using event.submitter to capture the user and value of the form
// and saves it to local storage as a string
// TODO fix router post 'questions/1' route
router.post('/questions/:id', (req, res) => {
  const user = req.submitter.user
  const value = req.submitter.value
  const question = req.submitter.question.id
  console.log(response.id);

  // if the user is logged in, save the answer to local storage as a string in an array
  if (user) {
    console.log(value);
    console.log(user); 
    if (err) {
      console.log(err);
      res.sendStatus(500)
    } else {
      // save the user's selected value related answer to local storage     
      localStorage.setItem(user, value.join(','))
      res.sendStatus(200)
      // if the user has not finished the quiz automatically call the next question by changing question/id
      if (question.id < 6) {
        const page = question.id + 1
        res.redirect(`/questions/${page}`)
      } else {
        // use reduce to calculate the result from the string in local storage
        const winner = localStorage.getItem(value).reduce((a, v) => {(a[v] ? a[v] += 1 : 1, 0); return a;}, {})
        // save the winner to the result table
        console.log(winner);
        try {
        Result.create({
          result_char: stringify(winner.value),
          user_id: { user: { id: user } },
          character_id: {Character: {id: Character.findOne({result_char: winner.value}).id}}
        }).then(() => {res.redirect('/results')});
        localStorage.clear();
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    }
  };
};
}
);


router.get('/results', (req, res) => {
try {
  const user = user.id
  const result = Result.findOne({ where: { user_id:user }})
    console.log(result);  
    res.render('results', {layout: 'main', include: [Character]})
      //  loggedIn: req.session.logged_in;
    } catch (err) {
      console.log(err);
      res.sendStatus(500)
    }
  }
)





module.exports = router;

