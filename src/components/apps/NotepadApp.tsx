import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Note {
  id: string;
  title: string;
  content: string;
}

const NotepadApp: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('Untitled');
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notes')
      .select('id, title, content')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (data) {
      setNotes(data);
      if (data.length > 0 && !activeNoteId) {
        setActiveNoteId(data[0].id);
        setTitle(data[0].title);
        setText(data[0].content || '');
      }
    }
    setLoading(false);
  }, [user, activeNoteId]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const selectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setTitle(note.title);
    setText(note.content || '');
    setSaved(true);
  };

  const handleSave = async () => {
    if (!user) return;
    if (activeNoteId) {
      await supabase.from('notes').update({ title, content: text }).eq('id', activeNoteId);
    } else {
      const { data } = await supabase
        .from('notes')
        .insert({ user_id: user.id, title, content: text })
        .select('id')
        .single();
      if (data) setActiveNoteId(data.id);
    }
    setSaved(true);
    loadNotes();
  };

  const handleNew = () => {
    setActiveNoteId(null);
    setTitle('Untitled');
    setText('');
    setSaved(true);
  };

  const handleDelete = async () => {
    if (!activeNoteId) return;
    await supabase.from('notes').delete().eq('id', activeNoteId);
    handleNew();
    loadNotes();
  };

  if (loading) return <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-44 border-r border-border/30 flex flex-col">
        <div className="p-2 border-b border-border/30">
          <button onClick={handleNew} className="w-full text-xs px-2 py-1.5 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
            + New Note
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.map(n => (
            <button
              key={n.id}
              onClick={() => selectNote(n)}
              className={`w-full text-left px-3 py-2 text-xs truncate transition-colors ${n.id === activeNoteId ? 'bg-primary/20 text-primary' : 'text-foreground/70 hover:bg-secondary/50'}`}
            >
              {n.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/30">
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); setSaved(false); }}
            className="text-xs font-medium bg-transparent outline-none text-foreground flex-1"
            placeholder="Note title"
          />
          <button onClick={handleSave} className="text-xs px-3 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
            Save
          </button>
          {activeNoteId && (
            <button onClick={handleDelete} className="text-xs px-3 py-1 rounded-md bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors">
              Delete
            </button>
          )}
          <span className="text-xs text-muted-foreground">{saved ? 'Saved' : 'Unsaved'}</span>
        </div>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setSaved(false); }}
          className="flex-1 w-full bg-transparent p-4 text-sm font-mono-code text-foreground resize-none outline-none"
          placeholder="Start typing..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default NotepadApp;
