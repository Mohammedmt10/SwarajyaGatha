import * as http from 'http';
import * as fs from 'fs';

// Mock ws
const mockWss = {
    on: jest.fn(),
};

jest.mock('ws', () => {
    return {
        __esModule: true,
        default: {
            Server: jest.fn().mockImplementation(() => mockWss),
            OPEN: 1
        },
        Server: jest.fn().mockImplementation(() => mockWss),
        OPEN: 1
    };
});

import WebSocket from 'ws';

jest.mock('http');
jest.mock('fs');

// Mock eventDetails.json
const mockEventDetails = Array.from({ length: 31 }, (_, i) => ({
    eventNo: (i + 1).toString(),
    eco: i % 2 === 0 ? "+" : "-"
}));

(fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockEventDetails));

// Mock http server
const mockServer = {
    listen: jest.fn()
};
(http.createServer as jest.Mock).mockReturnValue(mockServer);

describe('WebSocket Server Logic', () => {
    let connectionHandler: any;

    beforeAll(() => {
        // Require server.js here once
        try {
            require('./server.js');
        } catch (e) {
            // Ignore
        }
        const call = mockWss.on.mock.calls.find((c: any) => c[0] === 'connection');
        if (call) connectionHandler = call[1];
    });

    beforeEach(() => {
        // Do NOT clear all mocks if it clears mockWss.on
        // Instead, just clear the send/on mocks on ws if needed
    });

    function createMockWs() {
        return {
            send: jest.fn(),
            on: jest.fn(),
            readyState: 1 // WebSocket.OPEN
        };
    }

    it('should handle new connections and assign player indices', () => {
        const mockWs1 = createMockWs();
        const mockReq1 = { url: '/?room=room1&clientId=c1' } as any;

        connectionHandler(mockWs1, mockReq1);

        expect(mockWs1.send).toHaveBeenCalled();
        const initMsg1 = JSON.parse(mockWs1.send.mock.calls[0][0]);
        expect(initMsg1.type).toBe('init');
        expect(initMsg1.playerIndex).toBe(1);

        const mockWs2 = createMockWs();
        const mockReq2 = { url: '/?room=room1&clientId=c2' } as any;

        connectionHandler(mockWs2, mockReq2);
        const initMsg2 = JSON.parse(mockWs2.send.mock.calls[0][0]);
        expect(initMsg2.playerIndex).toBe(2);
    });

    it('should handle roll message and update game state', () => {
        const mockWs1 = createMockWs();
        const mockReq1 = { url: '/?room=roll-room&clientId=c1' } as any;
        connectionHandler(mockWs1, mockReq1);

        const mockWs2 = createMockWs();
        const mockReq2 = { url: '/?room=roll-room&clientId=c2' } as any;
        connectionHandler(mockWs2, mockReq2);

        // Get the "message" handler for player 1
        const messageHandler = (mockWs1.on as jest.Mock).mock.calls.find(call => call[0] === 'message')[1];

        // Mock Math.random to control the roll
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.9); // All shells true -> move by 4

        messageHandler(JSON.stringify({ type: 'roll' }));

        // Check if state was broadcasted
        expect(mockWs1.send).toHaveBeenCalled();
        const lastMsg = JSON.parse(mockWs1.send.mock.calls[mockWs1.send.mock.calls.length - 1][0]);
        expect(lastMsg.type).toBe('state');
        expect(lastMsg.state.currPlayer).toBe(2); // Turn passed
        expect(lastMsg.state.playerInfo[0].eventNo).toBe(5); // 1 + 4 = 5

        randomSpy.mockRestore();
    });

    it('should handle rewardCoins message', () => {
        const mockWs = createMockWs();
        const mockReq = { url: '/?room=reward-room&clientId=c1' } as any;
        connectionHandler(mockWs, mockReq);

        const messageHandler = (mockWs.on as jest.Mock).mock.calls.find(call => call[0] === 'message')[1];

        messageHandler(JSON.stringify({
            type: 'rewardCoins',
            playerIndex: 1,
            coinType: 'gold',
            amount: 5
        }));

        const lastMsg = JSON.parse(mockWs.send.mock.calls[mockWs.send.mock.calls.length - 1][0]);
        expect(lastMsg.state.playerInfo[0].eco.gold).toBe(7); // Initial 2 + 5 = 7
    });
});
