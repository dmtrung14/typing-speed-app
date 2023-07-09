import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import Typing from './Typing';
import Controller from './Controller';
import Countword from './Countword';
import { useNavigate } from 'react-router-dom';

export default function Body() {
    const [seconds, setTime] = useState(15);
    const [ogTime, setOgTime] = useState(seconds)
    const [words, setWords] = useState(25);
    const normal = 25;
    const [started, setStarted] = useState(false);
    const [selectedMode, setSelectedMode] = useState('s');
    const [currWord, setCurrWord] = useState(1)


    const navigate = useNavigate();

    useEffect(() => {
        let interval;

        if ((started && seconds >= 0 && selectedMode.endsWith("s"))) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime === 0) {
                        clearInterval(interval)
                        setStarted(false)
                        navigate("/result")
                        return 0
                    } else {
                        return prevTime - 1
                    }
                })
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [started, seconds])


    const handleKeyDown = (event) => {
        let keyCode = event.keyCode
        if (!started && keyCode >= 65 && keyCode <= 90) {
            setStarted(true)
        }
        if (keyCode === 32){
            setCurrWord(prev => prev + 1)
        }
        // window.removeEventListener('keydown', handleKeyDown)
    }
    // window.addEventListener('keydown', handleKeyDown)
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currWord]);
    const handleModeChange = (mode) => {
        setSelectedMode(mode);
    };

    useEffect(() => {
        if (selectedMode === '15s') {
            setTime(30);
            setOgTime(30)
            setWords(normal);
        } else if (selectedMode === '30s') {
            setTime(60);
            setOgTime(60)
            setWords(normal);
        } else if (selectedMode === '45s') {
            setTime(120);
            setOgTime(120)
            setWords(normal);
        } else if (selectedMode === '25w') {
            setTime(ogTime);
            setWords(60);
        }
        else if (selectedMode === '50w') {
            setTime(ogTime);
            setWords(120);
        } else if (selectedMode === '100w') {
            setTime(ogTime);
            setWords(180);
        }
    }, [selectedMode]);

    return (
        <div className='main-content'>
            {!started && <Controller onModeChange={handleModeChange} />}
            {selectedMode.endsWith("w") ? <Countword word={currWord} totalWord={words} onKeyDown={handleKeyDown}/> : <Countdown time={seconds} onKeyDown={handleKeyDown} />}
            <Typing numWords={words} />
        </div>
    );
}
