import { useEffect, useRef } from 'react';
import { MAX_CELL_FONT_SIZE, MIN_CELL_FONT_SIZE } from '../state/useGardenPlan';
import { MAX_PLANTS_PER_CELL, PLANT_CATALOG, getPlant } from '../plants/catalog';

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
  /** Only squares have an adjustable font size and a plant picker; omit both for notes. */
  fontSize?: number;
  onChangeFontSize?: (fontSize: number) => void;
  plants?: string[];
  onChangePlants?: (plants: string[]) => void;
  /** Only notes support Markdown rendering; omit for squares. */
  markdown?: boolean;
  onChangeMarkdown?: (markdown: boolean) => void;
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
  plants,
  onChangePlants,
  markdown,
  onChangeMarkdown,
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
      {markdown !== undefined && onChangeMarkdown && (
        <label className="gp-popover__markdown">
          <input type="checkbox" checked={markdown} onChange={(e) => onChangeMarkdown(e.target.checked)} />
          Render as Markdown
        </label>
      )}
      {plants !== undefined && onChangePlants && (
        <div className="gp-popover__plants">
          <div className="gp-popover__plants-header">
            <span>Plants</span>
            <span className="gp-popover__plants-count">
              {plants.length}/{MAX_PLANTS_PER_CELL}
            </span>
          </div>
          <div className="gp-plant-palette">
            {PLANT_CATALOG.map((p) => {
              const Icon = p.Icon;
              const full = plants.length >= MAX_PLANTS_PER_CELL;
              return (
                <button
                  key={p.id}
                  type="button"
                  className="gp-plant-palette__btn"
                  disabled={full}
                  title={`Add ${p.label}`}
                  onClick={() => onChangePlants([...plants, p.id])}
                >
                  <Icon />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
          {plants.length > 0 && (
            <div className="gp-plant-selected">
              {plants.map((id, i) => {
                const plant = getPlant(id);
                if (!plant) return null;
                const Icon = plant.Icon;
                return (
                  <div className="gp-plant-selected__chip" key={`${id}-${i}`}>
                    <Icon />
                    <span>{plant.label}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${plant.label}`}
                      onClick={() => onChangePlants(plants.filter((_, idx) => idx !== i))}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
        <span className="gp-swatch gp-swatch--custom" title="Custom color">
          <input
            type="color"
            className="gp-swatch--custom-input"
            value={color}
            onChange={(e) => onChangeColor(e.target.value)}
            aria-label="Custom color"
          />
        </span>
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
