import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MatrixSolver = () => {
    const MAX_N_VALUE = 20;

    const [n, setN] = useState<number | null>(null);
    const [matrix, setMatrix] = useState<string[][]>(
        Array.from({ length: 2 }, () => Array(2).fill(""))
    );
    const [vector, setVector] = useState<string[]>(Array(2).fill(""));
    const [epsilon, setEpsilon] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [serverResponseText, setServerResponseText] = useState<string>("");

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();
        let newN: number | null = null;

        if (inputValue === "") {
            newN = null;
        } else {
            const parsedValue = parseInt(inputValue, 10);
            if (
                !isNaN(parsedValue) &&
                parsedValue >= 1 &&
                parsedValue <= MAX_N_VALUE
            ) {
                newN = parsedValue;
            } else {
                toast.error(
                    `Пожалуйста, введите значение от 1 до ${MAX_N_VALUE}.`,
                    {
                        position: "top-center",
                        autoClose: 3000,
                    }
                );
                return;
            }
        }

        setN(newN);

        if (newN !== null) {
            setMatrix(Array.from({ length: newN }, () => Array(newN).fill("")));
            setVector(Array(newN).fill(""));
        }
    };

    const updateMatrix = (row: number, col: number, value: string) => {
        const newMatrix = matrix.map((row) => [...row]);
        newMatrix[row][col] = value;
        setMatrix(newMatrix);
    };

    const updateVector = (index: number, value: string) => {
        const newVector = [...vector];
        newVector[index] = value;
        setVector(newVector);
    };

    const handleEpsilonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();
        if (/^\d*\.?\d+$/.test(inputValue) || inputValue === "") {
            setEpsilon(inputValue);
        } else {
            toast.error("Пожалуйста, введите корректное число для точности.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const handleSubmit = async () => {
        if (!n || n <= 0) {
            toast.error("Пожалуйста, укажите корректный размер матрицы.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!epsilon) {
            toast.error("Пожалуйста, укажите корректное значение точности.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        const isValidMatrix = matrix.every((row) =>
            row.every((cell) => cell.trim() !== "")
        );
        const isValidVector = vector.every((value) => value.trim() !== "");

        if (!isValidMatrix || !isValidVector) {
            toast.error(
                "Пожалуйста, заполните все поля матрицы и вектора корректными числами.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
            return;
        }

        try {
            setLoading(true);
            const startTime = Date.now();

            const requestData = {
                matrix: matrix.map((row) => row.map(Number)),
                vector: vector.map(Number),
                epsilon: parseFloat(epsilon),
            };

            const response = await axios.post(
                "http://localhost:5176/solve",
                requestData
            );

            const endTime = Date.now();
            const elapsedTime = endTime - startTime;

            const data = response.data;
            const formattedResponse = `
Было ли до этого диагональное преобладание: ${data.alreadyHas ? "Да" : "Нет"}
Строго ли выполняется условие: ${data.flag ? "Да" : "Нет"}
Удалось ли достичь диагонального преобладания: ${data.success ? "Да" : "Нет"}
Норма матрицы C: ${data.norm.toFixed(4)}
Вектор решений: [${data.solution.join(", ")}]
Количество итераций: ${data.iterations}
Вектор ошибок: [${data.errors.slice(0, 10).join(", ")}...]
Время работы: ${elapsedTime} мс
`;

            setServerResponseText(formattedResponse);
            toast.success("Запрос выполнен успешно!", {
                position: "top-center",
                autoClose: 3000,
            });
        } catch (error) {
            console.error(error);
            toast.error("Произошла ошибка при обработке запроса.", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ padding: "20px", fontFamily: "Arial" }}>
                <div style={{ marginBottom: "20px" }}>
                    <label>
                        Размер матрицы (n):
                        <input
                            type="number"
                            min="1"
                            value={n ?? ""}
                            onChange={handleNChange}
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label>
                        Точность (epsilon):
                        <input
                            type="number"
                            step="any"
                            value={epsilon}
                            onChange={handleEpsilonChange}
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {n !== null && n > 0 && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "30px",
                            }}
                        >
                            <div style={{ position: "relative" }}>
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "-15px",
                                        top: "0",
                                        height: "100%",
                                        borderLeft: "2px solid #666",
                                        borderRight: "2px solid #666",
                                        width: "10px",
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "5px",
                                    }}
                                >
                                    {matrix.map((row, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: "flex",
                                                gap: "5px",
                                            }}
                                        >
                                            {row.map((cell, j) => (
                                                <input
                                                    key={`${i}-${j}`}
                                                    type="number"
                                                    value={cell}
                                                    onChange={(e) =>
                                                        updateMatrix(
                                                            i,
                                                            j,
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{
                                                        width: "50px",
                                                        padding: "5px",
                                                        textAlign: "center",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ position: "relative" }}>
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "-15px",
                                        top: "0",
                                        height: "100%",
                                        borderLeft: "2px solid #666",
                                        width: "10px",
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "5px",
                                    }}
                                >
                                    {vector.map((value, i) => (
                                        <input
                                            key={i}
                                            type="number"
                                            value={value}
                                            onChange={(e) =>
                                                updateVector(i, e.target.value)
                                            }
                                            style={{
                                                width: "50px",
                                                padding: "5px",
                                                textAlign: "center",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        marginTop: "15px",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        opacity: loading ? 0.5 : 1,
                        pointerEvents: loading ? "none" : "auto",
                    }}
                >
                    {loading ? "Загрузка..." : "Решить"}
                </button>
            </div>
            {serverResponseText && (
                <pre
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        backgroundColor: "#000",
                        color: "#fff",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        whiteSpace: "pre-wrap",
                        overflowX: "auto",
                        overflowY: "auto",

                        wordBreak: "break-word",
                    }}
                >
                    {serverResponseText}
                </pre>
            )}
        </>
    );
};
