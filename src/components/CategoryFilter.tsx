import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES, Category } from '@/types/store';

interface CategoryFilterProps {
  selected: Category | 'all';
  onSelect: (cat: Category | 'all') => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('all')}
        className={`px-4 py-2 rounded-full text-xs font-heading tracking-wider transition-all border ${
          selected === 'all'
            ? 'bg-primary text-primary-foreground border-primary neon-border'
            : 'bg-secondary/50 text-muted-foreground border-border hover:border-primary/50'
        }`}
      >
        ⚡ TODAS
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-xs font-heading tracking-wider transition-all border ${
            selected === cat.id
              ? 'bg-primary text-primary-foreground border-primary neon-border'
              : 'bg-secondary/50 text-muted-foreground border-border hover:border-primary/50'
          }`}
        >
          {cat.icon} {cat.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
