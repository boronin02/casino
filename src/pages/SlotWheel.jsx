import React, { useState, useEffect, useContext } from "react";
import { WebSocketContext } from "../App";

const SlotWheel = () => {
    const [currentRotation, setCurrentRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [targetRotation, setTargetRotation] = useState(null);
    const { socketWheel } = useContext(WebSocketContext);

    // Массив чисел на колесе
    const numbers = [20, 1, 3, 1, 5, 1, 3, 1, 10, 1, 3, 1, 5, 1, 5, 3, 1, 10, 1, 3, 1, 5, 1, 3, 1];
    const sectorAngle = 360 / numbers.length; // Угол одного сектора
    const offset = 90; // Смещение для начального сектора

    // Нормализация угла (чтобы оставался в диапазоне 0–359 градусов)
    const normalizeAngle = (angle) => (angle % 360 + 360) % 360;

    // Вычисление целевого угла на основе индекса сектора
    const calculateTargetRotation = (index) => {
        const baseRotation = index * sectorAngle - offset; // Угол для целевого сектора
        const currentNormalized = normalizeAngle(currentRotation); // Нормализованный текущий угол
        const fullRotations = Math.ceil((currentNormalized + 360) / 360); // Полные обороты

        return fullRotations * 360 + baseRotation; // Целевой угол с учетом полного вращения
    };

    useEffect(() => {
        if (socketWheel) {
            const handleMessage = (event) => {
                const message = JSON.parse(event.data);

                if (message.status === "start") {
                    startSpinning();
                } else if (message.status === "stop" && message.result !== null) {
                    const target = calculateTargetRotation(message.result);
                    if (target !== null) {
                        setTargetRotation(target);
                        stopSpinning();
                    }
                }
            };

            socketWheel.addEventListener("message", handleMessage);
            return () => socketWheel.removeEventListener("message", handleMessage);
        }
    }, [socketWheel, currentRotation]);

    const startSpinning = () => {
        setIsSpinning(true);
        setTargetRotation(null);
        setResult(null);

        window.spinInterval = setInterval(() => {
            setCurrentRotation((prev) => prev + 10);
        }, 20);
    };

    const stopSpinning = () => {
        clearInterval(window.spinInterval); // Останавливаем равномерное вращение

        // Функция для плавного замедления
        const deceleration = () => {
            setCurrentRotation((prev) => {
                const normalizedCurrent = normalizeAngle(prev);
                const normalizedTarget = normalizeAngle(targetRotation);

                // Условие завершения вращения (если текущий угол близок к целевому)
                if (Math.abs(normalizedCurrent - normalizedTarget) <= 1) {
                    finalizeWheel(targetRotation); // Устанавливаем итоговый угол
                    return targetRotation;
                }

                // Замедление вращения: скорость уменьшается по мере приближения
                const speed = Math.max(1, Math.abs(normalizedCurrent - normalizedTarget) / 10);
                return prev + (normalizedCurrent < normalizedTarget ? speed : -speed);
            });

            // Повторяем замедление, пока колесо не остановится
            if (isSpinning) setTimeout(deceleration, 20);
        };

        deceleration();
    };

    const finalizeWheel = (finalAngle) => {
        const normalizedAngle = normalizeAngle(finalAngle); // Нормализуем итоговый угол
        const sectorIndex = Math.floor(normalizedAngle / sectorAngle); // Определяем сектор
        const resultNumber = numbers[sectorIndex]; // Получаем результат

        setIsSpinning(false); // Останавливаем вращение
        setResult(resultNumber); // Устанавливаем результат
        console.log(`Итоговый угол: ${normalizedAngle}, Выпавшее число: ${resultNumber}`);
    };


    return (
        <div className="slot-wheel">
            <div className="wheel-container" style={{ position: "relative", width: "300px", height: "300px" }}>
                <div
                    className="wheel"
                    style={{
                        transform: `rotate(${currentRotation}deg)`,
                        transition: !isSpinning ? "transform 2s cubic-bezier(0.4, 0.0, 0.2, 1)" : "none",
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
