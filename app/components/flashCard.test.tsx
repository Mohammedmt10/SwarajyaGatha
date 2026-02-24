import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlashCard from './flashCard';
import '@testing-library/jest-dom';

// Mock icons
jest.mock('@/icons/closeIcon', () => () => <div data-testid="close-icon" />);
jest.mock('@/icons/speakerIcon', () => () => <div data-testid="speaker-icon" />);

jest.mock('../../eventDetails.json', () => ([
    {
        "eventNo": "1",
        "year": "1630",
        "imgUrl": "mock-url",
        "eco": "+",
        "title": "Birth of Shivaji Maharaj",
        "location": "Shivneri Fort",
        "details": {
            "keyFigures": "shahaji",
            "narrative": "test narrative"
        }
    }
]), { virtual: true });

// Mock window.speechSynthesis
const mockCancel = jest.fn();
const mockSpeak = jest.fn();
const mockGetVoices = jest.fn(() => []);

if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'speechSynthesis', {
        value: {
            cancel: mockCancel,
            speak: mockSpeak,
            getVoices: mockGetVoices,
            speaking: false,
        },
        writable: true,
    });

    (global as any).SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
        text,
        voice: null,
        volume: 1,
    }));
}

describe('FlashCard Component', () => {
    const setFlashCardMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with given event details', () => {
        render(
            <FlashCard
                flashCard={true}
                setFlashCard={setFlashCardMock}
                eventDetailsNo={0}
            />
        );

        expect(screen.getByText(/Birth of Shivaji Maharaj/i)).toBeInTheDocument();
        expect(screen.getByText(/1630/i)).toBeInTheDocument();
        expect(screen.getByText(/Shivneri Fort/i)).toBeInTheDocument();
    });

    it('calls setFlashCard(false) when close button is clicked', () => {
        render(
            <FlashCard
                flashCard={true}
                setFlashCard={setFlashCardMock}
                eventDetailsNo={0}
            />
        );

        // The icon is inside a div with onClick
        const closeIcon = screen.getByTestId('close-icon');
        const closeButton = closeIcon.closest('div');

        if (closeButton) {
            fireEvent.click(closeButton);
        }

        expect(setFlashCardMock).toHaveBeenCalledWith(false);
        expect(mockCancel).toHaveBeenCalled();
    });

    it('toggles speech when speaker icon is clicked', () => {
        const { rerender } = render(
            <FlashCard
                flashCard={true}
                setFlashCard={setFlashCardMock}
                eventDetailsNo={0}
            />
        );

        const speakerIcon = screen.getByTestId('speaker-icon');
        const speakerButton = speakerIcon.closest('div');

        // Toggle on
        if (speakerButton) {
            fireEvent.click(speakerButton);
        }

        // Re-render to trigger useEffect for speech
        rerender(
            <FlashCard
                flashCard={true}
                setFlashCard={setFlashCardMock}
                eventDetailsNo={0}
            />
        );

        expect(mockSpeak).toHaveBeenCalled();

        // Toggle off
        if (speakerButton) {
            fireEvent.click(speakerButton);
        }

        rerender(
            <FlashCard
                flashCard={true}
                setFlashCard={setFlashCardMock}
                eventDetailsNo={0}
            />
        );
        expect(mockCancel).toHaveBeenCalled();
    });
});
