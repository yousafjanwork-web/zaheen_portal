const GameCard = ({ game, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-3xl shadow-lg cursor-pointer transform hover:scale-105 transition ${game.color}`}
    >
      <div className="text-5xl mb-3 text-center">{game.emoji}</div>
      <h2 className="text-lg font-bold text-center">{game.title}</h2>
      <p className="text-center text-sm opacity-70">{game.urdu}</p>
    </div>
  );
};

export default GameCard;