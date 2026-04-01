import { letters, numbers, size } from "./constants";
import { getValidMoves } from "./moves";
export function isMoveSafe(piece, targetSquare, currentPieces, lastMove) {
  let testPieces = currentPieces.map((p) => ({ ...p }));

  testPieces = testPieces.filter(
    (p) => p.position !== targetSquare || p.id === piece.id,
  );

  testPieces = testPieces.map((p) =>
    p.id === piece.id ? { ...p, position: targetSquare } : p,
  );

  return !isKingInCheck(testPieces, piece.color, lastMove);
}
export function isKingInCheck(pieces, color, lastMove) {
  const king = pieces.find((p) => p.type === "king" && p.color === color);

  const enemyPieces = pieces.filter((p) => p.color !== color);

  for (let enemy of enemyPieces) {
    const col = letters.indexOf(enemy.position[0]);
    const row = size - 1 - numbers.indexOf(enemy.position[1]);

    const moves = getValidMoves(
      enemy,
      col,
      row,
      pieces,
      lastMove,
      isKingInCheck,
      isMoveSafe,
      true // 🔥 ignore castling
    );

    const kingPos = [
      letters.indexOf(king.position[0]),
      size - 1 - numbers.indexOf(king.position[1]),
    ];

    if (moves.some(([c, r]) => c === kingPos[0] && r === kingPos[1])) {
      return true;
    }
  }

  return false;
}
export function isCheckmate(color, currentPieces, lastMove) {
  if (!isKingInCheck(currentPieces, color, lastMove)) return false;

  const myPieces = currentPieces.filter((p) => p.color === color);

  for (let piece of myPieces) {
    const col = letters.indexOf(piece.position[0]);
    const row = size - 1 - numbers.indexOf(piece.position[1]);

    const moves = getValidMoves(
      piece,
      col,
      row,
      currentPieces,
      lastMove,
      isKingInCheck,
      isMoveSafe,
      true
    );

    for (let [c, r] of moves) {
      const square = letters[c] + numbers[size - 1 - r];

      if (isMoveSafe(piece, square, currentPieces, lastMove)) {
        return false;
      }
    }
  }

  return true;
}