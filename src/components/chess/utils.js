export  function getPieceSymbol(type, color) {
    if (color === "black") {
      switch (type) {
        case "pawn":
          return "♟︎";
        case "rook":
          return "♜";
        case "knight":
          return "♞";
        case "bishop":
          return "♝";
        case "queen":
          return "♛";
        case "king":
          return "♚";
        default:
          return "";
      }
    } else {
      // white pieces
      switch (type) {
        case "pawn":
          return "♙";
        case "rook":
          return "♖";
        case "knight":
          return "♘";
        case "bishop":
          return "♗";
        case "queen":
          return "♕";
        case "king":
          return "♔";
        default:
          return "";
      }
    }
  }
