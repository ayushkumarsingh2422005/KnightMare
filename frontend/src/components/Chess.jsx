import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from "react";
import ChessBoard from "./ChessBoard";
import Timer from "./Timer";
import ResignButton from "./ResignButton";
import MoveHistory from "./MoveHistory";
import StartNewGame from "./StartNewGame";
import {
  validateMove,
  ShowLegalMoves,
  boardToFEN,
  checkGameState,
} from "../chess-logic/functions";
import { makeMove } from "../chess-logic/MoveExecution";
import captureSound from "../assets/captureSound.mp3";
import { checkThreefoldRepetition } from "../chess-logic/creepyfunctions/ThreeFoldRepetition";
import Result from "./chess-components/Result";
import { updateCutPieces, calculateAdvantage } from "../chess-logic/CutPieces";
import CutPieces from "./chess-components/CutPieces";
import { gamecontext } from "../contexts/gamecontext";
import { commoncontext } from "../contexts/commoncontext";
import winner from "../assets/win.mp3";
import loser from "../assets/lose.mp3";
import start from "../assets/gamestart.mp3";
import woosh from "../assets/woosh.mp3";

function Chess(){
  const { user } = useContext(commoncontext);
  const {
    board,
    setBoard,
    currentPlayer,
    setCurrentPlayer,
    gameOver,
    setGameOver,
    selectedSquare,
    setSelectedSquare,
    moves,
    setMoves,
    enPassantTarget,
    setEnPassantTarget,
    legalMoves,
    setLegalMoves,
    kingInCheck,
    setKingInCheck,
    castlingRights,
    setCastlingRights,
    gameStarted,
    setGameStarted,
    whiteTime,
    setWhiteTime,
    blackTime,
    setBlackTime,
    gameResult,
    getBestMove,
    endGame,
    cutPieces,
    setCutPieces,
    flippedBoard,
    side,
    timeFormat,
    level,
    resetGame,
    setGameResult,
  } = useContext(gamecontext);

  useEffect(() => {
    const whiteState = checkGameState(
      board,
      "white",
      castlingRights,
      enPassantTarget
    );
    const blackState = checkGameState(
      board,
      "black",
      castlingRights,
      enPassantTarget
    );
    setKingInCheck({
      white: whiteState.includes("check"),
      black: blackState.includes("check"),
    });
    if (whiteState === "checkmate") {
      const result = side === "black" ? "win" : "lose";
    endGame(result);
    result === "win" ? playwin() : playlose(); 
    } else if (blackState === "checkmate") {
      const result = side === "white" ? "win" : "lose";
    endGame(result);
    result === "win" ? playwin() : playlose(); // Add this line
    } else if (whiteState === "stalemate" || blackState === "stalemate") {
      endGame("stalemate");
    } else if (checkThreefoldRepetition(moves)) {
      endGame("threefold");
    }
  }, [board, castlingRights, enPassantTarget]);

  const playCaptureSound = () => {
    const audio = new Audio(captureSound);
    audio
      .play()
      .catch((error) => console.error("Failed to play sound:", error));
  };

  const playwin = () => {
    const audio = new Audio(winner);
    audio
      .play()
      .catch((error) => console.error("Failed to play sound:", error));
  };

  const playlose = () => {
    const audio = new Audio(loser);
    audio.currentTime = 0.1; 
    audio
      .play()
      .catch((error) => console.error("Failed to play sound:", error));
  };


  const playstart = () => {
    const audio = new Audio(start);
    audio
      .play()
      .catch((error) => console.error("Failed to play sound:", error));
  };


  // const playwoosh = () => {
  //   const audio = new Audio(woosh);
  //   audio
  //     .play()
  //     .catch((error) => console.error("Failed to play sound:", error));
  // };

  

  const playwoosh = () => {
    const audio = new Audio(woosh);
    audio.currentTime = 0.2; // Start from 0.2 seconds
    audio
      .play()
      .catch((error) => console.error("Failed to play sound:", error));
};




  useEffect(() => {
    setGameStarted(moves.length >= 1);
  }, [moves]);
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    

    
    

    const interval = setInterval(() => {
      if (currentPlayer === "white") {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            playlose();   //________________________________
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            playlose(); //__________________________________
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, gameStarted, currentPlayer]);
  useEffect(() => {
    if (side === "black") {
      setTimeout(() => {
        makeAIMove(board, "white");
      }, 0);
    }
  }, [side]);
  const handleSquareClick = useCallback(
    (clickedSquare) => {
      if (currentPlayer !== side || gameOver || !clickedSquare) return;
      const newBoard = board.map((row) =>
        row.map((sq) => ({ ...sq, isSelected: false }))
      );

      if (!selectedSquare) {
        if (clickedSquare.piece?.color === currentPlayer) {
          const moves = ShowLegalMoves(
            board,
            clickedSquare.piece,
            clickedSquare,
            castlingRights,
            enPassantTarget,
            currentPlayer
          );

          newBoard[clickedSquare.row][clickedSquare.col].isSelected = true;
          setBoard(newBoard);
          setSelectedSquare(clickedSquare);
          setLegalMoves(moves);
        }
      } else {
        const isValidMove = validateMove(
          board,
          selectedSquare,
          clickedSquare,
          currentPlayer,
          castlingRights,
          enPassantTarget
        );

        if (isValidMove) {
          const updatedCastlingRights = JSON.parse(
            JSON.stringify(castlingRights)
          );
          const updatedBoard = makeMove(
            newBoard,
            selectedSquare,
            clickedSquare,
            updatedCastlingRights,
            (newRights) => setCastlingRights(newRights),
            setEnPassantTarget,
            (capturedPiece) => {
              if (capturedPiece) {
                setCutPieces((prev) =>
                  updateCutPieces(prev, capturedPiece, currentPlayer)
                );
                // playCaptureSound();
                playwoosh();
              }
            }
          );

          setBoard(updatedBoard);
          updateMoveHistory(selectedSquare, clickedSquare, currentPlayer);
          const whiteCheck = checkGameState(
            updatedBoard,
            "white",
            updatedCastlingRights,
            enPassantTarget
          ).includes("check");
          const blackCheck = checkGameState(
            updatedBoard,
            "black",
            updatedCastlingRights,
            enPassantTarget
          ).includes("check");

          setKingInCheck({
            white: whiteCheck,
            black: blackCheck,
          });

          const newPlayer = currentPlayer === "white" ? "black" : "white";
          setCurrentPlayer(newPlayer);
          setSelectedSquare(null);
          setLegalMoves([]);

          if (
            (side === "white" && newPlayer === "black") ||
            (side === "black" && newPlayer === "white")
          ) {
            setTimeout(() => makeAIMove(updatedBoard, newPlayer), 100);
          }
        } else {
          setBoard(newBoard);
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    },
    [
      board,
      selectedSquare,
      currentPlayer,
      side,
      gameOver,
      castlingRights,
      enPassantTarget,
    ]
  );
  const makeAIMove = useCallback(
    (currentBoard, player) => {
      getBestMove(boardToFEN(currentBoard, player), (move) => {
        const from = parseUCIToCoordinates(move.slice(0, 2), currentBoard);
        const to = parseUCIToCoordinates(move.slice(2, 4), currentBoard);

        if (!from.piece || from.piece.color !== player) {
          console.error("Invalid AI move:", move);
          return;
        }
        const updatedCastlingRights = JSON.parse(
          JSON.stringify(castlingRights)
        );

        const newBoard = makeMove(
          currentBoard,
          from,
          to,
          updatedCastlingRights,
          (newRights) => setCastlingRights(newRights),
          setEnPassantTarget,
          (capturedPiece) => {
            // playCaptureSound();
            if (capturedPiece) {
              setCutPieces((prev) =>
                updateCutPieces(prev, capturedPiece, player)
              );
              //playCaptureSound();
              playwoosh();
            }
          }
        );
        setBoard(newBoard);
        playCaptureSound();
        updateMoveHistory(from, to, player);
        setCurrentPlayer(player === "white" ? "black" : "white");
        setCurrentPlayer(player === "white" ? "black" : "white");
      });
    },
    [boardToFEN, castlingRights]
  );
  const [promotingPawn, setPromotingPawn] = useState(null);
  const handlePromotion = (board, position, color) => {
    setPromotingPawn({ position, color });
    return board;
  };
  const PromotionModal = () => {
    if (!promotingPawn) return null;
    const pieces = ["queen", "rook", "bishop", "knight"];
    const row = promotingPawn.position.row;
    const col = promotingPawn.position.col;
    return (
      <div className="promotion-modal absolute bg-gray-800 p-4 rounded-lg shadow-lg">
        {pieces.map((piece) => (
          <button
            key={piece}
            onClick={() => {
              const newBoard = [...board];
              newBoard[row][col].piece = {
                type: piece,
                color: promotingPawn.color,
              };
              setBoard(newBoard);
              setPromotingPawn(null);
            }}
            className="w-full p-2 hover:bg-gray-700 text-white"
          >
            {piece.charAt(0).toUpperCase() + piece.slice(1)}
          </button>
        ))}
      </div>
    );
  };
  const updateMoveHistory = (from, to, movingPlayer) => {
    const notation = getMoveNotation(from, to);
    setMoves((prev) => {
      if (movingPlayer === "white") {
        const moveNumber = Math.floor(prev.length) + 1;
        return [
          ...prev,
          {
            moveNumber,
            white: notation,
            black: null,
          },
        ];
      } else {
        if (prev.length === 0) {
          return [
            {
              moveNumber: 1,
              white: null,
              black: notation,
            },
          ];
        }

        const lastMove = prev[prev.length - 1];
        if (lastMove.white && !lastMove.black) {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMove,
              black: notation,
            },
          ];
        } else {
          const moveNumber = prev.length + 1;
          return [
            ...prev,
            {
              moveNumber,
              white: null,
              black: notation,
            },
          ];
        }
      }
    });
  };
  const getMoveNotation = (from, to, board) => {
    if (!from.piece) return "";
    const pieceType = from.piece.type;
    const isCapture = to.piece !== null;
    const file = String.fromCharCode(97 + to.col);
    const rank = 8 - to.row;
    if (pieceType === "king" && Math.abs(from.col - to.col) === 2) {
      return to.col > from.col ? "O-O" : "O-O-O";
    }
    if (pieceType === "pawn") {
      if (isCapture) {
        const fromFile = String.fromCharCode(97 + from.col);
        return `${fromFile}x${file}${rank}`;
      }
      return `${file}${rank}`;
    }

    // Handle other pieces
    const pieceLetter = {
      knight: "N",
      bishop: "B",
      rook: "R",
      queen: "Q",
      king: "K",
    }[pieceType];

    return `${pieceLetter}${isCapture ? "x" : ""}${file}${rank}`;
  };
  const parseUCIToCoordinates = (uci, currentBoard) => {
    const col = uci.charCodeAt(0) - 97;
    const row = 8 - parseInt(uci[1]);
    return {
      col,
      row,
      piece: currentBoard[row][col].piece,
    };
  };
  const isInCheck = (board, color) => {
    const kingPos = findKing(board, color);
    return board.some((row, y) =>
      row.some(
        (sq, x) =>
          sq.piece?.color !== color &&
          validateMove({ row: y, col: x, piece: sq.piece }, kingPos)
      )
    );
  };
  const findKing = (board, color) => {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (
          board[y][x].piece?.type === "king" &&
          board[y][x].piece?.color === color
        ) {
          return { row: y, col: x };
        }
      }
    }
    return null;
  };




  return (
    <div className="chess-container p-2   text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center relative z-10 bg-gray-800 rounded-lg p-1">
            <div className="flex items-center space-x-1  bg-gray-700/50 px-3 rounded-md">
              <div className="text-md font-bold text-white">Magnus Carlsen</div>
             
              <CutPieces
                pieces={cutPieces[side === "white" ? "black" : "white"]}
                advantage={calculateAdvantage(
                  cutPieces,
                  side === "white" ? "black" : "white"
                )}
              />
            </div>
            <Timer
              time={side === "white" ? blackTime : whiteTime}
              isActive={
                currentPlayer === (side === "white" ? "black" : "white") &&
                gameStarted &&
                !gameOver
              }
              onTimeEnd={() => setGameOver(true)}
            />
          </div>

          <ChessBoard
            board={flippedBoard}
            handleSquareClick={handleSquareClick}
            legalMoves={legalMoves}
            side={side}
            kingInCheck={kingInCheck}
          />
          <div className="flex justify-between items-center relative z-10 bg-gray-800 rounded-lg p-1">
            <div className="flex items-center space-x-2 bg-gray-700/50 px-3  rounded-md">
              <div className="text-md font-bold text-white">
                {user?.username}
              </div>
              <CutPieces
                pieces={cutPieces[side]}
                advantage={calculateAdvantage(cutPieces, side)}
              />
            </div>
            {/* <Timer
              time={side === "white" ? whiteTime : blackTime}
              isActive={currentPlayer === side && gameStarted && !gameOver}
              onTimeEnd={() => {
                !whiteTime
                  ? side === "white"
                    ? endGame("player_timeout")
                    : endGame("ai_timeout")
                  : side === "white"
                  ? endGame("ai_timeout")
                  : endGame("player_timeout");
              }}
            /> */}



<Timer
  time={side === "white" ? whiteTime : blackTime}
  isActive={currentPlayer === side && gameStarted && !gameOver}
  onTimeEnd={() => {
    if (!whiteTime || !blackTime) {
      const result = side === "white" 
        ? "player_timeout" 
        : "ai_timeout";
      endGame(result);
      result.includes("player") ? playlose() : playwin(); // Add this
    }
  }}
/>


          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center text-xl font-bold">
            {`${["Easy", "Intermediate", "Hard"][level / 10]} | ${
              timeFormat / 60
            }+0`}
          </div>
          <MoveHistory moves={moves} />
          {gameOver && (
            <div className="mt-4">
              <Result result={gameResult} playerColor={side} />
            </div>
          )}
          <div className="flex space-x-4">
            {!gameOver && (
              <ResignButton
                onResign={() => {
                  setGameOver(true);
                  playlose();
                  endGame("player_resign");
                }}
              />
            )}
            {gameOver && (
              <StartNewGame
                onNewGame={() => {
                  window.location.reload();
                  resetGame();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chess;
