import { Router } from 'express';

const router = Router();

// GET /api/videos - list videos (stub)
router.get('/', async (_req, res) => {
  const demoVideos = [
    { id: '1', title: 'Demo video', status: 'completed', createdAt: new Date().toISOString() },
  ];
  res.json(demoVideos);
});

// POST /api/videos/upload - receive upload metadata (stub)
router.post('/upload', async (req, res) => {
  const { filename, size } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'filename is required' });
  }

  const video = {
    id: Date.now().toString(),
    filename,
    size: size ?? 0,
    status: 'processing' as const,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({ video });
});

// POST /api/videos/:id/edit - start AI editing job (stub)
router.post('/:id/edit', async (req, res) => {
  const { id } = req.params;
  const settings = req.body;

  res.json({
    id,
    status: 'processing',
    settings,
    message: 'AI editing job accepted (stub)',
  });
});

// GET /api/videos/:id - get single video info (stub)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  res.json({
    id,
    filename: 'demo.mp4',
    status: 'completed',
    createdAt: new Date().toISOString(),
  });
});

export default router;
