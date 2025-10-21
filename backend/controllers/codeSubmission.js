import Submission from '../models/Submission.js';
import { generateQuiz } from '../gemini/gem.js';
import Question from '../models/Question.js';
import User from '../models/user.js';
import { generateFeedback } from '../gemini/feedback.js';

export const codeSubmission = async (req, res, next) => {
  try {
    // const { student, question, code, language, generativeQnA, grade, evaluatedByTeacher } = req.body;
    const {username, email, questionId, code, language} = req.body;

    // Find the student by email
    const student = await User.findOne({ email }).select('_id').exec();

    // get the question by id(custom field)
    const question = await Question.findOne({ id: questionId }).exec();

if (!question) {
  return res.status(404).json({
    success: false,
    message: `Question not found for id: ${questionId}`,
  });
}

    // generate questions and answers using llm api
    const generativeQnA = await generateQuiz(question, code, language);
    console.log(generativeQnA);

    // Create a new Submission document
    const newSubmission = new Submission({
      student,
      question : question._id,
      username,
      email,
      code,
      language,
      generativeQnA,
    });

    // Save the Submission document to the database
    await newSubmission.save();

    res.status(200).json({
      success: true,
      message: 'Code submitted successfully',
      submission: newSubmission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit code',
      error: error.message,
    });
  }
};

export const getSubmissionbyId = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the Submission document by id
    const submission = await Submission.findById(id);
    console.log(submission);
    res.status(200).json({
      success: true,
      submission,
    });
  }catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message,
    });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    // Find all Submission documents
    const submissions = await Submission.find();
    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message,
    });
  }
};

export const evaluateSubmission = async (req, res, next) => {
  // res.json({ message: 'evaluateSubmission' });
  try {
    const {id} = req.params;
    const updates = req.body.formattedAnswers;
    console.log(updates);


    const updateQuery = {
      $set: {},
    };
    const arrayFilters = [];
    
    updates.forEach((update, index) => {
      const identifier = `q${index}`; // Unique identifier for each question
      updateQuery.$set[`generativeQnA.$[${identifier}].studentAnswer`] = update.answer;
      arrayFilters.push({ [`${identifier}._id`]: update.questionId });
    });
    
    await Submission.updateOne(
      { _id: id }, // Find the parent document
      updateQuery, // Dynamically constructed $set object
      { arrayFilters } // Dynamically constructed arrayFilters
    );

    next();


  } catch(error){
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate submission',
      error: error.message,
    });
  }
};

export const aiFeedback = async (req, res) => {
  try {

    console.log('AI Feedback');
    const { id } = req.params;
    // const id = '67c21356ee8ecbd4556ca013'; // hardcoded for testing
    //find only the generativeQnA of the submission
    const submission = await Submission.findById(id);
    const question = await Question.findById(submission.question);

    const aiResponseFeedback = await generateFeedback(question, submission);
    // console.log(aiResponseFeedback);

    const {feedbacks, overallGrade} = aiResponseFeedback;
    // console.log(feedbacks);

    const updateQuery = {
      $set: {},
    };
    const arrayFilters = [];
    
    // Construct the $set object and arrayFilters
    feedbacks.forEach((feedback, index) => {
      const identifier = `q${index}`; // Unique identifier for each question
      updateQuery.$set[`generativeQnA.$[${identifier}].aiFeedback`] = feedback.response;
      arrayFilters.push({ [`${identifier}._id`]: feedback._id });
    });
    
    // Execute the update
    await Submission.updateOne(
      { _id: id }, // Find the submission by its ID
      updateQuery, // Update the feedback for each question
      { arrayFilters } // Filter questions by their _id
    );

    await Submission.updateOne(
      { _id: id }, // Find the submission by its ID
      { $set: { grade: overallGrade } } // Update the grade
    );

    res.status(200).json({
      success: true,
      message: 'AI feedback generated successfully',
      feedbacks,
      overallGrade,
    });
    
  }catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get AI feedback',
      error: error.message,
    });
  }
};

export const updateGradeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade } = req.body;

    await Submission.updateOne({ _id: id }, { grade });
    res.status(200).json({
      success: true,
      message: 'Grade updated successfully',
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: error.message,
      error
  });
}
};
export const deleteSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Submission.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission',
      error: error.message,
    });
  }
};
