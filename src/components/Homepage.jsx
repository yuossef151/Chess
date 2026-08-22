import React, { useState } from "react";
import { useChessGame, getPieceSymbol, formatTime } from "./chess/utils";
import { size, letters, numbers } from "./chess/constants";

export default function Homepage() {
  const {
    pieces,
    turn,
    moves,
    selectedPiece,
    promotion,
    checkedKing,
    mate,
    showWinModal,
    win,
    timerMode,
    matchTimeSetting,
    moveTimeSetting,
    whiteTime,
    blackTime,
    isGameStarted,
    currentTimeSetting,
    roomCode,
    inputRoom,
    inRoom,
    playerColor,
    opponentConnected,
    setIsGameStarted,
    setWhiteTime,
    setBlackTime,
    setRoomCode,
    setInputRoom,
    setInRoom,
    createRoom,
    joinRoom,
    startPassAndPlay,
    handlePromotion,
    resetGame,
    handleTimerModeChange,
    handleMatchTimeChange,
    handleMoveTimeChange,
    handleSquareClick,
    leaveRoom,
  } = useChessGame();

  const [roomError, setRoomError] = useState("");

  const isBlackPlayer = playerColor === "black";
  const isGuestInRoom = inRoom && playerColor === "black";
  const isHost = inRoom && playerColor === "white";

  const handleCreateRoomClick = () => {
    createRoom();
    setRoomError("");
  };

  const handleJoin = async () => {
    if (!inputRoom.trim()) {
      setRoomError("برجاء كتابة كود الغرفة أولاً");
      return;
    }

    setRoomError("");
    try {
      const result = await joinRoom(inputRoom);
      if (!result) {
        setRoomError(
          "كود الغرفة غير صحيح أو غير موجود، تأكد من الكود وحاول مجدداً."
        );
      }
      // لو result === true، هنسيب socket.on("room-joined") في utils.js
      // هي اللي تحدّث الـ state (setInRoom, setPlayerColor...) تلقائيًا
    } catch (err) {
      setRoomError(
        "كود الغرفة غير صحيح أو غير موجود، تأكد من الكود وحاول مجدداً."
      );
    }
  };

  const handleLeaveRoom = () => {
    resetGame();
    leaveRoom();
    setRoomError("");
  };

  return (
    <div
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center md:p-6 font-sans relative"
      dir="rtl"
    >
      {!isGameStarted ? (
        <div className="w-full max-w-md bg-slate-800/85 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/60 p-5 sm:p-6 flex flex-col gap-5">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Chess Arena
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              اختار الإعدادات وابدأ المواجهة
            </p>
          </div>

          {/* إدارة الغرفة */}
          <div className="flex flex-col gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
            <label className="text-xs text-slate-400 font-semibold text-right">
              إدارة الغرفة (لعب مع صديق):
            </label>

            {!inRoom ? (
              <div className="flex flex-col gap-3">
                {/* خانة الكتابة وزر الانضمام */}
                <div className="flex gap-2 w-full" dir="ltr">
                  <button
                    type="button"
                    onClick={handleJoin}
                    className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                  >
                    انضمام
                  </button>
                  <input
                    type="text"
                    placeholder="اكتب كود الغرفة"
                    value={inputRoom}
                    onChange={(e) => {
                      setInputRoom(e.target.value.toUpperCase());
                      if (roomError) setRoomError("");
                    }}
                    className="flex-1 bg-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-600 focus:outline-none uppercase text-right"
                  />
                </div>
                {roomError && (
                  <span className="text-[11px] text-red-400 font-medium px-1">
                    {roomError}
                  </span>
                )}

                {/* زر إنشاء غرفة جديدة مرتبة في السطر التالي لتجنب التداخل */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    أو أنشئ غرفة جديدة:
                  </span>
<button
  type="button"
  onClick={() => {
    console.log("BUTTON CLICKED!!!");
    handleCreateRoomClick();
  }}
  className="py-2 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold rounded-xl transition cursor-pointer"
>
  إنشاء كود جديد
</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-1">
                {isHost && (
                  <span className="text-xs text-slate-300">
                    الكود المقترح:{" "}
                    <strong
                      className="text-amber-400 font-mono text-base"
                      dir="ltr"
                    >
                      {roomCode}
                    </strong>
                  </span>
                )}
                <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200">
                  لونك في هذه الجولة:{" "}
                  <strong
                    className={
                      playerColor === "white" ? "text-white" : "text-amber-400"
                    }
                  >
                    {playerColor === "white" ? "الأبيض ⚪" : "الأسود ⚫"}
                  </strong>
                </span>
                <span className="text-[11px] text-slate-400">
                  {opponentConnected
                    ? "🟢 الخصم متصل الآن"
                    : "⏳ بانتظار اتصال الخصم..."}
                </span>
              </div>
            )}
          </div>

          {!inRoom && (
            <div className="flex flex-col gap-3 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-700/50">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-semibold">
                  نوع التوقيت:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleTimerModeChange("match")}
                    className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      timerMode === "match"
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    وقت المباراة
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimerModeChange("move")}
                    className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      timerMode === "move"
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    وقت النقلة
                  </button>
                </div>
              </div>

              {timerMode === "match" ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-semibold">
                    وقت البداية (لكل لاعب):
                  </label>
                  <select
                    value={matchTimeSetting}
                    onChange={(e) =>
                      handleMatchTimeChange(Number(e.target.value))
                    }
                    className="bg-slate-800 text-slate-200 text-sm font-bold p-2.5 rounded-xl border border-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option value={60}>دقيقة واحدة (رصاصي)</option>
                    <option value={180}>3 دقائق (خاطف)</option>
                    <option value={300}>5 دقائق (خاطف)</option>
                    <option value={600}>10 دقائق (سريع)</option>
                    <option value={900}>15 دقيقة</option>
                    <option value={1800}>30 دقيقة (كلاسيكي)</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-semibold">
                    وقت النقلة (لكل نقلة):
                  </label>
                  <select
                    value={moveTimeSetting}
                    onChange={(e) =>
                      handleMoveTimeChange(Number(e.target.value))
                    }
                    className="bg-slate-800 text-slate-200 text-sm font-bold p-2.5 rounded-xl border border-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option value={30}>30 ثانية للنقلة</option>
                    <option value={60}>دقيقة واحدة للنقلة</option>
                    <option value={120}>دقيقتان للنقلة</option>
                    <option value={300}>5 دقائق للنقلة</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2.5 mt-1">
            {!inRoom && (
              <button
                type="button"
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold shadow-lg shadow-green-600/30 transition-all transform active:scale-95 text-center cursor-pointer"
                onClick={startPassAndPlay}
              >
                مرر والعب (Pass & Play)
              </button>
            )}

            {isHost && (
              <button
                type="button"
                className={`w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg transition-all transform active:scale-95 text-center cursor-pointer text-xs ${
                  !opponentConnected ? "opacity-70" : ""
                }`}
                onClick={() => setIsGameStarted(true)}
              >
                {opponentConnected
                  ? "بدء اللعب مع الصديق (Online)"
                  : "انتظار انضمام الصديق لبدء اللعب..."}
              </button>
            )}

            {isGuestInRoom && (
              <div className="text-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                <p className="text-xs text-blue-400 font-bold">
                  {opponentConnected
                    ? "تم الانضمام بنجاح! في انتظار المضيف لبدء اللعبة..."
                    : "جاري الاتصال بالغرفة..."}
                </p>
              </div>
            )}

            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold border border-slate-600 transition-all transform active:scale-95 text-center cursor-pointer text-xs"
              onClick={handleLeaveRoom}
            >
              {inRoom ? "مغادرة الغرفة" : "إعادة ضبط"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full max-w-lg mx-auto">
          {/* معلومات الخصم */}
          <div className="m-4 w-[90%]">
            <div
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border ${
                turn === (isBlackPlayer ? "white" : "black")
                  ? "bg-slate-800 border-red-500 shadow-lg shadow-red-500/20"
                  : "bg-slate-800/60 border-slate-700/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl ${
                    isBlackPlayer
                      ? "bg-amber-50 border-slate-600"
                      : "bg-black border-slate-400"
                  } flex items-center justify-center border`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      isBlackPlayer ? "fill-black" : "fill-amber-50"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M7.725 2.146c-1.016.756-1.289 1.953-1.239 2.59c.064.779.222 1.793.222 1.793s-.313.17-.313.854c.109 1.717.683.976.801 1.729c.284 1.814.933 1.491.933 2.481c0 1.649-.68 2.42-2.803 3.334C3.196 15.845 1 17 1 19v1h18v-1c0-2-2.197-3.155-4.328-4.072c-2.123-.914-2.801-1.684-2.801-3.334c0-.99.647-.667.932-2.481c.119-.753.692-.012.803-1.729c0-.684-.314-.854-.314-.854s.158-1.014.221-1.793c.065-.817-.398-2.561-2.3-3.096c-.333-.34-.558-.881.466-1.424c-2.24-.105-2.761 1.067-3.954 1.929"></path>
                  </svg>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-sm text-slate-200">
                    {isBlackPlayer
                      ? "اللاعب الأبيض (الخصم)"
                      : "اللاعب الأسود (الخصم)"}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {turn === (isBlackPlayer ? "white" : "black")
                      ? "دور اللعب..."
                      : "منتظر"}
                  </span>
                </div>
              </div>
              <div
                className="bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 font-mono text-base text-amber-400"
                dir="ltr"
              >
                {formatTime(isBlackPlayer ? whiteTime : blackTime)}
              </div>
            </div>
          </div>

          {/* رقعة الشطرنج */}
          <div className="flex flex-col items-center rounded-3xl w-full">
            <div className="overflow-hidden w-full aspect-square border-4 border-slate-700 rounded-3xl">
              <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                {numbers.map((num, rowIndex) =>
                  letters.map((lettr, colIndex) => {
                    // ✅ تم تصحيح اتجاه القلب (flip):
                    // الأبيض يشوف رانك 8 فوق ورانك 1 (بتاعه) تحت
                    // الأسود يشوف رانك 1 فوق ورانك 8 (بتاعه) تحت
                    const row = isBlackPlayer ? 7 - rowIndex : rowIndex;
                    const col = isBlackPlayer ? 7 - colIndex : colIndex;

                    const square = letters[col] + numbers[row];
                    const isDark = (row + col) % 2 === 1;
                    const piece = pieces.find((p) => p.position === square);
                    const isSelected = selectedPiece?.position === square;
                    const isMoveTarget = moves.includes(square);

                    return (
                      <div
                        key={square}
                        onClick={() => handleSquareClick(square)}
                        className={`
                          w-full h-full
                          flex items-center justify-center
                          text-4xl sm:text-4xl md:text-5xl
                          cursor-pointer transition-colors relative select-none
                          ${isDark ? "bg-[#769656]" : "bg-[#eeeed2]"}
                          ${isSelected ? "!bg-amber-400/80" : ""}
                          ${
                            checkedKing === square
                              ? "bg-red-500/80 animate-pulse"
                              : ""
                          }
                        `}
                      >
                        {colIndex === 7 && (
                          <span
                            className={`absolute bottom-0.5 right-1 text-[9px] sm:text-xs font-bold pointer-events-none ${
                              isDark ? "text-[#eeeed2]/80" : "text-[#769656]/90"
                            }`}
                            dir="ltr"
                          >
                            {letters[col]}
                          </span>
                        )}

                        {rowIndex === 7 && (
                          <span
                            className={`absolute top-0.5 left-1 text-[9px] sm:text-xs font-bold pointer-events-none ${
                              isDark ? "text-[#eeeed2]/80" : "text-[#769656]/90"
                            }`}
                            dir="ltr"
                          >
                            {numbers[row]}
                          </span>
                        )}

                        {isMoveTarget && (
                          <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
                            {piece ? (
                              <div className="absolute inset-1 rounded-2xl border-4 border-black/20 bg-black/10"></div>
                            ) : (
                              <div className="w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-black/25"></div>
                            )}
                          </div>
                        )}

                        <span className="absolute inset-0 flex items-center justify-center transform transition-transform hover:scale-110">
                          {piece ? (
                            <img
                              src={getPieceSymbol(piece.type, piece.color)}
                              alt={`${piece.color} ${piece.type}`}
                              className="w-4/5 h-4/5 object-contain drop-shadow-md select-none pointer-events-none"
                            />
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* معلومات اللاعب الحالي */}
          <div className="m-4 w-[90%]">
            <div
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border ${
                turn === (isBlackPlayer ? "black" : "white")
                  ? "bg-slate-800 border-red-500 shadow-lg shadow-red-500/20"
                  : "bg-slate-800/60 border-slate-700/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl ${
                    isBlackPlayer
                      ? "bg-black border-slate-400"
                      : "bg-amber-50 border-slate-600"
                  } flex items-center justify-center border`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      isBlackPlayer ? "fill-amber-50" : "fill-black"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M7.725 2.146c-1.016.756-1.289 1.953-1.239 2.59c.064.779.222 1.793.222 1.793s-.313.17-.313.854c.109 1.717.683.976.801 1.729c.284 1.814.933 1.491.933 2.481c0 1.649-.68 2.42-2.803 3.334C3.196 15.845 1 17 1 19v1h18v-1c0-2-2.197-3.155-4.328-4.072c-2.123-.914-2.801-1.684-2.801-3.334c0-.99.647-.667.932-2.481c.119-.753.692-.012.803-1.729c0-.684-.314-.854-.314-.854s.158-1.014.221-1.793c.065-.817-.398-2.561-2.3-3.096c-.333-.34-.558-.881.466-1.424c-2.24-.105-2.761 1.067-3.954 1.929"></path>
                  </svg>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-sm text-slate-100">
                    {isBlackPlayer
                      ? "اللاعب الأسود (أنت)"
                      : "اللاعب الأبيض (أنت)"}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {turn === (isBlackPlayer ? "black" : "white")
                      ? "دور اللعب..."
                      : "منتظر"}
                  </span>
                </div>
              </div>
              <div
                className="bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 font-mono text-base text-amber-400"
                dir="ltr"
              >
                {formatTime(isBlackPlayer ? blackTime : whiteTime)}
              </div>
            </div>
          </div>

          <div className="m-4 w-[90%]">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold border border-red-500/40 transition-all text-center cursor-pointer text-sm mt-1"
              onClick={handleLeaveRoom}
            >
              انسحاب
            </button>
          </div>
        </div>
      )}

      {/* نافذة الترقية */}
      {promotion &&
        (() => {
          const piece = promotion.piece;
          return (
            <div className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl text-center shadow-2xl max-w-sm w-full mx-4">
                <p className="mb-6 font-bold text-lg text-slate-200">
                  اختر القطعة للترقية
                </p>
                <div className="flex justify-center gap-4 text-4xl sm:text-5xl">
                  <button
                    type="button"
                    onClick={() => handlePromotion("queen")}
                    className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl transition transform hover:scale-110 cursor-pointer flex items-center justify-center w-16 h-16"
                  >
                    <img
                      src={getPieceSymbol("queen", piece.color)}
                      alt="queen"
                      className="w-4/5 h-4/5 object-contain select-none pointer-events-none"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePromotion("rook")}
                    className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl transition transform hover:scale-110 cursor-pointer flex items-center justify-center w-16 h-16"
                  >
                    <img
                      src={getPieceSymbol("rook", piece.color)}
                      alt="rook"
                      className="w-4/5 h-4/5 object-contain select-none pointer-events-none"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePromotion("bishop")}
                    className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl transition transform hover:scale-110 cursor-pointer flex items-center justify-center w-16 h-16"
                  >
                    <img
                      src={getPieceSymbol("bishop", piece.color)}
                      alt="bishop"
                      className="w-4/5 h-4/5 object-contain select-none pointer-events-none"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePromotion("knight")}
                    className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl transition transform hover:scale-110 cursor-pointer flex items-center justify-center w-16 h-16"
                  >
                    <img
                      src={getPieceSymbol("knight", piece.color)}
                      alt="knight"
                      className="w-4/5 h-4/5 object-contain select-none pointer-events-none"
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* نافذة الفوز */}
      {showWinModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="w-[90%] sm:w-[400px] bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-5 text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center text-3xl font-bold border border-amber-500/30">
              🏆
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-100">
                كش مات (Checkmate)!
              </h3>
              <p className="text-base text-amber-400 font-semibold mt-1">
                {win === "white" ? "اللاعب الأبيض" : "اللاعب الأسود"} يفوز
                باللعبة!
              </p>
            </div>
            <button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer"
              onClick={resetGame}
            >
              العب مرة أخرى
            </button>
          </div>
        </div>
      )}
    </div>
  );
}