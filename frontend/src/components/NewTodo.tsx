import type { ChangeEvent, KeyboardEvent } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  tagValue?: string;
  onTagChange?: (v: string) => void;
  onCreate: () => void;
};

export default function NewTodo({ value, onChange, tagValue = '', onTagChange = () => {}, onCreate }: Props) {
  return (
    <section className="new-todo">
      <input
        className="new-input"
        placeholder="新しいTODOを追加"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') onCreate(); }}
      />
      <input
        className="tag-input"
        placeholder="雑務, 仕事, プライベート"
        value={tagValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onTagChange(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') onCreate(); }}
      />
      <button className="btn primary" onClick={onCreate}>追加</button>
    </section>
  );
}
