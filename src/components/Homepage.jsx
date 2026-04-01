import { useEffect, useState } from "react";
import { getValidMoves } from "./chess/moves";

import { isKingInCheck, isCheckmate, isMoveSafe } from "./chess/rules";

import { getPieceSymbol } from "./chess/utils";
import { size, letters, numbers } from "./chess/constants";
export default function Homepage() {
  const initialPieces = [
    {
      id: "rook1",
      type: "rook",
      position: "A8",
      color: "black",
      hasMoved: false,
    },
    {
      id: "knight1",
      type: "knight",
      position: "B8",
      color: "black",
      hasMoved: false,
    },
    {
      id: "bishop1",
      type: "bishop",
      position: "C8",
      color: "black",
      hasMoved: false,
    },
    {
      id: "queen",
      type: "queen",
      position: "D8",
      color: "black",
      hasMoved: false,
    },
    {
      id: "king",
      type: "king",
      position: "E8",
      color: "black",
      hasMoved: false,
    },
    {
      id: "bishop2",
      type: "bishop",
      position: "F8",
      color: "black",
      hasMoved: false,
    },
    {
      id: "knight2",
      type: "knight",
      position: "G8",
      color: "black",
      hasMoved: false,
    },
    {
      id: "rook2",
      type: "rook",
      position: "H8",
      color: "black",
      hasMoved: false,
    },

    {
      id: "pawn1",
      type: "pawn",
      position: "A7",
      color: "black",
      hasMoved: false,
    },
    {
      id: "pawn2",
      type: "pawn",
      position: "B7",
      color: "black",
      hasMoved: false,
    },
    {
      id: "pawn3",
      type: "pawn",
      position: "C7",
      color: "black",
      hasMoved: false,
    },
    {
      id: "pawn4",
      type: "pawn",
      position: "D7",
      color: "black",
      hasMoved: false,
    },
    {
      id: "pawn5",
      type: "pawn",
      position: "E7",
      color: "black",
      hasMoved: false,
    },
    {
      id: "pawn6",
      type: "pawn",
      position: "F7",
      color: "black",
      hasMoved: false,
    },
    {
      id: "pawn7",
      type: "pawn",
      position: "G7",
      color: "black",
      hasMoved: false,
    },
    {
      id: "pawn8",
      type: "pawn",
      position: "H7",
      color: "black",
      hasMoved: false,
    },

    // 🔥 WHITE تحت
    {
      id: "rook3",
      type: "rook",
      position: "A1",
      color: "white",
      hasMoved: false,
    },
    {
      id: "knight3",
      type: "knight",
      position: "B1",
      color: "white",
      hasMoved: false,
    },
    {
      id: "bishop3",
      type: "bishop",
      position: "C1",
      color: "white",
      hasMoved: false,
    },
    {
      id: "queen2",
      type: "queen",
      position: "D1",
      color: "white",
      hasMoved: false,
    },
    {
      id: "king2",
      type: "king",
      position: "E1",
      color: "white",
      hasMoved: false,
    },
    {
      id: "bishop4",
      type: "bishop",
      position: "F1",
      color: "white",
      hasMoved: false,
    },
    {
      id: "knight4",
      type: "knight",
      position: "G1",
      color: "white",
      hasMoved: false,
    },
    {
      id: "rook4",
      type: "rook",
      position: "H1",
      color: "white",
      hasMoved: false,
    },

    {
      id: "pawn9",
      type: "pawn",
      position: "A2",
      color: "white",
      hasMoved: false,
    },
    {
      id: "pawn10",
      type: "pawn",
      position: "B2",
      color: "white",
      hasMoved: false,
    },
    {
      id: "pawn11",
      type: "pawn",
      position: "C2",
      color: "white",
      hasMoved: false,
    },
    {
      id: "pawn12",
      type: "pawn",
      position: "D2",
      color: "white",
      hasMoved: false,
    },
    {
      id: "pawn13",
      type: "pawn",
      position: "E2",
      color: "white",
      hasMoved: false,
    },
    {
      id: "pawn14",
      type: "pawn",
      position: "F2",
      color: "white",
      hasMoved: false,
    },
    {
      id: "pawn15",
      type: "pawn",
      position: "G2",
      color: "white",
      hasMoved: false,
    },
    {
      id: "pawn16",
      type: "pawn",
      position: "H2",
      color: "white",
      hasMoved: false,
    },
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
  function handlePromotion(choice) {
    const { piece, targetSquare } = promotion;

    setPieces((prev) => {
      let newPieces = prev
        .filter((p) => p.position !== targetSquare)
        .map((p) =>
          p.id === piece.id
            ? { ...p, position: targetSquare, type: choice }
            : p,
        );

      const nextTurn = piece.color === "white" ? "black" : "white";

      const king = newPieces.find(
        (p) => p.type === "king" && p.color === nextTurn,
      );

      if (checkMate(nextTurn, newPieces)) {
        setTimeout(() => {
          alert(`CHECKMATE 🔥 ${piece.color} wins`);
          resetGame();
        }, 0);
      } else if (checkKing(newPieces, nextTurn)) {
        setCheckedKing(king.position);
      } else {
        setCheckedKing(null);
      }

      return newPieces;
    });

    // 🔥 هنا بقى المهم
    setTurn(piece.color === "white" ? "black" : "white");

    setPromotion(null);
    setMoves([]);
    setSelectedPiece(null);
  }
  function movePiece(piece, targetSquare) {
    const from = piece.position;

    let enPassantCaptureId = null;

    // 🔥 EN PASSANT CHECK
    if (piece.type === "pawn" && lastMove) {
      const enemy = lastMove.piece;

      if (enemy.type === "pawn") {
        const fromRow = parseInt(lastMove.from[1]);
        const toRow = parseInt(lastMove.to[1]);

        // لو الخصم اتحرك خطوتين
        if (Math.abs(fromRow - toRow) === 2) {
          const enemyColIndex = letters.indexOf(lastMove.to[0]);
          const enemyRowIndex = size - 1 - numbers.indexOf(lastMove.to[1]);

          const myColIndex = letters.indexOf(from[0]);
          const myRowIndex = size - 1 - numbers.indexOf(from[1]);

          const targetColIndex = letters.indexOf(targetSquare[0]);
          const targetRowIndex = size - 1 - numbers.indexOf(targetSquare[1]);

          // 🔥 حركة قطرية
          const isDiagonal =
            Math.abs(targetColIndex - myColIndex) === 1 &&
            targetRowIndex !== myRowIndex;

          // 🔥 المربع فاضي
          const isEmpty = !pieces.find((p) => p.position === targetSquare);

          // 🔥 البيدق جنبك
          const isAdjacent =
            Math.abs(enemyColIndex - myColIndex) === 1 &&
            enemyRowIndex === myRowIndex;

          if (isDiagonal && isEmpty && isAdjacent) {
            enPassantCaptureId = enemy.id;
          }
        }
      }
    }

    // 🧠 سجل آخر حركة
    setLastMove({
      piece,
      from,
      to: targetSquare,
    });

    // 🔥 PROMOTION
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
        (p) => p.position !== targetSquare || p.id === piece.id,
      );

      newPieces = newPieces.map((p) =>
        p.id === piece.id
          ? { ...p, position: targetSquare, hasMoved: true }
          : p,
      );

      // 🔥 هنا نحسب check بعد الحركة
      const nextTurn = turn === "white" ? "black" : "white";

      const king = newPieces.find(
        (p) => p.type === "king" && p.color === nextTurn,
      );

      if (checkMate(nextTurn, newPieces)) {
        setTimeout(() => {
          alert(`CHECKMATE 🔥 ${turn} wins`);
          resetGame();
        }, 0);
      } else if (checkKing(newPieces, nextTurn)) {
        setCheckedKing(king.position);
      } else {
        setCheckedKing(null);
      }
      if (
        piece.type === "king" &&
        (targetSquare[0] === "G" || targetSquare[0] === "C")
      ) {
        const row = piece.color === "white" ? "1" : "8";

        if (targetSquare[0] === "G") {
          // تحريك القلعة اليمنى
          newPieces = newPieces.map((p) =>
            p.position === "H" + row
              ? { ...p, position: "F" + row, hasMoved: true }
              : p,
          );
        } else if (targetSquare[0] === "C") {
          // تحريك القلعة اليسرى
          newPieces = newPieces.map((p) =>
            p.position === "A" + row
              ? { ...p, position: "D" + row, hasMoved: true }
              : p,
          );
        }
      }
      return newPieces;
    });

    if (
      piece.type !== "pawn" ||
      (targetSquare[1] !== "8" && targetSquare[1] !== "1")
    ) {
      const nextTurn = turn === "white" ? "black" : "white";
      setTurn(nextTurn);
    }
    // 🧹 reset
    setMoves([]);
    setSelectedPiece(null);
  }

  function resetGame() {
    setPieces(initialPieces);
    setTurn("white");
    setMoves([]);
    setSelectedPiece(null);
    setPromotion(null);
    setLastMove(null);
    setCheckedKing(null);
  }
  useEffect(() => {
    localStorage.setItem("chessPieces", JSON.stringify(pieces));
    localStorage.setItem("chessTurn", turn);
    console.log(turn);
  }, [pieces, turn]);

  const checkKing = (pieces, color) =>
    isKingInCheck(pieces, color, getValidMoves, lastMove);

  const checkMate = (color, pieces) =>
    isCheckmate(color, pieces, getValidMoves, lastMove);

  const safeMove = (piece, square, pieces) =>
    isMoveSafe(piece, square, pieces, getValidMoves, lastMove);
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center py-4 md:py-7 bg-amber-300">
        <div className="flex flex-col items-center self-start lg:self-start lg:mt-10  ms-10 md:self-end md:mb-25 mb-4">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-20 md:w-20 md:h-20 bg-[#949494] ${
              turn === "white" ? "border-8 border-red-500" : ""
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20"><path fill="white" d="M7.725 2.146c-1.016.756-1.289 1.953-1.239 2.59c.064.779.222 1.793.222 1.793s-.313.17-.313.854c.109 1.717.683.976.801 1.729c.284 1.814.933 1.491.933 2.481c0 1.649-.68 2.42-2.803 3.334C3.196 15.845 1 17 1 19v1h18v-1c0-2-2.197-3.155-4.328-4.072c-2.123-.914-2.801-1.684-2.801-3.334c0-.99.647-.667.932-2.481c.119-.753.692-.012.803-1.729c0-.684-.314-.854-.314-.854s.158-1.014.221-1.793c.065-.817-.398-2.561-2.3-3.096c-.333-.34-.558-.881.466-1.424c-2.24-.105-2.761 1.067-3.954 1.929"></path></svg>
          </div>
          <p className="pt-2 text-xl sm:text-2xl md:text-2xl text-white">White</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex">
            <div className="w-4 sm:w-8" />
            {letters.map((l, i) => (
              <div
                key={i}
                className="w-10 h-5 sm:w-14 sm:h-8 md:w-18 md:h-9 flex items-center justify-center font-bold text-xs sm:text-sm md:text-lg"
              >
                {l}
              </div>
            ))}
            <div className="w-4 sm:w-8" />
          </div>

          <div className="flex">
            <div className="flex flex-col">
              {numbers.map((n, i) => (
                <div
                  key={i}
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 flex items-center justify-center font-bold text-xs sm:text-sm md:text-lg"
                >
                  {n}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-8 border-2 border-black">
              {Array.from({ length: size }).map((_, row) =>
                Array.from({ length: size }).map((_, col) => {
                  const square = letters[col] + numbers[size - 1 - row];
                  const isDark = (row + col) % 2 === 1;
                  const piece = pieces.find((p) => p.position === square);
                  const isChecked = checkedKing === square;

                  return (
                    <div
                      key={square}
                      onClick={() => {
                        const pieceOnSquare = pieces.find(
                          (p) => p.position === square,
                        );

                        if (pieceOnSquare && pieceOnSquare.color === turn) {
                          setSelectedPiece(pieceOnSquare);

                          const validMoves = getValidMoves(
                            pieceOnSquare,
                            col,
                            row,
                            pieces,
                            lastMove,
                            isKingInCheck,
                            isMoveSafe,
                          )
                            .map(([c, r]) => letters[c] + numbers[size - 1 - r])
                            .filter((square) =>
                              safeMove(pieceOnSquare, square, pieces),
                            );

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
                  w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 flex items-center justify-center text-xl sm:text-2xl md:text-4xl
                  ${isDark ? "bg-green-500" : "bg-white"} 
                  ${checkedKing === square ? "border-2 border-red-600" : ""}
                  relative
                `}
                    >
                      {moves.includes(square) && (
                        <div className="absolute z-20 rounded-full w-5 sm:w-7 md:w-9 h-5 sm:h-7 md:h-9 bg-[#e908087c]"></div>
                      )}
                      {piece ? getPieceSymbol(piece.type, piece.color) : ""}
                    </div>
                  );
                }),
              )}
            </div>

            <div className="flex flex-col">
              {numbers.map((n, i) => (
                <div
                  key={i}
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 flex items-center justify-center font-bold text-xs sm:text-sm md:text-lg"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            <div className="w-4 sm:w-8" />
            {letters.map((l, i) => (
              <div
                key={i}
                className="w-10 h-5 sm:w-14 sm:h-8 md:w-18 md:h-9 flex items-center justify-center font-bold text-xs sm:text-sm md:text-lg"
              >
                {l}
              </div>
            ))}
            <div className="w-4 sm:w-8" />
          </div>

        </div>

        <div className="flex flex-col items-center lg:self-end lg:mb-10 self-end me-10 md:self-start md:mt-25 mt-4">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-20 md:w-20 md:h-20 bg-[#949494] ${
              turn === "white" ? "" : "border-8 border-red-500"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="black" d="M7.725 2.146c-1.016.756-1.289 1.953-1.239 2.59c.064.779.222 1.793.222 1.793s-.313.17-.313.854c.109 1.717.683.976.801 1.729c.284 1.814.933 1.491.933 2.481c0 1.649-.68 2.42-2.803 3.334C3.196 15.845 1 17 1 19v1h18v-1c0-2-2.197-3.155-4.328-4.072c-2.123-.914-2.801-1.684-2.801-3.334c0-.99.647-.667.932-2.481c.119-.753.692-.012.803-1.729c0-.684-.314-.854-.314-.854s.158-1.014.221-1.793c.065-.817-.398-2.561-2.3-3.096c-.333-.34-.558-.881.466-1.424c-2.24-.105-2.761 1.067-3.954 1.929"></path></svg>
          </div>
          <p className="pt-2 text-xl sm:text-2xl md:text-2xl text-black">
            Black
          </p>
        </div>
          <button
            className="py-1 px-5 sm:py-2 sm:px-10 rounded-2xl mt-2 sm:mt-5 bg-green-400 text-sm sm:text-base"
            onClick={() => resetGame()}
          >
            reset
          </button>
        {promotion && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <p className="mb-4 font-bold text-lg">اختار القطعة</p>
              <div className="flex gap-4 text-3xl sm:text-4xl">
                <button onClick={() => handlePromotion("queen")}>♛</button>
                <button onClick={() => handlePromotion("rook")}>♜</button>
                <button onClick={() => handlePromotion("bishop")}>♝</button>
                <button onClick={() => handlePromotion("knight")}>♞</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
