import Project from "../models/Project.js";
import Skill from "../models/skill.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";
import Certification from "../models/Certification.js";
import Message from "../models/Message.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      projectCount,
      skillCount,
      experienceCount,
      educationCount,
      certificationCount,
      messageCount,
      unreadMessageCount,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Certification.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({
        status: "unread",
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        projects: projectCount,
        skills: skillCount,
        experiences: experienceCount,
        education: educationCount,
        certifications: certificationCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });
  }
};