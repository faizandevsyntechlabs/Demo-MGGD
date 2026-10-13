/**
 * Buyer Properties Panel
 * Requirement 25-28:
 * - Edit text, colors, fonts (from 20 Google Fonts), images (local upload)
 * - Buyer cannot touch scene definitions or triggers
 */

import React from 'react';
import { Type, Palette, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';
import { GOOGLE_FONT_FAMILIES } from '../../data/fontFamilies.js';

export function BuyerProperties({
  properties,
  onUpdateProperties
}) {
  const { headline, subline, tag, colors, fontFamily, imageUrl } = properties;

  const handleColorChange = (key, val) => {
    onUpdateProperties({
      colors: {
        ...colors,
        [key]: val
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onUpdateProperties({ imageUrl: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Text Editing */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Type size={13} />
          <span>Copy & Typography</span>
        </div>

        <div className="form-group">
          <span className="form-label">Primary Headline</span>
          <input
            type="text"
            className="form-input"
            value={headline || ''}
            onChange={(e) => onUpdateProperties({ headline: e.target.value })}
            placeholder="Headline text..."
          />
        </div>

        <div className="form-group">
          <span className="form-label">Subline / Tagline</span>
          <input
            type="text"
            className="form-input"
            value={subline || ''}
            onChange={(e) => onUpdateProperties({ subline: e.target.value })}
            placeholder="Subline or presenter role..."
          />
        </div>

        <div className="form-group">
          <span className="form-label">Badge Tag / Price</span>
          <input
            type="text"
            className="form-input"
            value={tag || ''}
            onChange={(e) => onUpdateProperties({ tag: e.target.value })}
            placeholder="Tag or category pill..."
          />
        </div>

        {/* 20 Configured Google Fonts (Requirement 26) */}
        <div className="form-group">
          <span className="form-label">Font Family (20 Google Fonts)</span>
          <select
            className="form-select"
            value={fontFamily || 'Inter'}
            onChange={(e) => onUpdateProperties({ fontFamily: e.target.value })}
            style={{ fontFamily: fontFamily || 'sans-serif' }}
          >
            {GOOGLE_FONT_FAMILIES.map((f) => (
              <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>
                {f.name} — ({f.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Color Palette */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Palette size={13} />
          <span>Color Palette</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div className="form-group">
            <span className="form-label">Primary Accent</span>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input-preview"
                value={colors?.primary || '#8b5cf6'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                value={colors?.primary || '#8b5cf6'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Secondary Color</span>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input-preview"
                value={colors?.secondary || '#06b6d4'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                value={colors?.secondary || '#06b6d4'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Highlight Accent</span>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input-preview"
                value={colors?.accent || '#facc15'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                value={colors?.accent || '#facc15'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Text Color</span>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input-preview"
                value={colors?.text || '#ffffff'}
                onChange={(e) => handleColorChange('text', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                value={colors?.text || '#ffffff'}
                onChange={(e) => handleColorChange('text', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Image / Logo Replacement */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={13} />
          <span>Brand Image / Logo Asset</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {imageUrl && (
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: '#1e293b', border: '1px solid var(--border-medium)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={imageUrl} alt="Asset" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          )}

          <label className="btn btn-secondary btn-sm" style={{ flex: 1, cursor: 'pointer' }}>
            <Upload size={12} />
            <span>Upload New Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </div>
  );
}
