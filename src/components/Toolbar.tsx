interface ToolbarProps {
  planName: string;
  dirty: boolean;
  fileName: string | null;
  scale: number;
  canSaveInPlace: boolean;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onNameChange: (name: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onAddNote: () => void;
}

export default function Toolbar({
  planName,
  dirty,
  fileName,
  scale,
  canSaveInPlace,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onNameChange,
  onZoomIn,
  onZoomOut,
  onFitView,
  onAddNote,
}: ToolbarProps) {
  return (
    <header className="gp-toolbar">
      <span className="gp-toolbar__brand">🌱 Garden Planner</span>

      <input
        className="gp-toolbar__name"
        value={planName}
        onChange={(e) => onNameChange(e.target.value)}
        aria-label="Garden plan name"
      />

      <div className="gp-toolbar__group">
        <button type="button" className="gp-btn" onClick={onNew}>
          New
        </button>
        <button type="button" className="gp-btn" onClick={onOpen}>
          Open…
        </button>
        <button type="button" className="gp-btn gp-btn--primary" onClick={onSave}>
          {canSaveInPlace ? 'Save' : 'Save…'}
        </button>
        <button type="button" className="gp-btn" onClick={onSaveAs}>
          Save As…
        </button>
      </div>

      <div className="gp-toolbar__group">
        <button type="button" className="gp-btn" onClick={onAddNote}>
          + Note
        </button>
      </div>

      <div className="gp-toolbar__group">
        <button type="button" className="gp-btn" onClick={onZoomOut} aria-label="Zoom out">
          −
        </button>
        <span className="gp-toolbar__zoom">{Math.round(scale * 100)}%</span>
        <button type="button" className="gp-btn" onClick={onZoomIn} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="gp-btn" onClick={onFitView}>
          Fit
        </button>
      </div>

      <span className="gp-toolbar__status">
        {fileName ? fileName : 'unsaved'}
        {dirty ? ' •' : ''}
      </span>
    </header>
  );
}
