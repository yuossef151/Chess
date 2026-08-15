export function getPieceSymbol(type, color) {
  switch (type) {
    case "pawn": return "♟︎";
    case "rook": return "♜";
    case "knight": return "♞";
    case "bishop": return "♝";
    case "queen": return "♛";
    case "king": return "♚";
    default: return "";
  }
}