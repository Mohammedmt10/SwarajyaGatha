import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizCard from './quizCard';
import '@testing-library/jest-dom';

// Mock icons
jest.mock('@/icons/closeIcon', () => () => <div data-testid="close-icon" />);

// Mock quizDetails.json
jest.mock('@/quizDetails.json', () => ([
    {
        "eventNo": "1",
        "year": "1630",
        "title": "Birth of Shivaji Maharaj",
        "questions": [
            {
                "qId": 1,
                "question": "Test Question 1?",
                "options": {
                    "A": "Option A",
                    "B": "Option B",
                    "C": "Option C",
                    "D": "Option D"
                },
                "correctAnswer": "A"
            }
        ]
    }
]), { virtual: true });

jest.mock('../../quizDetails.json', () => ([
    {
        "eventNo": "1",
        "year": "1630",
        "title": "Birth of Shivaji Maharaj",
        "questions": [
            {
                "qId": 1,
                "question": "Test Question 1?",
                "options": {
                    "A": "Option A",
                    "B": "Option B",
                    "C": "Option C",
                    "D": "Option D"
                },
                "correctAnswer": "A"
            }
        ]
    }
]), { virtual: true });

describe('QuizCard Component', () => {
    const onRewardMock = jest.fn();
    const setQuizMock = jest.fn();
    const handleQuizCloseMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock Math.random to always pick the first element for reproducibility
        jest.spyOn(Math, 'random').mockReturnValue(0);
    });

    afterEach(() => {
        jest.spyOn(Math, 'random').mockRestore();
    });

    it('renders with a random question from visited events', () => {
        render(
            <QuizCard
                eventNo={0}
                onReward={onRewardMock}
                setQuiz={setQuizMock}
                currPlayer={1}
                visited={[0]}
                isBot={false}
                handleQuizClose={handleQuizCloseMock}
            />
        );

        // Debug output to see what's rendered
        // screen.debug();

        expect(screen.getByText(/Test Question 1?/i)).toBeInTheDocument();
        expect(screen.getByText(/Option A/i)).toBeInTheDocument();
        expect(screen.getByText(/Option B/i)).toBeInTheDocument();
    });

    it('calls onReward and handleQuizClose when correct answer is clicked', async () => {
        render(
            <QuizCard
                eventNo={0}
                onReward={onRewardMock}
                setQuiz={setQuizMock}
                currPlayer={1}
                visited={[0]}
                isBot={false}
                handleQuizClose={handleQuizCloseMock}
            />
        );

        const correctOption = screen.getByText(/Option A/i);
        fireEvent.click(correctOption);

        // onReward is called via setTimeout
        await waitFor(() => {
            expect(onRewardMock).toHaveBeenCalledWith(1, "gold", 1);
        }, { timeout: 2000 });

        await waitFor(() => {
            expect(handleQuizCloseMock).toHaveBeenCalled();
        }, { timeout: 2000 });
    });

    it('sets state to incorrect when wrong answer is clicked', async () => {
        render(
            <QuizCard
                eventNo={0}
                onReward={onRewardMock}
                setQuiz={setQuizMock}
                currPlayer={1}
                visited={[0]}
                isBot={false}
                handleQuizClose={handleQuizCloseMock}
            />
        );

        const wrongOption = screen.getByText(/Option B/i);
        fireEvent.click(wrongOption);

        // In the component, it adds "bg-red-500" for incorrect
        // The classes are applied to the same element that has the text
        expect(wrongOption).toHaveClass('bg-red-500');

        expect(onRewardMock).not.toHaveBeenCalled();
    });
});
