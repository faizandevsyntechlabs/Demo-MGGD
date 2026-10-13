/**
 * Buyer Themes & Presets Panel
 * Requirement 27: At least 4 themes, deterministic PRNG randomize, strictly protects scene architecture
 */

import React from 'react';
import { Sparkles, Dices, Check } from 'lucide-react';
import { THEMES, getDeterministicRandomTheme } from '../../data/themes.js';

export function BuyerThemes({ onApplyTheme }) {
  const handleRandomize = () => {
    const randomTheme = getDeterministicRandomTheme(Date.now());
    onApplyTheme(randomTheme);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Curated Palettes & Style Presets:
        </span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleRandomize}
          title="Deterministic PRNG Palette Generation (Requirement 27)"
        >
          <Dices size={12} color="var(--accent-secondary)" />
          <span>Randomize</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onApplyTheme(theme)}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'border-color 0.15s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-main)' }}>
                {theme.name}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {theme.fontFamily}
              </span>
            </div>

            {/* Color Swatches */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '3px', background: theme.colors.primary, border: '1px solid rgba(255,255,255,0.2)' }} />
              <div style={{ width: '18px', height: '18px', borderRadius: '3px', background: theme.colors.secondary, border: '1px solid rgba(255,255,255,0.2)' }} />
              <div style={{ width: '18px', height: '18px', borderRadius: '3px', background: theme.colors.accent, border: '1px solid rgba(255,255,255,0.2)' }} />
              <div style={{ width: '18px', height: '18px', borderRadius: '3px', background: theme.colors.background, border: '1px solid rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                {theme.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
