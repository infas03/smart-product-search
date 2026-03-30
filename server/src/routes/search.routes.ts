import { Router } from "express";
import { handleSearchRequest } from "../controllers/search.controller.js";
import { validateSearchQuery } from "../middleware/validate-query.js";

const searchRouter = Router();

searchRouter.get("/", validateSearchQuery, handleSearchRequest);

export default searchRouter;
