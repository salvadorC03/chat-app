import {useState, useEffect} from 'react';

const AudioTimer = () => {
    const [time, setTime] = useState(0);
    const [timerOn, setTimerOn] = useState(false);

    useEffect(() => {
        setTimerOn(true);
    }, [])

    useEffect(() => {
        let interval = null;

        if (timerOn) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 10);
            }, 10)
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerOn])

    return (
        <>
            <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
            <span>{("0" + ((time / 60000) % 60)).slice(-2)}</span>
        </>
    )
};

export default AudioTimer;