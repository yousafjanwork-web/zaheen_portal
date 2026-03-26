const LivesIndicator = ({lives}:{lives:number}) => {

  return (

    <div className="flex gap-2 justify-center text-xl">

      {Array.from({length:lives}).map((_,i)=>(

        <span key={i}>❤️</span>

      ))}

    </div>

  )
}

export default LivesIndicator