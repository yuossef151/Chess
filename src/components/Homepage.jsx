import { useEffect, useState } from "react";
import { getValidMoves } from "./chess/moves";
import { isKingInCheck, isCheckmate, isMoveSafe } from "./chess/rules";
import { getPieceSymbol } from "./chess/utils";
import { size, letters, numbers } from "./chess/constants";

export default function Homepage() {
  const initialPieces = [
    // قطع الأسود (الصف الثامن 8)
    { id: "rook1", type: "rook", position: "A8", color: "black", hasMoved: false },
    { id: "knight1", type: "knight", position: "B8", color: "black", hasMoved: false },
    { id: "bishop1", type: "bishop", position: "C8", color: "black", hasMoved: false },
    { id: "queen", type: "queen", position: "D8", color: "black", hasMoved: false },
    { id: "king", type: "king", position: "E8", color: "black", hasMoved: false },
    { id: "bishop2", type: "bishop", position: "F8", color: "black", hasMoved: false },
    { id: "knight2", type: "knight", position: "G8", color: "black", hasMoved: false },
    { id: "rook2", type: "rook", position: "H8", color: "black", hasMoved: false },
    { id: "pawn1", type: "pawn", position: "A7", color: "black", hasMoved: false },
    { id: "pawn2", type: "pawn", position: "B7", color: "black", hasMoved: false },
    { id: "pawn3", type: "pawn", position: "C7", color: "black", hasMoved: false },
    { id: "pawn4", type: "pawn", position: "D7", color: "black", hasMoved: false },
    { id: "pawn5", type: "pawn", position: "E7", color: "black", hasMoved: false },
    { id: "pawn6", type: "pawn", position: "F7", color: "black", hasMoved: false },
    { id: "pawn7", type: "pawn", position: "G7", color: "black", hasMoved: false },
    { id: "pawn8", type: "pawn", position: "H7", color: "black", hasMoved: false },

    // قطع الأبيض (الصف الأول 1)
    { id: "rook3", type: "rook", position: "A1", color: "white", hasMoved: false },
    { id: "knight3", type: "knight", position: "B1", color: "white", hasMoved: false },
    { id: "bishop3", type: "bishop", position: "C1", color: "white", hasMoved: false },
    { id: "queen2", type: "queen", position: "D1", color: "white", hasMoved: false },
    { id: "king2", type: "king", position: "E1", color: "white", hasMoved: false },
    { id: "bishop4", type: "bishop", position: "F1", color: "white", hasMoved: false },
    { id: "knight4", type: "knight", position: "G1", color: "white", hasMoved: false },
    { id: "rook4", type: "rook", position: "H1", color: "white", hasMoved: false },
    { id: "pawn9", type: "pawn", position: "A2", color: "white", hasMoved: false },
    { id: "pawn10", type: "pawn", position: "B2", color: "white", hasMoved: false },
    { id: "pawn11", type: "pawn", position: "C2", color: "white", hasMoved: false },
    { id: "pawn12", type: "pawn", position: "D2", color: "white", hasMoved: false },
    { id: "pawn13", type: "pawn", position: "E2", color: "white", hasMoved: false },
    { id: "pawn14", type: "pawn", position: "F2", color: "white", hasMoved: false },
    { id: "pawn15", type: "pawn", position: "G2", color: "white", hasMoved: false },
    { id: "pawn16", type: "pawn", position: "H2", color: "white", hasMoved: false },
  ];

  const savedPieces = JSON.parse(localStorage.getItem("chessPieces"));
  const savedTurn = localStorage.getItem("chessTurn");
  const [pieces, setPieces] = useState(savedPieces || initialPieces);
  const [turn, setTurn] = useState(savedTurn || "white");
  const [moves, setMoves] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [checkedKing, setCheckedKing] = useState(null);
  const [mate, setmate] = useState(false);
  const [win, setwin] = useState();
  
  const savedMyTime = JSON.parse(localStorage.getItem("myTime")) || 600;
  const [mytime, setMyTime] = useState(savedMyTime);

  const savedWhiteTime = JSON.parse(localStorage.getItem("whiteTime"));
  const savedBlackTime = JSON.parse(localStorage.getItem("blackTime"));
  const [whiteTime, setWhiteTime] = useState(savedWhiteTime ?? mytime);
  const [blackTime, setBlackTime] = useState(savedBlackTime ?? mytime);
  const savedStart = JSON.parse(localStorage.getItem("isGameStarted"));
  const [isGameStarted, setIsGameStarted] = useState(savedStart ?? false);

  const checkKing = (pieces, color) => isKingInCheck(pieces, color, lastMove);
  const checkMate = (color, pieces) => isCheckmate(color, pieces, lastMove);
  const safeMove = (piece, square, pieces) => isMoveSafe(piece, square, pieces, lastMove);

  function handlePromotion(choice) {
    const { piece, targetSquare } = promotion;

    setPieces((prev) => {
      let newPieces = prev
        .filter((p) => p.position !== targetSquare)
        .map((p) =>
          p.id === piece.id ? { ...p, position: targetSquare, type: choice } : p
        );

      const nextTurn = piece.color === "white" ? "black" : "white";
      const king = newPieces.find((p) => p.type === "king" && p.color === nextTurn);

      if (checkMate(nextTurn, newPieces)) {
        setwin(piece.color);
        setmate(true);
      } else if (checkKing(newPieces, nextTurn)) {
        setCheckedKing(king.position);
      } else {
        setCheckedKing(null);
      }

      return newPieces;
    });

    setTurn(piece.color === "white" ? "black" : "white");
    setPromotion(null);
    setMoves([]);
    setSelectedPiece(null);
  }

  function movePiece(piece, targetSquare) {
    const from = piece.position;
    let enPassantCaptureId = null;

    if (piece.type === "pawn" && lastMove) {
      const enemy = lastMove.piece;
      if (enemy.type === "pawn") {
        const fromRow = parseInt(lastMove.from[1]);
        const toRow = parseInt(lastMove.to[1]);

        if (Math.abs(fromRow - toRow) === 2) {
          const enemyColIndex = letters.indexOf(lastMove.to[0]);
          const enemyRowIndex = numbers.indexOf(lastMove.to[1]);
          const myColIndex = letters.indexOf(from[0]);
          const myRowIndex = numbers.indexOf(from[1]);
          const targetColIndex = letters.indexOf(targetSquare[0]);
          const targetRowIndex = numbers.indexOf(targetSquare[1]);

          const isDiagonal =
            Math.abs(targetColIndex - myColIndex) === 1 && targetRowIndex !== myRowIndex;
          const isEmpty = !pieces.find((p) => p.position === targetSquare);
          const isAdjacent =
            Math.abs(enemyColIndex - myColIndex) === 1 && enemyRowIndex === myRowIndex;

          if (isDiagonal && isEmpty && isAdjacent) {
            enPassantCaptureId = enemy.id;
          }
        }
      }
    }

    setLastMove({ piece, from, to: targetSquare });

    if (piece.type === "pawn") {
      const reachedEnd =
        (piece.color === "white" && targetSquare[1] === "8") ||
        (piece.color === "black" && targetSquare[1] === "1");

      if (reachedEnd) {
        setPromotion({ piece, targetSquare });
        return;
      }
    }

    setPieces((prev) => {
      let newPieces = [...prev];

      if (enPassantCaptureId) {
        newPieces = newPieces.filter((p) => p.id !== enPassantCaptureId);
      }

      newPieces = newPieces.filter(
        (p) => p.position !== targetSquare || p.id === piece.id
      );

      newPieces = newPieces.map((p) =>
        p.id === piece.id ? { ...p, position: targetSquare, hasMoved: true } : p
      );

      const nextTurn = turn === "white" ? "black" : "white";
      const king = newPieces.find((p) => p.type === "king" && p.color === nextTurn);
      const isCastlingMove =
        piece.type === "king" &&
        piece.position === (piece.color === "white" ? "E1" : "E8") &&
        (targetSquare === "G1" || targetSquare === "C1" || targetSquare === "G8" || targetSquare === "C8");

      if (checkMate(nextTurn, newPieces)) {
        setwin(piece.color);
        setmate(true);
      } else if (checkKing(newPieces, nextTurn)) {
        setCheckedKing(king.position);
      } else {
        setCheckedKing(null);
      }

      if (isCastlingMove) {
        const row = piece.color === "white" ? "1" : "8";
        if (targetSquare[0] === "G") {
          newPieces = newPieces.map((p) =>
            p.position === "H" + row ? { ...p, position: "F" + row, hasMoved: true } : p
          );
        } else if (targetSquare[0] === "C") {
          newPieces = newPieces.map((p) =>
            p.position === "A" + row ? { ...p, position: "D" + row, hasMoved: true } : p
          );
        }
      }
      return newPieces;
    });

    if (piece.type !== "pawn" || (targetSquare[1] !== "8" && targetSquare[1] !== "1")) {
      const nextTurn = turn === "white" ? "black" : "white";
      setTurn(nextTurn);
    }

    setMoves([]);
    setSelectedPiece(null);
  }

  const resetGame = () => {
    setPieces(initialPieces);
    setTurn("white");
    setWhiteTime(mytime);
    setBlackTime(mytime);
    setMoves([]);
    setSelectedPiece(null);
    setCheckedKing(null);
    setIsGameStarted(false);
    localStorage.removeItem("chessPieces");
    localStorage.removeItem("chessTurn");
  };

  const handleTimeChange = (newTime) => {
    setMyTime(newTime);
    setWhiteTime(newTime);
    setBlackTime(newTime);
    localStorage.setItem("myTime", JSON.stringify(newTime));
  };

  useEffect(() => {
    localStorage.setItem("whiteTime", JSON.stringify(whiteTime));
    localStorage.setItem("blackTime", JSON.stringify(blackTime));
  }, [whiteTime, blackTime]);

  useEffect(() => {
    localStorage.setItem("chessPieces", JSON.stringify(pieces));
    localStorage.setItem("chessTurn", turn);
  }, [pieces, turn]);

  useEffect(() => {
    localStorage.setItem("isGameStarted", JSON.stringify(isGameStarted));
  }, [isGameStarted]);

  useEffect(() => {
    if (!isGameStarted) return;
    if (mate) return;
    if (whiteTime === 0 || blackTime === 0) return;

    const timer = setInterval(() => {
      setWhiteTime((w) => (turn === "white" ? Math.max(w - 1, 0) : w));
      setBlackTime((b) => (turn === "black" ? Math.max(b - 1, 0) : b));
    }, 1000);

    return () => clearInterval(timer);
  }, [turn, isGameStarted, mate]);

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
      
      <div className="w-full max-w-6xl bg-slate-800/85 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/60 p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="flex flex-col justify-between w-full lg:w-72 gap-6">
          
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Chess Arena
            </h1>
            <p className="text-sm text-slate-400 mt-1">المواجهة الكلاسيكية المباشرة</p>
          </div>

          {!isGameStarted && (
            <div className="flex flex-col gap-2 bg-slate-900/50 p-3 rounded-2xl border border-slate-700/50">
              <label className="text-xs text-slate-400 font-semibold">وقت البداية (لكل لاعب):</label>
              <select
                value={mytime}
                onChange={(e) => handleTimeChange(Number(e.target.value))}
                className="bg-slate-800 text-slate-200 text-sm font-bold p-2 rounded-xl border border-slate-600 focus:outline-none cursor-pointer"
              >
                <option value={180}>3 دقائق (خاطف)</option>
                <option value={300}>5 دقائق (سريع)</option>
                <option value={600}>10 دقائق (كلاسيكي)</option>
                <option value={900}>15 دقيقة</option>
                <option value={1800}>30 دقيقة</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-3">
            
            <div className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border ${turn === "black" ? "bg-slate-700/90 border-red-500 shadow-lg shadow-red-500/20" : "bg-slate-900/40 border-slate-700/50"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-slate-600">
                  <svg className="w-6 h-6 fill-black" viewBox="0 0 20 20">
                    <path d="M7.725 2.146c-1.016.756-1.289 1.953-1.239 2.59c.064.779.222 1.793.222 1.793s-.313.17-.313.854c.109 1.717.683.976.801 1.729c.284 1.814.933 1.491.933 2.481c0 1.649-.68 2.42-2.803 3.334C3.196 15.845 1 17 1 19v1h18v-1c0-2-2.197-3.155-4.328-4.072c-2.123-.914-2.801-1.684-2.801-3.334c0-.99.647-.667.932-2.481c.119-.753.692-.012.803-1.729c0-.684-.314-.854-.314-.854s.158-1.014.221-1.793c.065-.817-.398-2.561-2.3-3.096c-.333-.34-.558-.881.466-1.424c-2.24-.105-2.761 1.067-3.954 1.929"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-300">اللاعب الأسود</h3>
                  <span className="text-xs text-slate-400">{turn === "black" ? "دور اللعب..." : "منتظر"}</span>
                </div>
              </div>
              <div className="bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 font-mono text-sm sm:text-base text-amber-400">
                {formatTime(blackTime)}
              </div>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border ${turn === "white" ? "bg-slate-700/90 border-red-500 shadow-lg shadow-red-500/20" : "bg-slate-900/40 border-slate-700/50"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-slate-400">
                  <svg className="w-6 h-6 fill-amber-50" viewBox="0 0 20 20">
                    <path d="M7.725 2.146c-1.016.756-1.289 1.953-1.239 2.59c.064.779.222 1.793.222 1.793s-.313.17-.313.854c.109 1.717.683.976.801 1.729c.284 1.814.933 1.491.933 2.481c0 1.649-.68 2.42-2.803 3.334C3.196 15.845 1 17 1 19v1h18v-1c0-2-2.197-3.155-4.328-4.072c-2.123-.914-2.801-1.684-2.801-3.334c0-.99.647-.667.932-2.481c.119-.753.692-.012.803-1.729c0-.684-.314-.854-.314-.854s.158-1.014.221-1.793c.065-.817-.398-2.561-2.3-3.096c-.333-.34-.558-.881.466-1.424c-2.24-.105-2.761 1.067-3.954 1.929"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">اللاعب الأبيض</h3>
                  <span className="text-xs text-slate-400">{turn === "white" ? "دور اللعب..." : "منتظر"}</span>
                </div>
              </div>
              <div className="bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 font-mono text-sm sm:text-base text-amber-400">
                {formatTime(whiteTime)}
              </div>
            </div>

          </div>

          <div className="flex flex-row lg:flex-col gap-3">
            {!isGameStarted ? (
              <button
                className="flex-1 py-3 px-6 rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold shadow-lg shadow-green-600/30 transition-all transform active:scale-95 text-center cursor-pointer"
                onClick={() => setIsGameStarted(true)}
              >
                بدء اللعب
              </button>
            ) : (
              <div className="flex-1 py-3 px-6 rounded-2xl bg-slate-700/50 text-emerald-400 font-bold border border-emerald-500/30 text-center flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                الجولة جارية
              </div>
            )}
            <button
              className="flex-1 py-3 px-6 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold border border-slate-600 transition-all transform active:scale-95 text-center cursor-pointer"
              onClick={resetGame}
            >
              إعادة ضبط
            </button>
          </div>

        </div>

        <div className="flex flex-col items-center bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-700 shadow-inner">
          
          <div className="rounded-2xl overflow-hidden border-4 border-slate-700 shadow-2xl bg-[#769656]">
            <div className="grid grid-cols-8">
              {Array.from({ length: size }).map((_, row) =>
                Array.from({ length: size }).map((_, col) => {
                  const square = letters[col] + numbers[row];
                  const isDark = (row + col) % 2 === 1;
                  const piece = pieces.find((p) => p.position === square);
                  const isSelected = selectedPiece?.position === square;
                  const isMoveTarget = moves.includes(square);

                  return (
                    <div
                      key={square}
                      onClick={() => {
                        if (!isGameStarted) return;
                        const pieceOnSquare = pieces.find((p) => p.position === square);

                        if (pieceOnSquare && pieceOnSquare.color === turn) {
                          setSelectedPiece(pieceOnSquare);
                          const validMoves = getValidMoves(
                            pieceOnSquare,
                            col,
                            row,
                            pieces,
                            lastMove
                          )
                            .map(([c, r]) => letters[c] + numbers[r])
                            .filter((sq) => safeMove(pieceOnSquare, sq, pieces));

                          setMoves(validMoves);
                          return;
                        }

                        if (selectedPiece && moves.includes(square)) {
                          movePiece(selectedPiece, square);
                          return;
                        }

                        setMoves([]);
                        setSelectedPiece(null);
                      }}
                      className={`
                        w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
                        flex items-center justify-center
                        text-3xl sm:text-4xl md:text-5xl
                        cursor-pointer transition-colors relative select-none
                        ${isDark ? "bg-[#769656]" : "bg-[#eeeed2]"}
                        ${isSelected ? "bg-amber-400/80!" : ""}
                        ${checkedKing === square ? "bg-red-500/80 animate-pulse" : ""}
                      `}
                    >
                      {row === 7 && (
                        <span className={`absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-bold pointer-events-none ${isDark ? "text-[#eeeed2]/80" : "text-[#769656]/90"}`}>
                          {letters[col]}
                        </span>
                      )}

                      {col === 7 && (
                        <span className={`absolute top-0.5 left-1 text-[10px] sm:text-xs font-bold pointer-events-none ${isDark ? "text-[#eeeed2]/80" : "text-[#769656]/90"}`}>
                          {numbers[row]}
                        </span>
                      )}

                      {isMoveTarget && (
                        <div className="absolute z-20 rounded-full w-4 h-4 sm:w-6 sm:h-6 bg-black/20 flex items-center justify-center">
                          <div className={`rounded-full ${piece ? "w-full h-full border-4 border-black/30" : "w-4 h-4 sm:w-5 sm:h-5 bg-black/25"}`}></div>
                        </div>
                      )}
                      
                      <span className={`transform transition-transform hover:scale-110 ${piece?.color === "white" ? "text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]" : "text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]"}`}>
                        {piece ? getPieceSymbol(piece.type, piece.color) : ""}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {promotion && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl text-center shadow-2xl max-w-sm w-full mx-4">
            <p className="mb-6 font-bold text-lg text-slate-200">اختر القطعة للترقية</p>
            <div className="flex justify-center gap-4 text-4xl sm:text-5xl">
              <button onClick={() => handlePromotion("queen")} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl transition transform hover:scale-110 cursor-pointer">{getPieceSymbol("queen", promotion.piece.color)}</button>
              <button onClick={() => handlePromotion("rook")} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl transition transform hover:scale-110 cursor-pointer">{getPieceSymbol("rook", promotion.piece.color)}</button>
              <button onClick={() => handlePromotion("bishop")} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl transition transform hover:scale-110 cursor-pointer">{getPieceSymbol("bishop", promotion.piece.color)}</button>
              <button onClick={() => handlePromotion("knight")} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl transition transform hover:scale-110 cursor-pointer">{getPieceSymbol("knight", promotion.piece.color)}</button>
            </div>
          </div>
        </div>
      )}

      {(mate === true || whiteTime === 0 || blackTime === 0) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="w-[90%] sm:w-[400px] bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-5 text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center text-3xl font-bold border border-amber-500/30">
              🏆
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-100">
                {mate ? "كش مات (Checkmate)!" : "انتهى الوقت!"}
              </h3>
              <p className="text-base text-amber-400 font-semibold mt-1">
                {mate ? `${win} يفوز باللعبة!` : (whiteTime === 0 ? "اللاعب الأسود يفوز بالوقت!" : "اللاعب الأبيض يفوز بالوقت!")}
              </p>
            </div>
            <button
              className="w-full py-3 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer"
              onClick={() => {
                resetGame();
                setWhiteTime(mytime);
                setBlackTime(mytime);
                setmate(false);
              }}
            >
              العب مرة أخرى
            </button>
          </div>
        </div>
      )}

    </div>
  );
}