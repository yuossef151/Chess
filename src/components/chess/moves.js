import { letters, numbers, size } from "./constants";
// import { isMoveSafe } from "./rules";

export function getKnightMoves(col, row, pieces, color) {
  const moves = [];

  const possibleMoves = [
    [col + 1, row - 2],
    [col + 2, row - 1],
    [col + 1, row + 2],
    [col + 2, row + 1],
    [col - 1, row + 2],
    [col - 2, row + 1],
    [col - 1, row - 2],
    [col - 2, row - 1],
  ];

  possibleMoves.forEach(([c, r]) => {
    if (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const square2 = letters[c] + numbers[size - 1 - r];

      const pieceOnSquare = pieces.find((p) => p.position === square2);

      if (!pieceOnSquare) {
        moves.push([c, r]);
      } else if (pieceOnSquare.color !== color) {
        moves.push([c, r]);
      }
    }
  });

  return moves;
}
export function getBishopMoves(col, row, pieces, color) {
  const moves = [];
  const directions = [
    [1, 1], // ↘
    [1, -1], // ↗
    [-1, 1], // ↙
    [-1, -1], // ↖
  ];

  directions.forEach(([dx, dy]) => {
    let c = col + dx;
    let r = row + dy;

    while (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const targetSquare = letters[c] + numbers[size - 1 - r];
      const blockingPiece = pieces.find((p) => p.position === targetSquare);

      if (!blockingPiece) {
        moves.push([c, r]);
      } else {
        if (blockingPiece.color !== color) {
          moves.push([c, r]);
        }
        break;
      }

      c += dx;
      r += dy;
    }
  });

  return moves;
}
export function getRookMoves(col, row, pieces, color) {
  const moves = [];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  directions.forEach(([dx, dy]) => {
    let c = col + dx;
    let r = row + dy;

    while (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const targetSquare = letters[c] + numbers[size - 1 - r];
      const blockingPiece = pieces.find((p) => p.position === targetSquare);

      if (!blockingPiece) {
        moves.push([c, r]);
      } else {
        if (blockingPiece.color !== color) {
          moves.push([c, r]);
        }
        break;
      }

      c += dx;
      r += dy;
    }
  });

  return moves;
}
export function getQueenMoves(col, row, pieces, color) {
  const moves = [];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1], // ↘
    [1, -1], // ↗
    [-1, 1], // ↙
    [-1, -1], // ↖
  ];

  directions.forEach(([dx, dy]) => {
    let c = col + dx;
    let r = row + dy;

    while (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const targetSquare = letters[c] + numbers[size - 1 - r];
      const blockingPiece = pieces.find((p) => p.position === targetSquare);

      if (!blockingPiece) {
        moves.push([c, r]);
      } else {
        if (blockingPiece.color !== color) {
          moves.push([c, r]);
        }
        break;
      }

      c += dx;
      r += dy;
    }
  });

  return moves;
}
export function getKingMoves(col, row, pieces, color) {
  const moves = [];
  const directions = [
    [1, 0], // يمين
    [-1, 0], // شمال
    [0, 1], // فوق
    [0, -1], // تحت
    [1, 1], // قطري ↘
    [1, -1], // قطري ↗
    [-1, 1], // قطري ↙
    [-1, -1], // قطري ↖
  ];

  directions.forEach(([dx, dy]) => {
    const c = col + dx;
    const r = row + dy;

    if (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const square = letters[c] + numbers[size - 1 - r];
      const target = pieces.find((p) => p.position === square);

      if (!target || target.color !== color) {
        moves.push([c, r]);
      }
    }
  });

  return moves;
}
export function getPawnMoves(col, row, pieces, color, lastMove) {
  const moves = [];
  const direction = color === "black" ? -1 : 1;

  // forward
  const forwardSquare = letters[col] + numbers[size - 1 - (row + direction)];
  const forwardPiece = pieces.find((p) => p.position === forwardSquare);

  if (!forwardPiece) {
    moves.push([col, row + direction]);

    const startRow = color === "black" ? 6 : 1;

    if (row === startRow) {
      const doubleForwardSquare =
        letters[col] + numbers[size - 1 - (row + 2 * direction)];

      if (!pieces.find((p) => p.position === doubleForwardSquare)) {
        moves.push([col, row + 2 * direction]);
      }
    }
  }

  // attacks العادي
  const attacks = [
    [col + 1, row + direction],
    [col - 1, row + direction],
  ];

  attacks.forEach(([c, r]) => {
    if (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const square = letters[c] + numbers[size - 1 - r];
      const target = pieces.find((p) => p.position === square);

      if (target && target.color !== color) {
        moves.push([c, r]);
      }
    }
  });
  if (!lastMove?.piece || lastMove.piece.type !== "pawn") {
    return moves;
  }
  // 🔥 EN PASSANT
// 🔥 EN PASSANT
if (!lastMove?.piece || lastMove.piece.type !== "pawn") {
  return moves;
}

if (!lastMove?.from || !lastMove?.to) return moves;

const fromRow = parseInt(lastMove.from[1]);
const toRow = parseInt(lastMove.to[1]);

// اتحرك خطوتين
if (Math.abs(fromRow - toRow) === 2) {
  const enemyCol = letters.indexOf(lastMove.to[0]);
  const enemyRow = size - 1 - numbers.indexOf(lastMove.to[1]);

  // لازم البيدق يكون جنبك
  if (Math.abs(enemyCol - col) === 1 && enemyRow === row) {
    const targetCol = enemyCol;
    const targetRow = row + direction;

    const targetSquare = letters[targetCol] + numbers[size - 1 - targetRow];

    const isEmpty = !pieces.find((p) => p.position === targetSquare);

    if (isEmpty) {
      moves.push([targetCol, targetRow]);
    }
  }
  }

  return moves;
}
export function getCastlingMoves(king, pieces, isKingInCheckFn, isMoveSafeFn) {
  const moves = [];

  // 🚨 1. لو الملك في check ممنوع castling
  if (isKingInCheckFn(pieces, king.color)) return moves;

  if (king.hasMoved) return moves;

  const row = king.color === "white" ? "1" : "8";

  // King side
  const rookK = pieces.find(
    (p) =>
      p.type === "rook" && p.color === king.color && p.position === "H" + row,
  );

  if (rookK && !rookK.hasMoved) {
    const squaresBetween = ["F" + row, "G" + row];

    if (
      squaresBetween.every((sq) => !pieces.find((p) => p.position === sq)) &&
      squaresBetween.every((sq) => isMoveSafeFn(king, sq, pieces))
    ) {
      moves.push("G" + row);
    }
  }

  // Queen side
  const rookQ = pieces.find(
    (p) =>
      p.type === "rook" && p.color === king.color && p.position === "A" + row,
  );

  if (rookQ && !rookQ.hasMoved) {
    const squaresBetween = ["B" + row, "C" + row, "D" + row];

    if (
      squaresBetween.every((sq) => !pieces.find((p) => p.position === sq)) &&
      ["C" + row, "D" + row].every((sq) => isMoveSafeFn(king, sq, pieces))
    ) {
      moves.push("C" + row);
    }
  }

  return moves;
}
export function getValidMoves(
  piece,
  col,
  row,
  currentPieces,
  lastMove,
  isKingInCheckFn,
  isMoveSafeFn,
  ignoreCastling = false,
) {
  if (piece.type === "knight")
    return getKnightMoves(col, row, currentPieces, piece.color);
  if (piece.type === "bishop")
    return getBishopMoves(col, row, currentPieces, piece.color);
  if (piece.type === "rook")
    return getRookMoves(col, row, currentPieces, piece.color);
  if (piece.type === "pawn")
    return getPawnMoves(col, row, currentPieces, piece.color, lastMove);
  if (piece.type === "queen")
    return getQueenMoves(col, row, currentPieces, piece.color);
  if (piece.type === "king") {
    const normalMoves = getKingMoves(col, row, currentPieces, piece.color);

    if (ignoreCastling) return normalMoves; // 🔥 مهم

    const castlingMoves = getCastlingMoves(
      piece,
      currentPieces,
      isKingInCheckFn,
      isMoveSafeFn,
    ).map((sq) => {
      const col = letters.indexOf(sq[0]);
      const row = size - 1 - numbers.indexOf(sq[1]);
      return [col, row];
    });

    return [...normalMoves, ...castlingMoves];
  }
  return [];
}
