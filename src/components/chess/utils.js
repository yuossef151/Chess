import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { initialBoard, letters, numbers } from "./constants";
import { getValidMoves } from "./moves";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://chess-backend-production-0e62.up.railway.app";

export const getPieceSymbol = (type, color) => {
  const pieceSVGs = {
    white: {
      pawn: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
      rook: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
      knight: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
      bishop: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
      queen: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
      king: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
    },
    black: {
      pawn: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
      rook: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
      knight: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
      bishop: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
      queen: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
      king: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
    }
  };

  return pieceSVGs[color]?.[type] || "";
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

function squareToColRow(square) {
  return [letters.indexOf(square[0]), numbers.indexOf(square[1])];
}

function colRowToSquare(col, row) {
  return letters[col] + numbers[row];
}

export function useChessGame() {
  const [pieces, setPieces] = useState(initialBoard);
  const [turn, setTurn] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moves, setMoves] = useState([]);
  const [promotion, setPromotion] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [checkedKing, setCheckedKing] = useState(null);
  const [mate, setMate] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [win, setWin] = useState(null);

  const [timerMode, setTimerMode] = useState("match");
  const [matchTimeSetting, setMatchTimeSetting] = useState(300);
  const [moveTimeSetting, setMoveTimeSetting] = useState(30);
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [roomCode, setRoomCode] = useState("");
  const [inputRoom, setInputRoom] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [playerColor, setPlayerColor] = useState("white");
  const [opponentConnected, setOpponentConnected] = useState(false);

  const currentTimeSetting =
    timerMode === "match" ? matchTimeSetting : moveTimeSetting;

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("room-created", ({ code, color }) => {
      setRoomCode(code);
      setPlayerColor(color);
      setInRoom(true);
    });

    socket.on("room-joined", ({ code, color }) => {
      setRoomCode(code);
      setPlayerColor(color);
      setInRoom(true);
      setOpponentConnected(true);
    });

    socket.on("opponent-joined", () => {
      setOpponentConnected(true);
    });

    // ✅ دلوقتي start-game بتوصل ومعاها إعدادات الوقت اللي المضيف اختارها،
    // وكل الطرفين بيطبقوها بنفس القيم بدل ما كل واحد يفضل شغال بإعداداته المحلية
    socket.on("start-game", (data) => {
      if (data) {
        if (data.timerMode) setTimerMode(data.timerMode);
        if (data.matchTimeSetting) setMatchTimeSetting(data.matchTimeSetting);
        if (data.moveTimeSetting) setMoveTimeSetting(data.moveTimeSetting);

        const initialTime =
          data.timerMode === "move" ? data.moveTimeSetting : data.matchTimeSetting;
        setWhiteTime(initialTime);
        setBlackTime(initialTime);
      }
      setIsGameStarted(true);
    });

    socket.on("make-move", (data) => {
      setPieces(data.pieces);
      setTurn(data.turn);
      if (data.lastMove !== undefined) setLastMove(data.lastMove);
      if (data.whiteTime !== undefined) setWhiteTime(data.whiteTime);
      if (data.blackTime !== undefined) setBlackTime(data.blackTime);
    });

    socket.on("game-over", ({ winner }) => {
      setWin(winner);
      setShowWinModal(true);
    });

    socket.on("opponent-left", () => {
      setOpponentConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isGameStarted || showWinModal) return;

    const timer = setInterval(() => {
      if (turn === "white") {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setWin("black");
            setShowWinModal(true);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setWin("white");
            setShowWinModal(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameStarted, turn, showWinModal]);

  const createRoom = () => {
    socketRef.current.emit("create-room");
  };

  const joinRoom = (code) => {
    return new Promise((resolve) => {
      socketRef.current.emit("join-room", code, (response) => {
        resolve(!!response.success);
      });
    });
  };

  const leaveRoom = () => {
    if (roomCode) {
      socketRef.current.emit("leave-room", roomCode);
    }
    setInRoom(false);
    setRoomCode("");
    setInputRoom("");
    setPlayerColor("white");
    setOpponentConnected(false);
  };

  const startPassAndPlay = () => {
    setIsGameStarted(true);
    setInRoom(false);
  };

  // ✅ جديد: المضيف بيستخدمها لبدء اللعبة أونلاين — بتبعت إعدادات الوقت الحالية للسيرفر
  // عشان يوزّعها على الطرفين بدل ما كل واحد يفضل شغال بإعداداته الخاصة
  const startOnlineGame = () => {
    const settings = {
      room: roomCode,
      timerMode,
      matchTimeSetting,
      moveTimeSetting,
    };
    socketRef.current.emit("start-game", settings);
  };

  const handleTimerModeChange = (mode) => {
    setTimerMode(mode);
  };

  const handleMatchTimeChange = (time) => {
    setMatchTimeSetting(time);
    setWhiteTime(time);
    setBlackTime(time);
  };

  const handleMoveTimeChange = (time) => {
    setMoveTimeSetting(time);
  };

  const handleSquareClick = (square) => {
    if (!isGameStarted) return;
    if (inRoom && playerColor !== turn) return;

    const pieceAtSquare = pieces.find((p) => p.position === square);

    if (selectedPiece) {
      if (moves.includes(square)) {
        const movingColor = selectedPiece.color;
        const from = selectedPiece.position;

        let enPassantCaptureSquare = null;
        if (
          selectedPiece.type === "pawn" &&
          !pieces.find((p) => p.position === square) &&
          from[0] !== square[0]
        ) {
          enPassantCaptureSquare = square[0] + from[1];
        }

        const isCastlingMove =
          selectedPiece.type === "king" &&
          (square === "G1" || square === "C1" || square === "G8" || square === "C8");

        let updatedPieces = pieces
          .map((p) => {
            if (p.position === selectedPiece.position) {
              return { ...p, position: square, hasMoved: true };
            }
            if (p.position === square) {
              return null;
            }
            return p;
          })
          .filter(Boolean);

        if (enPassantCaptureSquare) {
          updatedPieces = updatedPieces.filter(
            (p) => p.position !== enPassantCaptureSquare
          );
        }

        if (isCastlingMove) {
          const row = movingColor === "white" ? "1" : "8";
          if (square[0] === "G") {
            updatedPieces = updatedPieces.map((p) =>
              p.position === "H" + row
                ? { ...p, position: "F" + row, hasMoved: true }
                : p
            );
          } else if (square[0] === "C") {
            updatedPieces = updatedPieces.map((p) =>
              p.position === "A" + row
                ? { ...p, position: "D" + row, hasMoved: true }
                : p
            );
          }
        }

        const isPawn = selectedPiece.type === "pawn";
        const isPromotionRow =
          (movingColor === "white" && square.endsWith("8")) ||
          (movingColor === "black" && square.endsWith("1"));

        const updatedLastMove = { piece: selectedPiece, from, to: square };
        setLastMove(updatedLastMove);

        if (isPawn && isPromotionRow) {
          setPieces(updatedPieces);
          setPromotion({ piece: selectedPiece, position: square });
          setSelectedPiece(null);
          setMoves([]);
          return;
        }

        const nextTurn = turn === "white" ? "black" : "white";

        let newWhiteTime = whiteTime;
        let newBlackTime = blackTime;
        if (timerMode === "move") {
          if (movingColor === "white") {
            newWhiteTime = moveTimeSetting + Math.max(0, whiteTime);
            setWhiteTime(newWhiteTime);
          } else {
            newBlackTime = moveTimeSetting + Math.max(0, blackTime);
            setBlackTime(newBlackTime);
          }
        }

        setPieces(updatedPieces);
        setTurn(nextTurn);
        setSelectedPiece(null);
        setMoves([]);

        if (inRoom && socketRef.current) {
          socketRef.current.emit("make-move", {
            room: roomCode,
            pieces: updatedPieces,
            turn: nextTurn,
            lastMove: updatedLastMove,
            whiteTime: newWhiteTime,
            blackTime: newBlackTime,
          });
        }
        return;
      }
    }

    if (pieceAtSquare && pieceAtSquare.color === turn) {
      setSelectedPiece(pieceAtSquare);
      const [col, row] = squareToColRow(pieceAtSquare.position);
      const validMoves = getValidMoves(
        pieceAtSquare,
        col,
        row,
        pieces,
        lastMove
      ).map(([c, r]) => colRowToSquare(c, r));
      setMoves(validMoves);
    } else {
      setSelectedPiece(null);
      setMoves([]);
    }
  };

  const handlePromotion = (pieceType) => {
    if (!promotion) return;
    const movingColor = promotion.piece.color;

    const updatedPieces = pieces.map((p) => {
      if (p.position === promotion.position) {
        return { ...p, type: pieceType };
      }
      return p;
    });

    const nextTurn = movingColor === "white" ? "black" : "white";

    let newWhiteTime = whiteTime;
    let newBlackTime = blackTime;
    if (timerMode === "move") {
      if (movingColor === "white") {
        newWhiteTime = moveTimeSetting + Math.max(0, whiteTime);
        setWhiteTime(newWhiteTime);
      } else {
        newBlackTime = moveTimeSetting + Math.max(0, blackTime);
        setBlackTime(newBlackTime);
      }
    }

    setPieces(updatedPieces);
    setTurn(nextTurn);
    setPromotion(null);

    if (inRoom && socketRef.current) {
      socketRef.current.emit("make-move", {
        room: roomCode,
        pieces: updatedPieces,
        turn: nextTurn,
        lastMove,
        whiteTime: newWhiteTime,
        blackTime: newBlackTime,
      });
    }
  };

  const resetGame = () => {
    setPieces(initialBoard);
    setTurn("white");
    setSelectedPiece(null);
    setMoves([]);
    setPromotion(null);
    setLastMove(null);
    setCheckedKing(null);
    setMate(false);
    setShowWinModal(false);
    setWin(null);
    setIsGameStarted(false);
    setWhiteTime(matchTimeSetting);
    setBlackTime(matchTimeSetting);
  };

  return {
    pieces,
    turn,
    moves,
    selectedPiece,
    promotion,
    lastMove,
    checkedKing,
    mate,
    showWinModal,
    win,
    timerMode,
    matchTimeSetting,
    moveTimeSetting,
    whiteTime,
    blackTime,
    isGameStarted,
    currentTimeSetting,
    roomCode,
    inputRoom,
    inRoom,
    playerColor,
    opponentConnected,
    setIsGameStarted,
    setWhiteTime,
    setBlackTime,
    setRoomCode,
    setInputRoom,
    setInRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    startPassAndPlay,
    startOnlineGame,
    handlePromotion,
    resetGame,
    handleTimerModeChange,
    handleMatchTimeChange,
    handleMoveTimeChange,
    handleSquareClick,
  };
}