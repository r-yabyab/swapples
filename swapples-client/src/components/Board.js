import { useState } from "react";
import Cell from "./Cell";

const generateInitialBoard = (rows, cols) => {
    const items = ["🍒", "🍇", "🍉", "🍋", "🍌"]; // Example items

    const board = Array.from({ length: rows }, () => Array(cols).fill(null));

    const getRandomItem = () => items[Math.floor(Math.random() * items.length)];

    const isMatch = (board, row, col) => {
        const item = board[row][col];

        // Check horizontal match (2 to the left of the current cell)
        if (col >= 2 && board[row][col - 1] === item && board[row][col - 2] === item) {
            return true;
        }

        // Check vertical match (2 above the current cell)
        if (row >= 2 && board[row - 1][col] === item && board[row - 2][col] === item) {
            return true;
        }

        return false;
    };

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let item;
            do {
                item = getRandomItem();
                board[row][col] = item;
            } while (isMatch(board, row, col));
        }
    }

    return board;
};

export default function Board ({ rows, cols, setTracking })  {
    const [board, setBoard] = useState(generateInitialBoard(rows, cols))
    const [selectedCell, setSelectedCell] = useState(null);

    const handleCellClick = (row, col) => {
        // if specify board[row][col] in setTrackings, they will point to the same fruit for some reason
        // only shows the separate fruits with const item
        const item = board[row][col];
        
        if (!selectedCell) {
            setSelectedCell({ row, col });
            setTracking(prevState => ({
                initialCell: `Row ${row}, Col ${col} ${item}`,
                count: prevState.count
              }));
        } else {

            const selectedItem = board[selectedCell.row][selectedCell.col];
            swapCells(selectedCell, { row, col });
            setTracking(prevState => ({
                ...prevState,
                targetCell: `Selected Cell @ row ${selectedCell.row}, col ${selectedCell.col} (${selectedItem}), Swapped with cell @ row ${row}, col ${col} (${item})\n`,
                count: prevState.count + 1
              }));
            setSelectedCell(null);
            // setTracking(null)
        }
    }

    const swapCells = (cell1, cell2) => {
        const newBoard = [...board];
        const temp = newBoard[cell1.row][cell1.col];
        newBoard[cell1.row][cell1.col] = newBoard[cell2.row][cell2.col];
        newBoard[cell2.row][cell2.col] = temp;

        if (checkForMatch(newBoard, cell1.row, cell1.col) || checkForMatch(newBoard, cell2.row, cell2.col)) {
            setBoard(newBoard);
        } else {
            newBoard[cell2.row][cell2.col] = newBoard[cell1.row][cell1.col];
            newBoard[cell1.row][cell1.col] = temp;
            setBoard(newBoard)
        }

    }

    const checkForMatch = (board, row, col) => {
        const item = board[row][col];
        let count = 1;

        // Check horizontally
        for (let i = col - 1; i >= 0 && board[row][i] === item; i--) count++;
        for (let i = col + 1; i < cols && board[row][i] === item; i++) count++;

        if (count >= 3) return true;

        count = 1;

        // Check vertically
        for (let i = row - 1; i >= 0 && board[i][col] === item; i--) count++;
        for (let i = row + 1; i < rows && board[i][col] === item; i++) count++;

        return count >= 3;
    };

    return (
        <>

            <div className="board flex-col ">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row flex">
                        {row.map((item, colIndex) => (
                            <Cell
                                key={colIndex}
                                item={item}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                isSelected={
                                    selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>

        </>
    )



}


