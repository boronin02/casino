import React, { useState, useEffect, useContext } from "react";
import { WebSocketContext } from "../App";

const SlotWheel = () => {
    const [currentRotation, setCurrentRotation] = useState(0); // Угол вращения
    const [isSpinning, setIsSpinning] = useState(false); // Флаг вращения
    const [result, setResult] = useState(null); // Результат
    const { socketWheel } = useContext(WebSocketContext); // WebSocket

    const numbers = [20, 1, 3, 1, 5, 1, 3, 1, 10, 1, 3, 1, 5, 1, 5, 3, 1, 10, 1, 3, 1, 5, 1, 3, 1]; // Числа на колесе
    const sectorAngle = 360 / numbers.length; // Угол каждого сектора
    const offset = 90; // Смещение начала (0-360 градусов)

    const normalizeAngle = (angle) => {
        return ((angle % 360) + 360) % 360; // Нормализация угла
    };

    const calculateResult = (rotation) => {
        const normalizedRotation = normalizeAngle(rotation); // Нормализуем угол
        const adjustedRotation = (normalizedRotation + sectorAngle / 2) % 360; // Смещение для более точного определения сектора
        const sectorIndex = Math.floor(adjustedRotation / sectorAngle); // Индекс сектора
        return numbers[sectorIndex]; // Возвращаем число из сектора
    };


    useEffect(() => {
        if (socketWheel) {
            const handleMessage = (event) => {
                const message = JSON.parse(event.data);

                if (message.result === "start") {
                    startSpinning();
                } else if (message.result === "stopping") {
                    stopSpinning();
                } else if (message.result === "stop") {
                    finalizeWheel();
                }
            };

            socketWheel.addEventListener("message", handleMessage);
            return () => {
                socketWheel.removeEventListener("message", handleMessage);
            };
        }
    }, [socketWheel]);

    // Начало вращения
    const startSpinning = () => {
        setIsSpinning(true);
        const spinInterval = setInterval(() => {
            setCurrentRotation((prev) => prev + 10); // Плавное увеличение угла
        }, 20);
        window.spinInterval = spinInterval;
    };

    // Остановка вращения с замедлением
    const stopSpinning = () => {
        clearInterval(window.spinInterval); // Останавливаем вращение
        let deceleration = 10; // Начальное значение замедления
        const decelerate = () => {
            if (deceleration > 1) {
                setCurrentRotation((prev) => prev + deceleration); // Уменьшаем скорость вращения
                deceleration -= 0.5; // Уменьшаем скорость замедления
                setTimeout(decelerate, 50); // Задержка для постепенного уменьшения скорости
            } else {
                finalizeWheel(); // Завершаем вращение
            }
        };
        decelerate();
    };

    // Завершение и расчет результата
    const finalizeWheel = () => {
        const finalRotation = currentRotation % 360; // Итоговый угол после вращения
        const resultNumber = calculateResult(finalRotation); // Определение результата
        setIsSpinning(false);
        setResult(resultNumber); // Сохраняем результат
        console.log(`Final Rotation: ${finalRotation}, Result Number: ${resultNumber}`);
    };

    return (
        <div className="slot-wheel">
            <div className="wheel-container" style={{ position: "relative", width: "300px", height: "300px" }}>
                <div
                    className="wheel"
                    style={{
                        transform: `rotate(${currentRotation}deg)`,
                        transition: isSpinning ? "none" : "transform 2s cubic-bezier(0.4, 0.0, 0.2, 1)",
                        width: "100%",
                        height: "100%",
                    }}
                />
                <div className="arrow" />
            </div>
            {result !== null && <p className="result">Результат: {result}</p>}
        </div>
    );
};

export default SlotWheel;
