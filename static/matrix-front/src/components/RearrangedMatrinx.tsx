interface Props {
    board: number[][] | null;
}

export const RearrangedMatrix = ({ board }: Props) => {
    if (board === null) {
        return <></>;
    }

    return (
        <div
            style={{
                backgroundColor: "#1e1e1e", // Темный фон для контейнера
                color: "#ffffff", // Светлый текст
                padding: "10px", // Отступы внутри контейнера
                borderRadius: "5px", // Закругленные углы
                fontFamily: "monospace", // Моноширинный шрифт для лучшего восприятия матрицы
            }}
        >
            {board.map((row, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        justifyContent: "center", // Центрирование строк
                        marginBottom: "4px", // Отступ между строками
                    }}
                >
                    {row.map((col, j) => (
                        <span
                            key={j}
                            style={{
                                padding: "8px", // Внутренний отступ для ячейки
                                margin: "2px", // Внешний отступ между ячейками
                                backgroundColor: "#333", // Темный фон для ячейки
                                color: "#fff", // Светлый текст для ячейки
                                borderRadius: "3px", // Закругленные углы для ячейки
                                minWidth: "20px", // Минимальная ширина для выравнивания
                                textAlign: "center", // Центрирование текста внутри ячейки
                            }}
                        >
                            {col}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};
