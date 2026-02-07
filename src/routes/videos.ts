import { Router } from 'express';
import {
  createVideo,
  deleteVideo,
  findVideoById,
  getAllVideos,
  updateVideoStatus,
} from '../models/video';

const router = Router();

// GET /api/videos - list videos
router.get('/', async (_req, res) => {
  try {
    const videos = await getAllVideos();
    res.json(videos);
  } catch (err) {
    console.error('Error fetching videos', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// POST /api/videos/upload - receive upload metadata
router.post('/upload', async (req, res) => {
  const { filename, size } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'filename is required' });
  }

  try {
    const video = await createVideo({
      filename,
      size: typeof size === 'number' ? size : 0,
    });

    res.status(201).json(video);
  } catch (err) {
    console.error('Error creating video', err);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// POST /api/videos/:id/edit - start AI editing job (stub)
router.post('/:id/edit', async (req, res) => {
  const { id } = req.params;
  const settings = req.body;

  const video = await findVideoById(id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  // For now, mark as processing and echo back settings
  await updateVideoStatus(id, 'processing');

  res.json({
    id,
    status: 'processing',
    settings,
    message: 'AI editing job accepted (stub)',
  });
});

// PATCH /api/videos/:id/status - manually update status (e.g., mark as completed)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status: 'completed' | 'processing' | 'failed' };

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  const updated = await updateVideoStatus(id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.json(updated);
});

// GET /api/videos/:id - get single video info
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const video = await findVideoById(id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.json(video);
});

// DELETE /api/videos/:id - delete a video
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const ok = await deleteVideo(id);
  if (!ok) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.status(204).send();
});

export default router;
