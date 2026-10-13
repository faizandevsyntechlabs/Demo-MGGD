/**
 * Maker Library & Licensing Panel
 * Requirements 16 & 32 (Library Policy), 17 & 33 (Licensing & Transparency)
 */

import React from 'react';
import { BookOpen, Shield, ShieldCheck, AlertTriangle } from 'lucide-react';

export function MakerLibraryPanel({
  activeGenerator,
  onUpdateGenerator
}) {
  const libraries = activeGenerator.libraries || [];
  const defaultAssets = activeGenerator.defaultAssets || [];

  const handleToggleLibrary = (idx, keepVal) => {
    const updated = [...libraries];
    updated[idx] = { ...updated[idx], keep: keepVal };
    onUpdateGenerator({ libraries: updated });
  };

  const handleUpdateLibraryLicense = (idx, license) => {
    const updated = [...libraries];
    updated[idx] = { ...updated[idx], license };
    onUpdateGenerator({ libraries: updated });
  };

  const handleUpdateAssetLicense = (idx, license) => {
    const updated = [...defaultAssets];
    updated[idx] = { ...updated[idx], license };
    onUpdateGenerator({ defaultAssets: updated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Transparency Policy */}
      <div style={{ padding: '10px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Transparency Policy (Requirement 12)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-main)' }}>Default Alpha Transparency</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Buyer cannot alter maker transparency policy</div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(activeGenerator.transparency)}
            onChange={(e) => onUpdateGenerator({ 
              transparency: e.target.checked,
              transparentType: e.target.checked ? 'overlay' : 'page-layout'
            })}
            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Library Policy (Requirement 16 & 32) */}
      <div style={{ padding: '10px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={13} />
          <span>Library Policy & Declarations</span>
        </div>

        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Default is native browser Canvas. Optional libraries (GSAP, Three.js) require declared licenses:
        </div>

        {libraries.map((lib, idx) => (
          <div key={idx} style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', marginBottom: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-main)' }}>
                {lib.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Keep?</span>
                <input
                  type="checkbox"
                  checked={Boolean(lib.keep)}
                  onChange={(e) => handleToggleLibrary(idx, e.target.checked)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '4px' }}>
              <span className="form-label" style={{ fontSize: '10px' }}>License Declaration</span>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '11px', padding: '3px 6px' }}
                value={lib.license || ''}
                onChange={(e) => handleUpdateLibraryLicense(idx, e.target.value)}
                placeholder="e.g. Standard Web API / MIT"
              />
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{lib.description}</div>
          </div>
        ))}
      </div>

      {/* Default Asset Image Licenses (Requirement 17 & 33) */}
      <div style={{ padding: '10px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={13} />
          <span>Default Maker Asset Licenses</span>
        </div>

        {defaultAssets.length === 0 ? (
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>No maker default images declared.</div>
        ) : (
          defaultAssets.map((asset, idx) => (
            <div key={asset.id} style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', marginBottom: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-main)', marginBottom: '4px' }}>
                {asset.name}
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <span className="form-label" style={{ fontSize: '10px' }}>Maker License String</span>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '11px', padding: '3px 6px' }}
                  value={asset.license || ''}
                  onChange={(e) => handleUpdateAssetLicense(idx, e.target.value)}
                  placeholder="e.g. CC-BY-4.0"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
