import Experience from "../models/Experience.js";

// Create Experience
export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Create experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create experience",
    });
  }
};

// Get All Experiences
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    console.error("Get experiences error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch experiences",
    });
  }
};

// Get Experience By ID
export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error("Get experience by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
  }
};

// Update Experience
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedExperience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: updatedExperience,
    });
  } catch (error) {
    console.error("Update experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update experience",
    });
  }
};

// Delete Experience
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExperience = await Experience.findByIdAndDelete(id);

    if (!deletedExperience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete experience",
    });
  }
};