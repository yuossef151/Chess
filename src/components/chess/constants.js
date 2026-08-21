export const size = 8;
export const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const numbers = ["8", "7", "6", "5", "4", "3", "2", "1"];

// ملاحظة: المواقع اتحولت لحروف كبيرة عشان تتطابق مع letters array
// (كانت بحروف صغيرة قبل كده وده كان بيمنع أي قطعة من الظهور على اللوح)
export const initialBoard = [
  // القطع السوداء
  { type: "rook", color: "black", position: "A8" },
  { type: "knight", color: "black", position: "B8" },
  { type: "bishop", color: "black", position: "C8" },
  { type: "queen", color: "black", position: "D8" },
  { type: "king", color: "black", position: "E8" },
  { type: "bishop", color: "black", position: "F8" },
  { type: "knight", color: "black", position: "G8" },
  { type: "rook", color: "black", position: "H8" },
  { type: "pawn", color: "black", position: "A7" },
  { type: "pawn", color: "black", position: "B7" },
  { type: "pawn", color: "black", position: "C7" },
  { type: "pawn", color: "black", position: "D7" },
  { type: "pawn", color: "black", position: "E7" },
  { type: "pawn", color: "black", position: "F7" },
  { type: "pawn", color: "black", position: "G7" },
  { type: "pawn", color: "black", position: "H7" },

  // القطع البيضاء
  { type: "pawn", color: "white", position: "A2" },
  { type: "pawn", color: "white", position: "B2" },
  { type: "pawn", color: "white", position: "C2" },
  { type: "pawn", color: "white", position: "D2" },
  { type: "pawn", color: "white", position: "E2" },
  { type: "pawn", color: "white", position: "F2" },
  { type: "pawn", color: "white", position: "G2" },
  { type: "pawn", color: "white", position: "H2" },
  { type: "rook", color: "white", position: "A1" },
  { type: "knight", color: "white", position: "B1" },
  { type: "bishop", color: "white", position: "C1" },
  { type: "queen", color: "white", position: "D1" },
  { type: "king", color: "white", position: "E1" },
  { type: "bishop", color: "white", position: "F1" },
  { type: "knight", color: "white", position: "G1" },
  { type: "rook", color: "white", position: "H1" },
];