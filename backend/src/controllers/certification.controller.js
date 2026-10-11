import Certification from "../models/Certification.js";

// Create Certification
export const createCertification = async (req, res) => {
  try {
    const certification = await Certification.create(req.body);

    res.status(201).json({
      success: true,
      message: "Certification created successfully",
      data: certification,
    });
  } catch (error) {
    console.error("Create certification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create certification",
    });
  }
};

// Get All Certifications
export const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: certifications.length,
      data: certifications,
    });
  } catch (error) {
    console.error("Get certifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch certifications",
    });
  }
};

// Get Certification By ID
export const getCertificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findById(id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certification,
    });
  } catch (error) {
    console.error("Get certification by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch certification",
    });
  }
};

// Update Certification
export const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCertification =
      await Certification.findByIdAndUpdate(
        id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    if (!updatedCertification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certification updated successfully",
      data: updatedCertification,
    });
  } catch (error) {
    console.error("Update certification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update certification",
    });
  }
};

// Delete Certification
export const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCertification =
      await Certification.findByIdAndDelete(id);

    if (!deletedCertification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
    });
  } catch (error) {
    console.error("Delete certification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete certification",
    });
  }
};