import { letters, numbers } from "./constants";

export function isSquareAttacked(col, row, pieces, color) {
  const enemyColor = color === "white" ? "black" : "white";
  
  return pieces.some(p => {
    if (p.color !== enemyColor) return false;
    
    let moves = [];
    const c = letters.indexOf(p.position[0]);
    const r = numbers.indexOf(p.position[1]);

    if (p.type === "pawn") {
      const dir = p.color === "white" ? -1 : 1;
      moves = [[c + 1, r + dir], [c - 1, r + dir]];
    } else if (p.type === "knight") moves = getKnightMoves(c, r, pieces, p.color);
    else if (p.type === "bishop") moves = getBishopMoves(c, r, pieces, p.color);
    else if (p.type === "rook") moves = getRookMoves(c, r, pieces, p.color);
    else if (p.type === "queen") moves = getQueenMoves(c, r, pieces, p.color);
    else if (p.type === "king") {
        const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
        moves = dirs.map(([dx, dy]) => [c+dx, r+dy]);
    }

    return moves.some(move => move[0] === col && move[1] === row);
  });
}

export function getKnightMoves(col, row, pieces, color) {
  const moves = [];
  const possibleMoves = [
    [col + 1, row - 2], [col + 2, row - 1], [col + 1, row + 2], [col + 2, row + 1],
    [col - 1, row + 2], [col - 2, row + 1], [col - 1, row - 2], [col - 2, row - 1],
  ];
  possibleMoves.forEach(([c, r]) => {
    if (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const pieceOnSquare = pieces.find((p) => p.position === letters[c] + numbers[r]);
      if (!pieceOnSquare || pieceOnSquare.color !== color) moves.push([c, r]);
    }
  });
  return moves;
}

export function getBishopMoves(col, row, pieces, color) {
  const moves = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  directions.forEach(([dx, dy]) => {
    let c = col + dx, r = row + dy;
    while (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const target = pieces.find((p) => p.position === letters[c] + numbers[r]);
      if (!target) moves.push([c, r]);
      else { if (target.color !== color) moves.push([c, r]); break; }
      c += dx; r += dy;
    }
  });
  return moves;
}

export function getRookMoves(col, row, pieces, color) {
  const moves = [];
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  directions.forEach(([dx, dy]) => {
    let c = col + dx, r = row + dy;
    while (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const target = pieces.find((p) => p.position === letters[c] + numbers[r]);
      if (!target) moves.push([c, r]);
      else { if (target.color !== color) moves.push([c, r]); break; }
      c += dx; r += dy;
    }
  });
  return moves;
}

export function getQueenMoves(col, row, pieces, color) {
  return [...getRookMoves(col, row, pieces, color), ...getBishopMoves(col, row, pieces, color)];
}

export function getKingMoves(col, row, pieces, color, hasMoved) {
  const moves = [];
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

  directions.forEach(([dx, dy]) => {
    const c = col + dx, r = row + dy;
    if (c >= 0 && c < 8 && r >= 0 && r < 8) {
      const target = pieces.find((p) => p.position === letters[c] + numbers[r]);
      if (!target || target.color !== color) moves.push([c, r]);
    }
  });

  if (!hasMoved && !isSquareAttacked(col, row, pieces, color)) {
    const r = row;
    const rookRight = pieces.find(p => p.position === letters[7] + numbers[r] && p.type === "rook" && !p.hasMoved);
    if (rookRight && !pieces.find(p => p.position === letters[5] + numbers[r]) && !pieces.find(p => p.position === letters[6] + numbers[r])) {
      if (!isSquareAttacked(5, r, pieces, color) && !isSquareAttacked(6, r, pieces, color)) {
        moves.push([6, r]);
      }
    }
    const rookLeft = pieces.find(p => p.position === letters[0] + numbers[r] && p.type === "rook" && !p.hasMoved);
    if (rookLeft && !pieces.find(p => p.position === letters[1] + numbers[r]) && !pieces.find(p => p.position === letters[2] + numbers[r]) && !pieces.find(p => p.position === letters[3] + numbers[r])) {
      if (!isSquareAttacked(3, r, pieces, color) && !isSquareAttacked(2, r, pieces, color)) {
        moves.push([2, r]);
      }
    }
  }
  return moves;
}

export function getPawnMoves(col, row, pieces, color, lastMove) {
  const moves = [];
  const dir = color === "white" ? -1 : 1;
  const hasMoved = pieces.find((p) => p.position === letters[col] + numbers[row])?.hasMoved;
  
  if (!pieces.find((p) => p.position === letters[col] + numbers[row + dir])) {
    moves.push([col, row + dir]);
    if (!hasMoved && !pieces.find((p) => p.position === letters[col] + numbers[row + 2 * dir])) 
        moves.push([col, row + 2 * dir]);
  }

  [[col + 1, row + dir], [col - 1, row + dir]].forEach(([c, r]) => {
    const target = pieces.find((p) => p.position === letters[c] + numbers[r]);
    if (target && target.color !== color) moves.push([c, r]);
  });

  if (lastMove && lastMove.piece.type === "pawn" && lastMove.piece.color !== color) {
    const fromRow = parseInt(lastMove.from[1]);
    const toRow = parseInt(lastMove.to[1]);

    if (Math.abs(fromRow - toRow) === 2) {
      const enemyColIndex = letters.indexOf(lastMove.to[0]);
      const enemyRowIndex = numbers.indexOf(lastMove.to[1]);

      if (row === enemyRowIndex && Math.abs(col - enemyColIndex) === 1) {
        moves.push([enemyColIndex, enemyRowIndex + dir]);
      }
    }
  }

  return moves;
}

export function getValidMoves(piece, col, row, currentPieces, lastMove) {
  if (piece.type === "knight") return getKnightMoves(col, row, currentPieces, piece.color);
  if (piece.type === "bishop") return getBishopMoves(col, row, currentPieces, piece.color);
  if (piece.type === "rook") return getRookMoves(col, row, currentPieces, piece.color);
  if (piece.type === "pawn") return getPawnMoves(col, row, currentPieces, piece.color, lastMove);
  if (piece.type === "queen") return getQueenMoves(col, row, currentPieces, piece.color);
  if (piece.type === "king") return getKingMoves(col, row, currentPieces, piece.color, piece.hasMoved);
  return [];
}