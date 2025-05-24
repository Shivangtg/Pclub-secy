import { create } from 'zustand';

interface File {
  name;
  path;
  language;
  content;
}

interface EditorStore {
  files: File[];
  activePath: string;
  setActive: (path: string) => void;
  updateFile: (path: string, content: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  files: [
    {
      name: 'index.js',
      path: '/index.js',
      language: 'javascript',
      content: '// Welcome to Monaco!',
    },
    {
      name: 'style.css',
      path: '/style.css',
      language: 'css',
      content: 'body { margin: 0; }',
    },
  ],
  activePath: '/index.js',
  setActive: (path) => set({ activePath: path }),
  updateFile: (path, content) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.path === path ? { ...f, content } : f
      ),
    })),
}));
