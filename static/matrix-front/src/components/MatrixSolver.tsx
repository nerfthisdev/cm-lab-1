import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MatrixSolver = () => {
    const MAX_N_VALUE = 20;

    // States
    const [n, setN] = useState<number | null>(null); // Matrix size
    const [matrix, setMatrix] = useState<string[][]>(
        Array.from({ length: 2 }, () => Array(2).fill(""))
    );
    const [vector, setVector] = useState<string[]>(Array(2).fill(""));
    const [epsilon, setEpsilon] = useState<string>(""); // Epsilon input
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [serverResponse, setServerResponse] = useState<string>(""); // Server response

    // Handle matrix size change
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
                    `Please enter a value between 1 and ${MAX_N_VALUE}.`,
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

    // Update matrix values
    const updateMatrix = (row: number, col: number, value: string) => {
        const newMatrix = matrix.map((row) => [...row]);
        newMatrix[row][col] = value;
        setMatrix(newMatrix);
    };

    // Update vector values
    const updateVector = (index: number, value: string) => {
        const newVector = [...vector];
        newVector[index] = value;
        setVector(newVector);
    };

    // Handle epsilon change
    const handleEpsilonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();
        if (/^\d*\.?\d+$/.test(inputValue) || inputValue === "") {
            setEpsilon(inputValue);
        } else {
            toast.error("Please enter a valid number for epsilon.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    // Send data to the server
    const handleSubmit = async () => {
        if (!n || n <= 0) {
            toast.error("Please specify a valid matrix size.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!epsilon) {
            toast.error("Please specify a valid epsilon value.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        // Validate matrix and vector inputs
        const isValidMatrix = matrix.every((row) =>
            row.every((cell) => cell.trim() !== "")
        );
        const isValidVector = vector.every((value) => value.trim() !== "");

        if (!isValidMatrix || !isValidVector) {
            toast.error(
                "Please fill all matrix and vector fields with valid numbers.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
            return;
        }

        try {
            setLoading(true);

            // Prepare data to send
            const requestData = {
                matrix: matrix.map((row) => row.map(Number)), // Convert strings to numbers
                vector: vector.map(Number), // Convert strings to numbers
                epsilon: parseFloat(epsilon),
            };

            // Send POST request to the Go server
            const response = await axios.post(
                "http://localhost:8080/solve",
                requestData
            );

            // Handle server response
            setServerResponse(JSON.stringify(response.data, null, 2));
            toast.success("Request successful!", {
                position: "top-center",
                autoClose: 3000,
            });
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while processing the request.", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            {/* Matrix Size Input */}
            <div style={{ marginBottom: "20px" }}>
                <label>
                    Matrix size (n):
                    <input
                        type="number"
                        min="1"
                        value={n ?? ""}
                        onChange={handleNChange}
                        style={{ marginLeft: "10px", padding: "5px" }}
                    />
                </label>
            </div>

            {/* Epsilon Input */}
            <div style={{ marginBottom: "20px" }}>
                <label>
                    Epsilon (tolerance):
                    <input
                        type="number"
                        step="any"
                        value={epsilon}
                        onChange={handleEpsilonChange}
                        style={{ marginLeft: "10px", padding: "5px" }}
                    />
                </label>
            </div>

            {/* Matrix and Vector Inputs */}
            {n !== null && n > 0 && (
                <div
                    style={{
                        display: "flex",
                        gap: "30px",
                        alignItems: "flex-start",
                    }}
                >
                    {/* Matrix Input */}
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
                                    style={{ display: "flex", gap: "5px" }}
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

                    {/* Vector Input */}
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

            <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? "none" : "auto",
                }}
            >
                {loading ? "Loading..." : "Solve"}
            </button>

            {serverResponse && (
                <pre
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        whiteSpace: "pre-wrap",
                        overflowX: "auto",
                    }}
                >
                    {serverResponse}
                </pre>
            )}
        </div>
    );
};
