import { Option } from "../../shared/types/adaptive"
import OptionButton from "./OptionButton"

interface Props{
  prompt:string
  options:Option[]
  onSelect:(id:number)=>void
}

const QuestionCard = ({prompt, options, onSelect}:Props)=>{

  return(

    <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">

      <h2 className="text-2xl font-semibold mb-6 text-center">

        {prompt}

      </h2>

      <div className="space-y-4">

        {options.map((opt)=>(
          <OptionButton
            key={opt.id}
            text={opt.option_text}
            onClick={()=>onSelect(opt.id)}
          />
        ))}

      </div>

    </div>

  )
}

export default QuestionCard