/**
 * Left Sidebar Component
 * Generator Library, 23 Catalog Types, Classification Metadata, Revision Actions, Upload/Import
 */

import React, { useState } from 'react';
import { 
  FolderPlus, 
  Layers, 
  Grid, 
  Upload, 
  Download, 
  RefreshCw, 
  Tag, 
  Info, 
  Check, 
  Copy,
  Plus
} from 'lucide-react';
import { GENERATOR_TYPES } from '../../data/generatorTypes.js';

export function SidebarLeft({
  mode,
  generators,
  activeGenerator,
  onSelectGenerator,
  onLoadFromCatalog,
  onCreateRevision,
  onImportGenerator
}) {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'catalog' | 'info'
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredTypes = GENERATOR_TYPES.filter((t) => {
    if (typeFilter === 'ALL') return true;
    return t.group === typeFilter;
  });

  // Handle local JSON generator import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        onImportGenerator(parsed);
      } catch (err) {
        alert('Invalid generator JSON format: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Handle downloading active generator JSON package
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeGenerator, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeGenerator.generatorId}.mggd.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Layers size={13} />
          <span>Generators & Catalog</span>
        </div>
        {mode === 'maker' && (
          <button
            className="btn btn-ghost btn-sm btn-icon-only"
            onClick={onCreateRevision}
            title="Create New Generator Revision (Requirement 4)"
          >
            <RefreshCw size={12} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          My Library ({generators.length})
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Catalog (23)
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Metadata
        </button>
      </div>

      {/* Tab Content */}
      <div className="sidebar-content">
        {activeTab === 'library' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Select an active generator to edit or render:
            </div>
            {generators.map((gen) => {
              const isSelected = gen.generatorId === activeGenerator.generatorId;
              return (
                <div
                  key={gen.generatorId}
                  onClick={() => onSelectGenerator(gen.generatorId)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-surface)' : 'var(--bg-card)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '12px' }}>
                      {gen.name}
                    </div>
                    {isSelected && <span className="badge badge-violet">Active</span>}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {gen.generatorId}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {gen.scenes?.length || 1} scenes
                    </span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {gen.classification?.category || 'Motion'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Maker actions: revision & package import/export */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Generator Package Operations
              </div>
              <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                {mode === 'maker' && (
                  <button className="btn btn-secondary btn-sm" onClick={onCreateRevision} style={{ width: '100%' }}>
                    <RefreshCw size={12} />
                    <span>Create New Revision</span>
                  </button>
                )}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <label className="btn btn-secondary btn-sm" style={{ flex: 1, cursor: 'pointer' }}>
                    <Upload size={12} />
                    <span>Import JSON</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                  <button className="btn btn-secondary btn-sm" onClick={handleExportJson} style={{ flex: 1 }}>
                    <Download size={12} />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              23 standard Motion Generator types (Requirement 30):
            </div>

            {/* Catalog Group Filters */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {['ALL', 'Motion', 'Logo Reveal', 'Lower Third'].map((grp) => (
                <button
                  key={grp}
                  className={`btn btn-sm ${typeFilter === grp ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '10px', padding: '3px 6px' }}
                  onClick={() => setTypeFilter(grp)}
                >
                  {grp}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '55vh', overflowY: 'auto' }}>
              {filteredTypes.map((typeDef) => (
                <div
                  key={typeDef.typeId}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-main)' }}>
                      {typeDef.name}
                    </span>
                    <span className="badge badge-violet" style={{ fontSize: '9px' }}>
                      {typeDef.group}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {typeDef.style} · {typeDef.mood}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {typeDef.typeId}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 6px', fontSize: '10px' }}
                      onClick={() => onLoadFromCatalog(typeDef)}
                    >
                      <Plus size={10} />
                      <span>Instantiate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Classification & VGR Metadata (5 Fields)
            </div>

            <div className="form-group">
              <span className="form-label">Generator ID</span>
              <input
                type="text"
                className="form-input"
                readOnly
                value={activeGenerator.generatorId}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-secondary)' }}
              />
            </div>

            <div className="form-group">
              <span className="form-label">Panel Version</span>
              <input type="text" className="form-input" readOnly value="M1.0" />
            </div>

            <div className="form-group">
              <span className="form-label">1. Category</span>
              <input
                type="text"
                className="form-input"
                readOnly={mode === 'buyer'}
                value={activeGenerator.classification?.category || ''}
              />
            </div>

            <div className="form-group">
              <span className="form-label">2. Subcategory</span>
              <input
                type="text"
                className="form-input"
                readOnly={mode === 'buyer'}
                value={activeGenerator.classification?.subcategory || ''}
              />
            </div>

            <div className="form-group">
              <span className="form-label">3. Style</span>
              <input
                type="text"
                className="form-input"
                readOnly={mode === 'buyer'}
                value={activeGenerator.classification?.style || ''}
              />
            </div>

            <div className="form-group">
              <span className="form-label">4. Mood</span>
              <input
                type="text"
                className="form-input"
                readOnly={mode === 'buyer'}
                value={activeGenerator.classification?.mood || ''}
              />
            </div>

            <div className="form-group">
              <span className="form-label">5. Industry</span>
              <input
                type="text"
                className="form-input"
                readOnly={mode === 'buyer'}
                value={activeGenerator.classification?.industry || ''}
              />
            </div>

            <div style={{ padding: '8px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '10px', color: 'var(--text-muted)' }}>
              <strong>MGGD Rule:</strong> Classification metadata is immutable for Buyers. Only Makers can define or revise generator taxonomy.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
