// video.ts - Video model backed by Postgres (Neon)

import { query } from '../db';

export type VideoStatus = 'completed' | 'processing' | 'failed';

export interface Video {
  id: string;
  filename: string;
  size: number;
  status: VideoStatus;
  createdAt: string;
  updatedAt: string;
}

export const getAllVideos = async (): Promise<Video[]> => {
  const rows = await query<Video>(
    `SELECT id, filename, size, status, created_at AS "createdAt", updated_at AS "updatedAt"
     FROM videos
     ORDER BY created_at DESC`,
  );
  return rows;
};

export const findVideoById = async (id: string): Promise<Video | undefined> => {
  const rows = await query<Video>(
    `SELECT id, filename, size, status, created_at AS "createdAt", updated_at AS "updatedAt"
     FROM videos
     WHERE id = $1`,
    [id],
  );
  return rows[0];
};

export const createVideo = async (data: {
  filename: string;
  size: number;
}): Promise<Video> => {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const rows = await query<Video>(
    `INSERT INTO videos (id, filename, size, status)
     VALUES ($1, $2, $3, 'processing')
     RETURNING id, filename, size, status, created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id, data.filename, data.size],
  );
  return rows[0];
};

export const updateVideoStatus = async (
  id: string,
  status: VideoStatus,
): Promise<Video | undefined> => {
  const rows = await query<Video>(
    `UPDATE videos
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, filename, size, status, created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id, status],
  );
  return rows[0];
};

export const deleteVideo = async (id: string): Promise<boolean> => {
  const rows = await query<{ id: string }>(
    `DELETE FROM videos WHERE id = $1 RETURNING id`,
    [id],
  );
  return rows.length > 0;
};
