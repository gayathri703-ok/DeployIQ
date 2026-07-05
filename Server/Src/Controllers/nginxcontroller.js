import NginxConfig from "../models/nginxModel.js";

// ========================================
// Generate Config
// ========================================

export const generateConfig = async (
  req,
  res
) => {
  try {

    const { domain, port } =
      req.body;

    const config = `
server {
    listen 80;
    server_name ${domain};

    location / {
        proxy_pass http://localhost:${port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
`;

    const savedConfig =
      await NginxConfig.create({
        domain,
        port,
        config,
      });

    res.status(200).json({
      success: true,
      config,
      savedConfig,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ========================================
// Get All Configs
// ========================================

export const getConfigs = async (
  req,
  res
) => {
  try {

    const configs =
      await NginxConfig.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      configs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ========================================
// Delete Config
// ========================================

export const deleteConfig = async (
  req,
  res
) => {
  try {

    await NginxConfig.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Config deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};