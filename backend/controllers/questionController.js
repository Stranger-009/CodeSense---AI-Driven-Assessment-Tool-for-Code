import Question from "../models/Question.js";

// Get all questions
export const getAllQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", cause: error.message });
    }
};

// Get question by ID
export const getQuestionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("Fetching question with ID:", id);

        // Use findOne instead of findById for UUIDs
        const question = await Question.findOne({ id });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error("Error fetching question:", error);
        res.status(500).json({ message: "Internal Server Error", cause: error.message });
    }
};


// Add new question
export const addQuestion = async (req, res, next) => {
    try {
        console.log(req.body);
        const { question, description, difficulty, testCases } = req.body;
        const newQuestion = new Question({ question, description, difficulty, testCases });
        await newQuestion.save();
        res.status(201).json({ message: "Question added successfully" });
     } catch (error) {
    if (error.code === 11000) {
        return res.status(409).json({ message: "Description must be unique" });
    }
    console.error("Error while adding question:", error); // 🔍 This will show the actual error in your backend logs
    res.status(500).json({ message: "Internal Server Error", cause: error.message });
}

};

// Update question by ID
export const updateQuestionById = async (req, res, next) => {
    try {
        const { question, description, difficulty, testCases } = req.body;
        const { id } = req.params;

        const updatedQuestion = await Question.findByIdAndUpdate(
            id, 
            { question, description, difficulty, testCases }, 
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question updated successfully", updatedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", cause: error.message });
    }
};

// Delete question by ID
export const deleteQuestionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Question.findOneAndDelete({ id }); // use custom id
    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting question:", error);
    res.status(500).json({ message: "Internal Server Error", cause: error.message });
  }
};
