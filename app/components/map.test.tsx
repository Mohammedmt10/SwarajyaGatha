import React from 'react';
import { render } from '@testing-library/react';
import Map from './map';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />
}));

describe('Map Component', () => {
    it('renders player pawns at the correct positions', () => {
        const pawnInfo = [
            { player: 1, eventNo: 1 },
            { player: 2, eventNo: 6 }
        ];

        render(<Map pawnInfo={pawnInfo} />);

        // Check if event slots exist
        const event1Slot = document.getElementById('event1');
        const event6Slot = document.getElementById('event6');

        expect(event1Slot).toBeInTheDocument();
        expect(event6Slot).toBeInTheDocument();

        // Check if images (pawns) are inside the correct slots
        const pawn1 = event1Slot?.querySelector('img');
        expect(pawn1).toBeInTheDocument();

        const pawn2 = event6Slot?.querySelector('img');
        expect(pawn2).toBeInTheDocument();
    });

    it('handles multiple players on the same tile', () => {
        const pawnInfo = [
            { player: 1, eventNo: 1 },
            { player: 2, eventNo: 1 }
        ];

        render(<Map pawnInfo={pawnInfo} />);

        const event1Slot = document.getElementById('event1');
        const pawns = event1Slot?.querySelectorAll('img');
        expect(pawns?.length).toBe(2);
    });

    it('handles bot state correctly', () => {
        const pawnInfo = [
            { player: 1, eventNo: 'bot' } as any
        ];

        render(<Map pawnInfo={pawnInfo} />);

        // No pawns should be rendered in event slots if eventNo is "bot"
        const allPawns = document.querySelectorAll('img');
        expect(allPawns.length).toBe(0);
    });
});
