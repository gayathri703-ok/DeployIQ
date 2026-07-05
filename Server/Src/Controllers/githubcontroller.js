// ============================================
// GitHub Controller
// ============================================

import axios from "axios";

import User from "../models/User.js";

// ============================================
// GitHub OAuth Config
// ============================================

const CLIENT_ID =
  process.env.GITHUB_CLIENT_ID;

const CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET;

const CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL ||
  "http://localhost:5000/api/github/callback";

// ============================================
// Connect GitHub
// ============================================

export const connectGitHub =
  async (req, res) => {

    try {

      const state =
        req.user.id;

      const githubUrl =
        `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user&state=${state}`;

      res.json({

        success: true,

        url:
          githubUrl

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  };

// ============================================
// GitHub OAuth Callback
// ============================================

export const githubCallback =
  async (req, res) => {

    try {

      const {

        code,
        state

      } = req.query;

      if (!code) {

        return res.status(400).json({

          success: false,

          message:
            "GitHub code missing"

        });

      }

      // Exchange code for access token

      const tokenResponse =
        await axios.post(

          "https://github.com/login/oauth/access_token",

          {

            client_id:
              CLIENT_ID,

            client_secret:
              CLIENT_SECRET,

            code

          },

          {

            headers: {

              Accept:
                "application/json"

            }

          }

        );

      const accessToken =
        tokenResponse.data.access_token;

      // Get GitHub user

      const userResponse =
        await axios.get(

          "https://api.github.com/user",

          {

            headers: {

              Authorization:
                `Bearer ${accessToken}`

            }

          }

        );

      const githubUser =
        userResponse.data;

      // Save to DB

      await User.findByIdAndUpdate(

        state,

        {

          githubConnected:
            true,

          githubAccessToken:
            accessToken,

          githubUsername:
            githubUser.login,

          githubId:
            githubUser.id

        }

      );

      res.json({

        success: true,

        message:
          "GitHub connected successfully",

        githubUsername:
          githubUser.login

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  };

// ============================================
// Get Repositories
// ============================================

export const getRepositories =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).select(
          "+githubAccessToken"
        );

      if (
        !user ||
        !user.githubAccessToken
      ) {

        return res.status(400).json({

          success: false,

          message:
            "GitHub not connected"

        });

      }

      const response =
        await axios.get(

          "https://api.github.com/user/repos",

          {

            headers: {

              Authorization:
                `Bearer ${user.githubAccessToken}`

            }

          }

        );

      const repos =
        response.data.map((repo) => ({

          id:
            repo.id,

          name:
            repo.name,

          fullName:
            repo.full_name,

          private:
            repo.private,

          branch:
            repo.default_branch,

          url:
            repo.html_url,

          cloneUrl:
            repo.clone_url

        }));

      res.json({

        success: true,

        count:
          repos.length,

        repos

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  };

// ============================================
// Disconnect GitHub
// ============================================

export const disconnectGitHub =
  async (req, res) => {

    try {

      await User.findByIdAndUpdate(

        req.user.id,

        {

          githubConnected:
            false,

          githubAccessToken:
            null,

          githubUsername:
            null,

          githubId:
            null

        }

      );

      res.json({

        success: true,

        message:
          "GitHub disconnected"

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  };