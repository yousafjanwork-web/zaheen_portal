const OptionButton = ({
  text,
  onClick
}:{text:string,onClick:any}) => {

  return (

    <button
      onClick={onClick}
      className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl
      hover:border-blue-500 hover:bg-blue-50 transition"
    >

      {text}

    </button>

  )
}

export default OptionButton