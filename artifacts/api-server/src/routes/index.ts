import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import userRouter from "./user";
import depositRouter from "./deposit";
import investmentRouter from "./investment";
import withdrawRouter from "./withdraw";
import marketRouter from "./market";
import treasuryRouter from "./treasury";
import supportRouter from "./support";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(userRouter);
router.use(depositRouter);
router.use(investmentRouter);
router.use(withdrawRouter);
router.use(marketRouter);
router.use(treasuryRouter);
router.use(supportRouter);

export default router;
