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
    // Initial section expanded is 'general'
    expect(screen.getByText(/Välj Språk/i)).toBeInTheDocument();
    
    // Expand 'Appearance'
    const appearanceHeader = screen.getByText(/Utseende/i);
    fireEvent.click(appearanceHeader);
    
    expect(screen.getByText(/Mörkt läge/i)).toBeInTheDocument();
  });

  it('changes language when button clicked', () => {
    render(<FullSettings />);
    const swedishBtn = screen.getByText(/Svenska/i);
    fireEvent.click(swedishBtn);
    
    expect(localStorage.getItem('appLanguage')).toBe('sv');
    expect(global.window.LanguageManager.setLanguage).toHaveBeenCalledWith('sv');
  });

  it('toggles dark mode', () => {
    render(<FullSettings />);
    const appearanceHeader = screen.getByText(/Utseende/i);
    fireEvent.click(appearanceHeader);
    
    const darkModeToggle = screen.getByLabelText(/Mörkt läge/i);
    fireEvent.click(darkModeToggle);
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});