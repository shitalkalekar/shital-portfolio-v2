import Education from "../models/Education.js";

// Create Education
export const createEducation = async (req, res) => {
  try {
    const education = await Education.create(req.body);

    res.status(201).json({
      success: true,
      message: "Education created successfully",
      data: education,
    });
  } catch (error) {
    console.error("Create education error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create education",
    });
  }
};

// Get All Education
export const getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: educations.length,
      data: educations,
    });
  } catch (error) {
    console.error("Get educations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
  }
};

// Get Education By ID
export const getEducationById = async (req, res) => {
  try {
    const { id } = req.params;

    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    console.error("Get education by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
  }
};

// Update Education
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedEducation) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: updatedEducation,
    });
  } catch (error) {
    console.error("Update education error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update education",
    });
  }
};

// Delete Education
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEducation = await Education.findByIdAndDelete(id);

    if (!deletedEducation) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Delete education error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete education",
    });
  }
};