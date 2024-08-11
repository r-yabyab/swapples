import { useState } from "react";
import Cell from "./Cell";
import travisYeah from '../audio/yeah.mp3'
import travisOnemoretime from '../audio/one-more-time.mp3'


const getRandomItem = () => items[Math.floor(Math.random() * items.length)];
const items = ["🍒", "🍇", "🍉", "🍋", "🍌"]; // Example items

const generateInitialBoard = (rows, cols) => {

    const board = Array.from({ length: rows }, () => Array(cols).fill(null));


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

export default function Board ({ rows, cols, setTracking, setFruitsMatched, isGameActive })  {
    const [board, setBoard] = useState(generateInitialBoard(rows, cols))
    const [selectedCell, setSelectedCell] = useState(null); // first clicked cell
    const [highlightedCells, setHighlightedCells] = useState([])

    const audio = new Audio(travisYeah)
    const audio2 = new Audio(travisOnemoretime)

    const handleCellClick = (row, col) => {
        if (!isGameActive) return;
        
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
            if (isAdjacent(selectedCell, { row, col })) {
                swapCells(selectedCell, { row, col });
                const selectedItem = board[selectedCell.row][selectedCell.col];
                setTracking(prevState => ({
                    ...prevState,
                    targetCell: `Selected Cell @ row ${selectedCell.row}, col ${selectedCell.col} (${selectedItem}), Swapped with cell @ row ${row}, col ${col} (${item})\n`,
                    // count: prevState.count + 1
                  }));
                // setSelectedCell(null);
                // setTracking(null)
            } else {
                console.log('cells are not adjacent')
                setTracking(prevState => ({
                    ...prevState,
                    targetCell: <span className=" text-red-600">Not adjacent!</span>,
                    count: prevState.count
                }))
            }
            setSelectedCell(null);

        }
    }

    const isAdjacent = (cell1, cell2) => {
        const rowDiff = Math.abs(cell1.row - cell2.row);
        const colDiff = Math.abs(cell1.col - cell2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    };

    const swapCells = (cell1, cell2) => {
        const newBoard = board.map(row => [...row]);
        const temp = newBoard[cell1.row][cell1.col];
        newBoard[cell1.row][cell1.col] = newBoard[cell2.row][cell2.col];
        newBoard[cell2.row][cell2.col] = temp;
    
        const matchedCells = checkForMatch(newBoard, cell1.row, cell1.col) || checkForMatch(newBoard, cell2.row, cell2.col);
    
        if (matchedCells) {
            setTracking(prevState => ({
                ...prevState,
                count: prevState.count + 1
              }));
              audio.play()

            removeMatches(newBoard, matchedCells);
        } else {

            // this is not updating setTracking, or is gets overidden by handleCellClick
            setTracking(prevState => ({
                ...prevState,
                targetCell: <span className=" text-red-600">Not a match!</span>,
            }))

            // Swap back if no match is found
            newBoard[cell2.row][cell2.col] = newBoard[cell1.row][cell1.col];
            newBoard[cell1.row][cell1.col] = temp;
        }
    
        setBoard(newBoard);
    };

    const checkForMatch = (board, row, col) => {
        const item = board[row][col];
        let matchedCells = [];
    
        // Check horizontally
        let count = 1;
        let startCol = col;
        let endCol = col;
    
        // Left side
        for (let i = col - 1; i >= 0 && board[row][i] === item; i--) {
            count++;
            startCol = i;
        }
    
        // Right side
        for (let i = col + 1; i < cols && board[row][i] === item; i++) {
            count++;
            endCol = i;
        }
    
        if (count >= 3) {
            for (let i = startCol; i <= endCol; i++) {
                matchedCells.push({ row, col: i });
            }
        }
    
        // Check vertically
        count = 1;
        let startRow = row;
        let endRow = row;
    
        // Up side
        for (let i = row - 1; i >= 0 && board[i][col] === item; i--) {
            count++;
            startRow = i;
        }
    
        // Down side
        for (let i = row + 1; i < rows && board[i][col] === item; i++) {
            count++;
            endRow = i;
        }
    
        if (count >= 3) {
            for (let i = startRow; i <= endRow; i++) {
                matchedCells.push({ row: i, col });
            }
        }
    
        return matchedCells.length > 0 ? matchedCells : null;
    };

    const removeMatches = (board, matchedCells) => {
        setHighlightedCells(matchedCells);

        setFruitsMatched(prevCount => prevCount + matchedCells.length);
    
        // Wait for 0.5 seconds before removing matches
        setTimeout(() => {
            const newBoard = board.map(row => [...row]);
            
            matchedCells.forEach(({ row, col }) => {
                newBoard[row][col] = null;
            });
    
            // Update board with new items
            fillBoard(newBoard);
            setBoard(newBoard);
            setHighlightedCells([]);
        }, 500);
    };

    // const removeMatches = (board, matchedCells) => {
    //     matchedCells.forEach(({ row, col }) => {
    //         board[row][col] = null;
    //     });
    //     fillBoard(board);
    // };
    
    const fillBoard = (board) => {
        // Drop items to fill empty spaces
        for (let col = 0; col < cols; col++) {
            let emptySpaces = [];
    
            for (let row = rows - 1; row >= 0; row--) {
                if (board[row][col] === null) {
                    emptySpaces.push(row);
                } else if (emptySpaces.length > 0) {
                    const newRow = emptySpaces.pop();
                    board[newRow][col] = board[row][col];
                    board[row][col] = null;
                    emptySpaces.push(row);
                }
            }
    
            while (emptySpaces.length > 0) {
                const row = emptySpaces.pop();
                board[row][col] = getRandomItem();
            }
        }
    
        // Check for new matches
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const matchedCells = checkForMatch(board, row, col);
                if (matchedCells) {
                    setTracking(prevState => ({
                        ...prevState,
                        targetCell: <span className=" text-green-600">It matched on it own!!</span>,
                        count: prevState.count+1
                    }))

                    removeMatches(board, matchedCells);
                    audio2.play();
                    return; // Exit after processing one match
                }
            }
        }
    };

    return (
        <>

            <div className="board flex-col select-none ">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row flex">
                        {row.map((item, colIndex) => (
                            <Cell
                                key={colIndex}
                                item={item}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
                                isHighlighted={highlightedCells.some(cell => cell.row === rowIndex && cell.col === colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>

        </>
    )



}


