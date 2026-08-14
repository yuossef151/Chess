import { letters, numbers, size } from "./constants";

export function getKnightMoves(col, row, pieces, color) {
  const moves = [];
  const possibleMoves = [
    [col + 1, row - 2], [col + 2, row - 1],
    [col + 1, row + 2], [col + 2, row + 1],
    [col - 1, row + 2], [col - 2, row + 1],
    [col - 1, row - 2], [col - 2, row - 1],
  ];

  possibleMoves.forEach(([c, r]) => {
    if (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const square2 = letters[c] + numbers[r];
      const pieceOnSquare = pieces.find((p) => p.position === square2);
      if (!pieceOnSquare || pieceOnSquare.color !== color) {
        moves.push([c, r]);
      }
    }
  });

  return moves;
}

export function getBishopMoves(col, row, pieces, color) {
  const moves = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  directions.forEach(([dx, dy]) => {
    let c = col + dx;
    let r = row + dy;
    while (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const targetSquare = letters[c] + numbers[r];
      const blockingPiece = pieces.find((p) => p.position === targetSquare);
      if (!blockingPiece) {
        moves.push([c, r]);
      } else {
        if (blockingPiece.color !== color) moves.push([c, r]);
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
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  directions.forEach(([dx, dy]) => {
    let c = col + dx;
    let r = row + dy;
    while (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const targetSquare = letters[c] + numbers[r];
      const blockingPiece = pieces.find((p) => p.position === targetSquare);
      if (!blockingPiece) {
        moves.push([c, r]);
      } else {
        if (blockingPiece.color !== color) moves.push([c, r]);
        break;
      }
      c += dx;
      r += dy;
    }
  });

  return moves;
}

export function getQueenMoves(col, row, pieces, color) {
  return [
    ...getRookMoves(col, row, pieces, color),
    ...getBishopMoves(col, row, pieces, color),
  ];
}

export function getKingMoves(col, row, pieces, color) {
  const moves = [];
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  directions.forEach(([dx, dy]) => {
    const c = col + dx;
    const r = row + dy;
    if (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const square = letters[c] + numbers[r];
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
  
  const direction = color === "white" ? -1 : 1;
  const currentPiece = pieces.find((p) => p.position === letters[col] + numbers[row]);
  const hasMoved = currentPiece ? currentPiece.hasMoved : false;

  const nextRow = row + direction;
  const forwardSquare = letters[col] + numbers[nextRow];
  
  if (nextRow >= 0 && nextRow < 8 && !pieces.find((p) => p.position === forwardSquare)) {
    moves.push([col, nextRow]);

    if (!hasMoved) {
      const doubleNextRow = row + 2 * direction;
      const doubleForwardSquare = letters[col] + numbers[doubleNextRow];
      if (!pieces.find((p) => p.position === doubleForwardSquare)) {
        moves.push([col, doubleNextRow]);
      }
    }
  }

  // الهجوم القطري العادي للبيدق
  const attacks = [[col + 1, nextRow], [col - 1, nextRow]];
  attacks.forEach(([c, r]) => {
    if (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const square = letters[c] + numbers[r];
      const target = pieces.find((p) => p.position === square);
      if (target && target.color !== color) {
        moves.push([c, r]);
      }
    }
  });

  // الأكل بالتجاوز (En Passant)
  if (lastMove && lastMove.piece.type === "pawn" && lastMove.piece.color !== color) {
    const fromRow = numbers.indexOf(lastMove.from[1]);
    const toRow = numbers.indexOf(lastMove.to[1]);

    // تحقق أن الخصم تحرك خطوتين في آخر حركة له
    if (Math.abs(fromRow - toRow) === 2) {
      const enemyCol = letters.indexOf(lastMove.to[0]);
      const enemyRow = numbers.indexOf(lastMove.to[1]);

      // إذا كان البيدق الحالي بجانب البيدق الخصم تماماً في نفس الصف
      if (row === enemyRow && Math.abs(col - enemyCol) === 1) {
        const targetRow = enemyRow + direction;
        if (targetRow >= 0 && targetRow < 8) {
          moves.push([enemyCol, targetRow]);
        }
      }
    }
  }

  return moves;
}

export function getValidMoves(piece, col, row, currentPieces, lastMove, ignoreCastling = false) {
  if (piece.type === "knight") return getKnightMoves(col, row, currentPieces, piece.color);
  if (piece.type === "bishop") return getBishopMoves(col, row, currentPieces, piece.color);
  if (piece.type === "rook") return getRookMoves(col, row, currentPieces, piece.color);
  if (piece.type === "pawn") return getPawnMoves(col, row, currentPieces, piece.color, lastMove);
  if (piece.type === "queen") return getQueenMoves(col, row, currentPieces, piece.color);
  if (piece.type === "king") return getKingMoves(col, row, currentPieces, piece.color);
  return [];
}