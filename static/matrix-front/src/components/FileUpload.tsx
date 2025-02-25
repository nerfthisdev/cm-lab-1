import React, { useState } from "react";

export const FileUpload = () => {
    const [fileContent, setFileContent] = useState<string[][]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            if (typeof e.target?.result === "string") {
                const lines = e.target.result.split(/\r?\n/);
                const array2D = lines.map((line) => line.split(/,\s*/));
                setFileContent(array2D);
            }
        };

        reader.onerror = () => {
            console.error("Ошибка при чтении файла");
        };

        reader.readAsText(file);
    };

    return (
        <div>
            <h3>Загрузите файл</h3>
            <input type="file" onChange={handleFileChange} accept=".csv,.txt" />

            {fileContent.length > 0 && (
                <div>
                    <h4>Содержимое файла:</h4>
                    <pre>
                        {fileContent.map((row: any, rowIndex: any) => (
                            <div key={rowIndex}>
                                {row.map((cell: any, cellIndex: any) => (
                                    <span key={cellIndex}>{cell} </span>
                                ))}
                            </div>
                        ))}
                    </pre>
                </div>
            )}
        </div>
    );
};
