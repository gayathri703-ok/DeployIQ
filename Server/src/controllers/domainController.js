import Domain from "../models/domainModel.js";

// ======================================
// CREATE DOMAIN
// ======================================

export const createDomain = async (
  req,
  res
) => {
  try {
    const {
      projectId,
      domain,
    } = req.body;

    const newDomain =
      await Domain.create({
        projectId,
        domain,
      });

    return res.status(201).json({
      success: true,
      domain: newDomain,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL DOMAINS
// ======================================

export const getDomains = async (
  req,
  res
) => {
  try {
    const domains =
      await Domain.find().sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      domains,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// DELETE DOMAIN
// ======================================

export const deleteDomain =
  async (req, res) => {
    try {
      const domain =
        await Domain.findByIdAndDelete(
          req.params.id
        );

      if (!domain) {
        return res.status(404).json({
          success: false,
          message:
            "Domain not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Domain deleted",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };