import React from 'react';
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
                value={props.squares[j]}
                onClick={() => props.onClick(j)}
            />
        ))
    ).map((line) => (<div className='board-row'>{line}</div>));

    return (<div>{board}</div>);
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    getNextSymbol() {
        return this.state.xIsNext ? 'X' : 'O';
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) return;

        squares[i] = this.getNextSymbol();
        this.setState({
            history: history.concat([{ squares: squares, }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    getStatusMessage(squares) {
        const winner = calculateWinner(squares);
        if (winner) {
            return 'Winner: ' + winner;
        } else {
            return 'Next player: ' + this.getNextSymbol();
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const status = this.getStatusMessage(current.squares);

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <HistoryButtons
                            historyLength={history.length}
                            onClick={(i) => this.jumpTo(i)}
                        />
                    </div>
                </div>
            </div>
        );
    }
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