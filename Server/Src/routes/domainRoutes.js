import express from "express";

import {
  createDomain,
  getDomains,
  deleteDomain,
} from "../controllers/domainController.js";

const router =
  express.Router();

router.get(
  "/",
  getDomains
);

router.post(
  "/",
  createDomain
);

router.delete(
  "/:id",
  deleteDomain
);

export default router;