import CloseIcon from "@/icons/closeIcon";
import quizDetails from "@/quizDetails.json"
import { useEffect, useState } from "react";

interface IQuestion {
        qId : number,
        question : string,
        options : {
            A : string,
            B : string,
            C : string,
            D : string,
        },
        correctAnswer : string
    };

export default function QuizCard({ eventNo , onReward , setQuiz , currPlayer , visited , isBot , handleQuizClose } : { eventNo : number, onReward : any , setQuiz : any , currPlayer : number , visited : number[] , isBot : boolean , handleQuizClose : any}) {
    
    const [question , setQuestion]  = useState<IQuestion | null>(null);
    
    const [backgroundA , setBackgroundA] = useState("not attempted")
    const [backgroundB , setBackgroundB] = useState("not attempted")
    const [backgroundC , setBackgroundC] = useState("not attempted")
    const [backgroundD , setBackgroundD] = useState("not attempted")
    
    const [tries , setTries] = useState(0)
    
    useEffect(() => {
        const questions = quizDetails[visited[Math.floor(Math.random() * visited.length)]].questions
        const randomQ = questions[Math.floor((Math.random() * questions.length))]
        setQuestion(randomQ)
    } , [])
    
    useEffect(() => {
        if (!isBot || !question) return;

        let options = ["A" , "B" , "C" , "D"];
        let botTries = 0;

        const botAnswer = (opts : string[]) => {
            if(!isBot || !question) return;
            if (opts.length === 0) return;

            const answer = opts[Math.floor(Math.random() * opts.length)];
            const isCorrect = answer === question.correctAnswer;

            switch (answer) {
                case "A": setBackgroundA(isCorrect ? "correct" : "incorrect"); break;
                case "B": setBackgroundB(isCorrect ? "correct" : "incorrect"); break;
                case "C": setBackgroundC(isCorrect ? "correct" : "incorrect"); break;
                case "D": setBackgroundD(isCorrect ? "correct" : "incorrect"); break;
            }

            if(isCorrect) {
                // First correct: 1 gold, second: 1 silver, further: 2 bronze
                if (botTries === 0) {
                    setTimeout(() => onReward(currPlayer, "gold", 1), 0);
                } else if (botTries === 1) {
                    setTimeout(() => onReward(currPlayer, "silver", 1), 0);
                } else {
                    setTimeout(() => onReward(currPlayer, "bronze", 2), 0);
                }

                setTimeout(() => handleQuizClose(), 800);
            } else {
                botTries += 1;
                setTimeout(() => botAnswer(opts.filter((a) => a !== answer)), 900);
            }
        };

        const startTimer = setTimeout(() => botAnswer(options), 10000);
        return () => clearTimeout(startTimer);
    } , [isBot , question, currPlayer, onReward, handleQuizClose])
    if(!question) return

    return <div className={`h-screen w-screen absolute bg-amber-50/50 z-999 ${isBot ? "pointer-events-none": ""}`}>
        <div className="border-14 shadow-[inset_0px_0px_14vh_rgba(0,0,0,0.6)] border-[#990000] mx-auto w-250 mt-20 h-150 bg-quiz-background bg-size-[150vw_150vh] bg-center bg-[#de9a35]">
            <div className="min-h-50 mx-15 mt-8 bg-radial-[at_50%_255%] from-[#f6eee1] from-50% to-70% to-[#f3b75e] rounded-2xl border-10 border-[#0a3d2b] shadow-[inset_0px_0px_2vh_rgba(0,0,0,1)] text-2xl text-center pt-5 text-green-800 font-semibold">
                {question.question}
            </div>
            <div>
                <div className="flex mx-10 mt-8">
                    <div className={`${backgroundA == "correct" ? "text-yellow-300 bg-green-600" : backgroundA != "incorrect" ? "to-[#f3b75e] bg-radial-[at_50%_115%]" : "bg-red-500 text-white "} text-shadow-lg cursor-pointer min-h-20 border-6 border-[#0a3d2b] mx-8 w-full rounded-full  from-[#f6eee1] from-30% to-60%  text-center text-lg pt-5 text-green-800  font-medium`} onClick={() => {
        const correctAnswer = question.correctAnswer;
        
        if("A" == correctAnswer) {
            setBackgroundA("correct")
            if (tries === 0) {
                setTimeout(() => onReward(currPlayer, "gold", 1), 0);
            } else if (tries === 1) {
                setTimeout(() => onReward(currPlayer, "silver", 1), 0);
            } else {
                setTimeout(() => onReward(currPlayer, "bronze", 2), 0);
            }
            setTries(c => c + 1)
            setTimeout(() => handleQuizClose(), 800)
        } else {
            setBackgroundA("incorrect")
            setTries(c => c + 1)
        }
    }}>
                        {question.options.A}
                    </div>
                    <div className={`${backgroundB == "correct" ? "text-yellow-300 bg-green-600" : backgroundB != "incorrect" ? "to-[#f3b75e] bg-radial-[at_50%_115%]" : "bg-red-500 text-white "} text-shadow-lg cursor-pointer min-h-20 border-6 border-[#0a3d2b] mx-8 w-full rounded-full  from-[#f6eee1] from-30% to-60%  text-center text-lg pt-5 text-green-800  font-medium`} onClick={() => {
        const correctAnswer = question.correctAnswer;
        
        if("B" == correctAnswer) {
            setBackgroundB("correct")
            if (tries === 0) {
                setTimeout(() => onReward(currPlayer, "gold", 1), 0);
            } else if (tries === 1) {
                setTimeout(() => onReward(currPlayer, "silver", 1), 0);
            } else {
                setTimeout(() => onReward(currPlayer, "bronze", 2), 0);
            }
            setTries(c => c + 1)
            setTimeout(() => handleQuizClose(), 800)
        } else {
            setBackgroundB("incorrect")
            setTries(c => c + 1)
        }
    }}>
                        {question.options.B}
                    </div>
                </div>
                <div className="flex mx-10 mt-8">
                    <div className={`${backgroundC == "correct" ? "text-yellow-300 bg-green-600" : backgroundC != "incorrect" ? "to-[#f3b75e] bg-radial-[at_50%_115%]" : "bg-red-500 text-white "} text-shadow-lg cursor-pointer min-h-20 border-6 border-[#0a3d2b] mx-8 w-full rounded-full  from-[#f6eee1] from-30% to-60%  text-center text-lg pt-5 text-green-800  font-medium`} onClick={() => {
        const correctAnswer = question.correctAnswer;
        
        if("C" == correctAnswer) {
            setBackgroundC("correct")
            if (tries === 0) {
                setTimeout(() => onReward(currPlayer, "gold", 1), 0);
            } else if (tries === 1) {
                setTimeout(() => onReward(currPlayer, "silver", 1), 0);
            } else {
                setTimeout(() => onReward(currPlayer, "bronze", 2), 0);
            }
            setTries(c => c + 1)
            setTimeout(() => handleQuizClose(), 800)
        } else {
            setBackgroundC("incorrect")
            setTries(c => c + 1)
        }
    }}>
                        {question.options.C}
                    </div>
                    <div className={`${backgroundD == "correct" ? "text-yellow-300 bg-green-600" : backgroundD != "incorrect" ? "to-[#f3b75e] bg-radial-[at_50%_115%]" : "bg-red-500 text-white "} text-shadow-lg cursor-pointer min-h-20 border-6 border-[#0a3d2b] mx-8 w-full rounded-full  from-[#f6eee1] from-30% to-60%  text-center text-lg pt-5 text-green-800  font-medium`} onClick={() => {
        const correctAnswer = question.correctAnswer;
        
        if("D" == correctAnswer) {
            setBackgroundD("correct")
            if (tries === 0) {
                setTimeout(() => onReward(currPlayer, "gold", 1), 0);
            } else if (tries === 1) {
                setTimeout(() => onReward(currPlayer, "silver", 1), 0);
            } else {
                setTimeout(() => onReward(currPlayer, "bronze", 2), 0);
            }
            setTries(c => c + 1)
            setTimeout(() => handleQuizClose(), 800)
        } else {
            setBackgroundD("incorrect")
            setTries(c => c + 1)
        }
    }}>
                        {question.options.D}
                    </div>
                </div>
            </div>
        </div>
    </div>
}
