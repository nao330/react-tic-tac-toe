import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function HistoryButtons(props) {
    const buttons = [...Array(props.historyLength)].map((_, i) => {
        const desc = i === 0 ?
            'Go to game start' :
            'Go to move #' + i;

        return (
            <li key={i}>
                <button onClick={() => props.onClick(i)}>{desc}</button>
            </li>
        );
    });

    return (
        <ul>{buttons}</ul>
    );
}

function Board(props) {
    const board = [...Array(3)].map((_, i) =>
        [...Array(3)].map((_, j) => i * 3 + j)
            .map((j, _) => (
                <Square
                    key={j}
                    value={props.squares[j]}
                    onClick={() => props.onClick(j)}
                />
            ))
    ).map((line, i) => (<div className='board-row' key={i}>{line}</div>));

    return (<div>{board}</div>);
}

function Game(props) {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    const getNextSymbol = () => xIsNext ? 'X' : 'O';
    const handleClick = (i) => {
        const historyCopy = history.slice(0, stepNumber + 1);
        const current = historyCopy[historyCopy.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) return;

        squares[i] = getNextSymbol();
        setHistory(historyCopy.concat([{ squares: squares, }]));
        setStepNumber(historyCopy.length);
        setXIsNext(!xIsNext);
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    };

    const getStatusMessage = (squares) => {
        const winner = calculateWinner(squares);
        if (winner) {
            return 'Winner: ' + winner;
        } else {
            return 'Next player: ' + getNextSymbol();
        }
    };

    const current = history[stepNumber];
    const status = getStatusMessage(current.squares);

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <div>
                    <HistoryButtons
                        historyLength={history.length}
                        onClick={(i) => jumpTo(i)}
                    />
                </div>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] == squares[c]) {
            return squares[a];
        }
    }

    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);