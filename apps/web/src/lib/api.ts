/** 
 * Centralized API calls for the frontend.
 * This ensures consistency and makes it easy to switch between local and cloud sync.
 */

export const api = {
  prompts: {
    list: async () => {
      const res = await fetch('/api/prompts');
      if (!res.ok) throw new Error('Failed to fetch prompts');
      return res.json();
    },
    save: async (data: any) => {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save prompt');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/prompts?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete prompt');
      return res.json();
    },
  },

  recipes: {
    list: async () => {
      const res = await fetch('/api/recipes');
      if (!res.ok) throw new Error('Failed to fetch recipes');
      return res.json();
    },
    save: async (data: any) => {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save recipe');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/recipes?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete recipe');
      return res.json();
    },
  },

  user: {
    get: async () => {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
    update: async (data: any) => {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update user');
      return res.json();
    },
  },

  customStyles: {
    list: async () => {
      const res = await fetch('/api/custom-styles');
      if (!res.ok) throw new Error('Failed to fetch custom styles');
      return res.json();
    },
    save: async (data: any) => {
      const res = await fetch('/api/custom-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save custom style');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/custom-styles?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete custom style');
      return res.json();
    },
  },
};
