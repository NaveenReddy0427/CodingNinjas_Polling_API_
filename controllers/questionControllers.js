// importing Questions Controllers
const Questions = require("../models/questionModel");

// importing Option Controller
const Option = require("../models/OptionsModel");

//To create a question
module.exports.createQuestion = async function (req, res) {
  let question;
  try {
    // creating the questions
    console.log(req.body); 
    const tat = req.body.title;
    question = await Questions.create({title: tat});
      
    // returning the response
    return res.status(200).json({
      message: "Question created successfully",
      question: question
    });
  } catch (err) {
    // checking for the error
    return res.status(465).json({
      message: "Error in creating a question",
      error: err.message,
    });
  }
};


//To delete a question
module.exports.deleteQuestion = async function (req, res) {
  try {
    // finding the particular Question
    const question = await Questions.findById(req.params.id);
    // deleting all the options related to that question
    for (let id of question.options) {
      let option = await Option.findById(id);
      // checking whether option contains any votes or not
      if (option.votes > 0) {
        return res.status(401).json({
          message: "you cannot delete that option",
        });
      }
      // delete that particular option
      await option.remove();
    }
    // deleting the question
    
    await question.remove();
    // sending response
    return res.status(200).json({
      message: "question deleted succesfully",
      question:question

    });
  } catch (err) {
    // checking for error
    console.log(err);
    return res.status(465).json({
      message: "internal server error",
      error: err.message,
    });
  }
};

//To view a question and it’s options
module.exports.getQuestionDetails = async function (req, res) {
  try {
    // finding and populating the question
    const question = await Questions.findById(req.params.id).populate(
      "options"
    );
    // returning the response
    return res.status(200).json(question);
  } catch (err) {
    // checking for the errors
    return res.status(465).json({
      message: "internal server error",
      error: err.message,
    });
  }
};
