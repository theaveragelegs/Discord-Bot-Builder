import { Router } from 'express';
import { previewCode, exportZip } from '../controllers/exportController.js';

const router = Router();

// POST — accepts project data in body
router.post('/preview', previewCode);
router.post('/zip', exportZip);

export default router;
