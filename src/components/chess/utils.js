export function getPieceSymbol(type, color) {
  // استخدام الرموز المصمتة (Filled) لكل القطع لكي تكون واضحة وغير مفرغة
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