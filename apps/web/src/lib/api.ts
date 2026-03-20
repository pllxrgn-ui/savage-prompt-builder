/** 
 * Centralized API calls for the frontend.
 * This ensures consistency and makes it easy to switch between local and cloud sync.
 */

/** Thrown when the user has run out of credits */
export class InsufficientCreditsError extends Error {
  constructor() {
    super('You have run out of credits. Upgrade to Pro for unlimited access.');
    this.name = 'InsufficientCreditsError';
  }
}

/** Helper to throw typed errors on API failure */
async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data?.code === 'INSUFFICIENT_CREDITS') {
      throw new InsufficientCreditsError();
    }
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  prompts: {
    list: async () => {
      const res = await fetch('/api/prompts');
      return handleResponse(res);
    },
    save: async (data: any) => {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/prompts?id=${id}`, {
        method: 'DELETE',
      });
      return handleResponse(res);
    },
  },

  recipes: {
    list: async () => {
      const res = await fetch('/api/recipes');
      return handleResponse(res);
    },
    save: async (data: any) => {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/recipes?id=${id}`, {
        method: 'DELETE',
      });
      return handleResponse(res);
    },
  },

  user: {
    get: async () => {
      const res = await fetch('/api/user');
      return handleResponse(res);
    },
    update: async (data: any) => {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async () => {
      const res = await fetch('/api/user', {
        method: 'DELETE',
      });
      return handleResponse(res);
    },
  },

  customStyles: {
    list: async () => {
      const res = await fetch('/api/custom-styles');
      return handleResponse(res);
    },
    save: async (data: any) => {
      const res = await fetch('/api/custom-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/custom-styles?id=${id}`, {
        method: 'DELETE',
      });
      return handleResponse(res);
    },
  },

  share: {
    /** Create a short link. Returns { id: string } */
    create: async (payload: string) => {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload }),
      });
      return handleResponse(res);
    },
    /** Retrieve a shared prompt by its short ID. Returns { payload: string } */
    get: async (id: string) => {
      const res = await fetch(`/api/share?id=${id}`);
      return handleResponse(res);
    },
  },

  generate: {
    /** Start an image generation job. Returns { jobId, status } */
    start: async (data: {
      prompt: string;
      model?: string;
      count?: number;
      aspectRatio?: string;
      negativePrompt?: string;
    }) => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    /** Poll for job status. Returns { jobId, status, images, error } */
    poll: async (jobId: string) => {
      const res = await fetch(`/api/generate/${jobId}`);
      return handleResponse(res);
    },
    /**
     * Poll until the job finishes. Resolves with images[] on success, 
     * or rejects on failure/timeout. 
     * interval: ms between polls (default 2000)
     * timeout: max wait time in ms (default 120000 = 2 min)
     */
    waitForCompletion: async (
      jobId: string,
      { interval = 2000, timeout = 120_000 } = {}
    ): Promise<string[]> => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        const result = await api.generate.poll(jobId);
        if (result.status === 'completed') return result.images as string[];
        if (result.status === 'failed') throw new Error(result.error ?? 'Generation failed');
        await new Promise(r => setTimeout(r, interval));
      }
      throw new Error('Generation timed out');
    },
    /**
     * Submit feedback for SLM training/rewards.
     * isPositive: true (YES - Refund), false (NO - Auto-logged only)
     */
    feedback: async (jobId: string, isPositive: boolean) => {
      const res = await fetch('/api/generate/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, isPositive }),
      });
      return handleResponse(res);
    },
  },
  ai: {
    /**
     * Start a prompt polish job.
     */
    polish: async (payload: { prompt: string; generator: string; templateId: string }) => {
      const res = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
  },
};


