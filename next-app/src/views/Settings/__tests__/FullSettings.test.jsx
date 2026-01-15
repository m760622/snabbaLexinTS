import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FullSettings from '../FullSettings';
import React from 'react';

// Mock global objects
global.window.LanguageManager = { setLanguage: vi.fn() };
global.window.SettingsManager = { update: vi.fn() };

describe('FullSettings Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders correctly with title', () => {
    render(<FullSettings />);
    expect(screen.getByText(/Inställningar/i)).toBeInTheDocument();
  });

  it('toggles section when clicked', () => {
    render(<FullSettings />);
    // Initial section expanded is 'general' - check for language buttons (emoji flags)
    expect(screen.getByText('🇸🇪')).toBeInTheDocument();

    // Expand 'Appearance'
    const appearanceHeader = screen.getByText(/Utseende/i);
    fireEvent.click(appearanceHeader);

    expect(screen.getByText(/Mörkt läge/i)).toBeInTheDocument();
  });

  it('changes language when button clicked', () => {
    render(<FullSettings />);
    // Language buttons display emoji flags, not text
    const swedishBtn = screen.getByText('🇸🇪');
    fireEvent.click(swedishBtn);

    expect(localStorage.getItem('appLanguage')).toBe('sv');
  });

  it('toggles dark mode', () => {
    render(<FullSettings />);
    const appearanceHeader = screen.getByText(/Utseende/i);
    fireEvent.click(appearanceHeader);

    // Find the checkbox inside the dark mode toggle item
    const checkboxes = screen.getAllByRole('checkbox');
    const darkModeToggle = checkboxes[0]; // First checkbox is dark mode
    fireEvent.click(darkModeToggle);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});