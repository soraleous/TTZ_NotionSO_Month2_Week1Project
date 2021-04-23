import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* Code Adapted from https://reactjs.org/tutorial/tutorial.html */

/* Square is a Function component as it only contains a render method and dont have their own state */
function Square(props) {
    return (
        /* onClick prop on built-in DOM <button> will tell React to setup a click listener,
           Clicking buttons will call the onClick event handler defined in Square's render method,
           Event handler calls this.props.onClick()
           Using () => to prevent firing the event everytime the component re-renders.
           */
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
     );
}

class Board extends React.Component {

    renderSquare(i) {
        /* Read the state value and return it (Either null,X,or O).
         * Board component maintains which squares are filled, but cannot update states from Squares,
         * So we will pass down the function when the square is clicked  */
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    // Placing history state here in the top-level Game component
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            // To indicate which step the user is currently viewing (For use with history of moves)
            stepNumber: 0,
            xIsNext: true,
        };
    }

    /* handleClick defined here */
    handleClick(i) {
        // Slice to ensure immutability, concatenate new history entries into history.
        // History is also sliced while ensuring that rerolling moves will remove incorrect future moves.
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // Return early by ignoring a click if someone has already won the game of if a square is already filled.
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // concat method does not mutate the original array compared to array push().
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            // Update stepNumber here to ensure it doesnt get stuck showing the same move after a new one has been made.
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    // jumpTo method defined here
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    // Use most recvent history entry to determine and display the game's status
    render() {
        const history = this.state.history;
        // current always render selected move according to stepNumber only.
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // moves for rerolling to past moves stored in history

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                // For each move create a list item that contains a button which then has a method to jump back to previous move.
                // unique ID key for lists is the 'moves' as they are never modified throughout.
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

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
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


// Helper function to determine winner (https://reactjs.org/tutorial/tutorial.html#declaring-a-winner)
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
    // Given the array of 9 squares, check for the winner and return X, O or null as appropriate
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}