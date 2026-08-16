import { useEffect, useRef } from 'react';
import { MAX_CELL_FONT_SIZE, MIN_CELL_FONT_SIZE } from '../state/useGardenPlan';

const PRESET_COLORS = ['#d7ecc8', '#bfe3f0', '#f7d6e0', '#fff2b3', '#e3d5f5', '#ffd9b3', '#ffffff', '#d9d9d9'];

interface EditPopoverProps {
  x: number;
  y: number;
  text: string;
  color: string;
  recentColors: string[];
  deleteLabel: string;
  onChangeText: (text: string) => void;
  onChangeColor: (color: string) => void;
  onDelete: () => void;
  onClose: () => void;
  /** Only squares have an adjustable font size; omit for notes. */
  fontSize?: number;
  onChangeFontSize?: (fontSize: number) => void;
}

export default function EditPopover({
  x,
  y,
  text,
  color,
  recentColors,
  deleteLabel,
  onChangeText,
  onChangeColor,
  onDelete,
  onClose,
  fontSize,
  onChangeFontSize,
}: EditPopoverProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textRef.current?.focus();
    textRef.current?.select();
  }, []);

  const swatches = [...new Set([...recentColors, ...PRESET_COLORS])].slice(0, 12);

  return (
    <div className="gp-popover" style={{ left: x, top: y }} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      <textarea
        ref={textRef}
        className="gp-popover__text"
        value={text}
        placeholder="Label…"
        onChange={(e) => onChangeText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      />
      {fontSize !== undefined && onChangeFontSize && (
        <div className="gp-popover__fontsize">
          <span>Font size</span>
          <button
            type="button"
            className="gp-btn"
            aria-label="Decrease font size"
            disabled={fontSize <= MIN_CELL_FONT_SIZE}
            onClick={() => onChangeFontSize(Math.max(MIN_CELL_FONT_SIZE, fontSize - 1))}
          >
            −
          </button>
          <span className="gp-popover__fontsize-value">{fontSize}px</span>
          <button
            type="button"
            className="gp-btn"
            aria-label="Increase font size"
            disabled={fontSize >= MAX_CELL_FONT_SIZE}
            onClick={() => onChangeFontSize(Math.min(MAX_CELL_FONT_SIZE, fontSize + 1))}
          >
            +
          </button>
        </div>
      )}
      <div className="gp-popover__swatches">
        {swatches.map((c) => (
          <button
            key={c}
            type="button"
            className={`gp-swatch${c.toLowerCase() === color.toLowerCase() ? ' gp-swatch--active' : ''}`}
            style={{ background: c }}
            aria-label={`Set color ${c}`}
            onClick={() => onChangeColor(c)}
          />
        ))}
        <input
          type="color"
          className="gp-swatch gp-swatch--custom"
          value={color}
          onChange={(e) => onChangeColor(e.target.value)}
          title="Custom color"
        />
      </div>
      <div className="gp-popover__actions">
        <button type="button" className="gp-btn gp-btn--danger" onClick={onDelete}>
          {deleteLabel}
        </button>
        <button type="button" className="gp-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
