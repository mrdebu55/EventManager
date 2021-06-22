import express from 'express';
import { addEvent } from '../controller/eventController';
const router = express.Router();

router.post('/addEvetnt',addEvent);

export default router;