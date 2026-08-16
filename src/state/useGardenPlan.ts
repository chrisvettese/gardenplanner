import { useCallback, useReducer } from 'react';
import type { Cell, GardenPlan, Note } from '../types';
import { createEmptyPlan } from '../types';

export const DEFAULT_CELL_COLOR = '#d7ecc8';
export const DEFAULT_NOTE_COLOR = '#fff8d6';
export const DEFAULT_CELL_FONT_SIZE = 11;
export const MIN_CELL_FONT_SIZE = 4;
export const MAX_CELL_FONT_SIZE = 28;
const MAX_RECENT_COLORS = 10;

type Selection = { type: 'cell' | 'note'; id: string } | null;

interface State {
  plan: GardenPlan;
  dirty: boolean;
  selection: Selection;
  recentColors: string[];
}

type Action =
  | { type: 'LOAD_PLAN'; plan: GardenPlan }
  | { type: 'NEW_PLAN' }
  | { type: 'SET_NAME'; name: string }
  | { type: 'ADD_CELL'; x: number; y: number }
  | { type: 'UPDATE_CELL'; id: string; patch: Partial<Pick<Cell, 'color' | 'text' | 'fontSize' | 'plants'>> }
  | { type: 'DELETE_CELL'; id: string }
  | { type: 'ADD_NOTE'; x: number; y: number; width?: number; height?: number; image?: string }
  | { type: 'UPDATE_NOTE'; id: string; patch: Partial<Pick<Note, 'color' | 'text' | 'x' | 'y' | 'width' | 'height'>> }
  | { type: 'DELETE_NOTE'; id: string }
  | { type: 'SELECT'; selection: Selection }
  | { type: 'MARK_SAVED' };

function pushRecentColor(colors: string[], color: string): string[] {
  const next = [color, ...colors.filter((c) => c !== color)];
  return next.slice(0, MAX_RECENT_COLORS);
}

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_PLAN':
      return { plan: action.plan, dirty: false, selection: null, recentColors: [] };
    case 'NEW_PLAN':
      return { plan: createEmptyPlan(), dirty: false, selection: null, recentColors: [] };
    case 'SET_NAME':
      return { ...state, plan: { ...state.plan, name: action.name }, dirty: true };
    case 'ADD_CELL': {
      const cell: Cell = { id: newId(), x: action.x, y: action.y, color: DEFAULT_CELL_COLOR, text: '', fontSize: DEFAULT_CELL_FONT_SIZE, plants: [] };
      return {
        ...state,
        plan: { ...state.plan, cells: [...state.plan.cells, cell] },
        dirty: true,
        selection: { type: 'cell', id: cell.id },
      };
    }
    case 'UPDATE_CELL': {
      const cells = state.plan.cells.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c));
      const recentColors = action.patch.color ? pushRecentColor(state.recentColors, action.patch.color) : state.recentColors;
      return { ...state, plan: { ...state.plan, cells }, dirty: true, recentColors };
    }
    case 'DELETE_CELL': {
      const cells = state.plan.cells.filter((c) => c.id !== action.id);
      const selection = state.selection?.id === action.id ? null : state.selection;
      return { ...state, plan: { ...state.plan, cells }, dirty: true, selection };
    }
    case 'ADD_NOTE': {
      const note: Note = {
        id: newId(),
        x: action.x,
        y: action.y,
        width: action.width ?? 220,
        height: action.height ?? 140,
        color: DEFAULT_NOTE_COLOR,
        text: '',
        image: action.image,
      };
      return {
        ...state,
        plan: { ...state.plan, notes: [...state.plan.notes, note] },
        dirty: true,
        selection: { type: 'note', id: note.id },
      };
    }
    case 'UPDATE_NOTE': {
      const notes = state.plan.notes.map((n) => (n.id === action.id ? { ...n, ...action.patch } : n));
      const recentColors = action.patch.color ? pushRecentColor(state.recentColors, action.patch.color) : state.recentColors;
      return { ...state, plan: { ...state.plan, notes }, dirty: true, recentColors };
    }
    case 'DELETE_NOTE': {
      const notes = state.plan.notes.filter((n) => n.id !== action.id);
      const selection = state.selection?.id === action.id ? null : state.selection;
      return { ...state, plan: { ...state.plan, notes }, dirty: true, selection };
    }
    case 'SELECT':
      return { ...state, selection: action.selection };
    case 'MARK_SAVED':
      return { ...state, dirty: false };
    default:
      return state;
  }
}

function initState(): State {
  return { plan: createEmptyPlan(), dirty: false, selection: null, recentColors: [] };
}

export function useGardenPlan() {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  const loadPlan = useCallback((plan: GardenPlan) => dispatch({ type: 'LOAD_PLAN', plan }), []);
  const newPlan = useCallback(() => dispatch({ type: 'NEW_PLAN' }), []);
  const setName = useCallback((name: string) => dispatch({ type: 'SET_NAME', name }), []);
  const addCell = useCallback((x: number, y: number) => dispatch({ type: 'ADD_CELL', x, y }), []);
  const updateCell = useCallback((id: string, patch: Partial<Pick<Cell, 'color' | 'text' | 'fontSize' | 'plants'>>) => dispatch({ type: 'UPDATE_CELL', id, patch }), []);
  const deleteCell = useCallback((id: string) => dispatch({ type: 'DELETE_CELL', id }), []);
  const addNote = useCallback(
    (x: number, y: number, opts?: { width?: number; height?: number; image?: string }) =>
      dispatch({ type: 'ADD_NOTE', x, y, ...opts }),
    [],
  );
  const updateNote = useCallback(
    (id: string, patch: Partial<Pick<Note, 'color' | 'text' | 'x' | 'y' | 'width' | 'height'>>) => dispatch({ type: 'UPDATE_NOTE', id, patch }),
    [],
  );
  const deleteNote = useCallback((id: string) => dispatch({ type: 'DELETE_NOTE', id }), []);
  const select = useCallback((selection: Selection) => dispatch({ type: 'SELECT', selection }), []);
  const markSaved = useCallback(() => dispatch({ type: 'MARK_SAVED' }), []);

  return {
    plan: state.plan,
    dirty: state.dirty,
    selection: state.selection,
    recentColors: state.recentColors,
    loadPlan,
    newPlan,
    setName,
    addCell,
    updateCell,
    deleteCell,
    addNote,
    updateNote,
    deleteNote,
    select,
    markSaved,
  };
}
