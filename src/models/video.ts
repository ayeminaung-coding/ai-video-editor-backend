// video.ts - Simple in-memory video model

export type VideoStatus = 'completed' | 'processing' | 'failed';

export interface Video {
  id: string;
  filename: string;
  size: number;
  status: VideoStatus;
  createdAt: string;
  updatedAt: string;
}

// In-memory store for now (later can be replaced with a real database)
const videos: Video[] = [];

export const getAllVideos = (): Video[] => {
  return videos.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

export const findVideoById = (id: string): Video | undefined => {
  return videos.find(v => v.id === id);
};

export const createVideo = (data: { filename: string; size: number }): Video => {
  const now = new Date().toISOString();
  const video: Video = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    filename: data.filename,
    size: data.size,
    status: 'processing',
    createdAt: now,
    updatedAt: now,
  };
  videos.unshift(video);
  return video;
};

export const updateVideoStatus = (
  id: string,
  status: VideoStatus,
): Video | undefined => {
  const video = findVideoById(id);
  if (!video) return undefined;
  video.status = status;
  video.updatedAt = new Date().toISOString();
  return video;
};

export const deleteVideo = (id: string): boolean => {
  const idx = videos.findIndex(v => v.id === id);
  if (idx === -1) return false;
  videos.splice(idx, 1);
  return true;
};
