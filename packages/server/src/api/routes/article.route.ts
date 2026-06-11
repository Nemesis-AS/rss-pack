import express from "express";
import {
  getAllArticles,
  getArticleById,
  setArticleRead,
  setArticleStarred,
} from "../controllers/article.controller.js";
import validateDto from "../middlewares/validate-dto.js";
import { articleIdParam, getAllArticlesDto } from "../dto/article.dto.js";

const router = express.Router();

router.get("/", validateDto(getAllArticlesDto), getAllArticles);
router.get("/:id", validateDto(articleIdParam), getArticleById);
router.post("/:id/star", validateDto(articleIdParam), setArticleStarred);
router.post("/:id/mark-read", validateDto(articleIdParam), setArticleRead);

export default router;
