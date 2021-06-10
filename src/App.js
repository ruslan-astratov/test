import './App.css';
import {useState, useEffect, useRef } from "react"
import ListWithSelectedOptions from "./ListWithSelectedOptions"

function App() {

  const [isLoading, setLoading] = useState(false)

  const [dataFromFetch, setData] = useState([])

  // Выбранные опции
  const [selectedOptions, setOptions] = useState([])

  // Коллекция состояний.  Здесь будет храниться 10 последних состояний
  const [collectionOfState, setCollectionOfState] = useState([])


  


  useEffect( ()=> {

    // Это чистая функция, которая на вход примет массив и вернёт наружу уже  массив с массивами
    const recursiveFuncForCreateArrayWithNestedArrays = (arr) => {
      let generatedArrayWithNestedArrays

      let arrayForStrings = []

      let arrayForNumbers = []

      let arrayForBoolean = []

      recursion(arr)

      function recursion(somearr) {

        for( let i = 0; i < somearr.length; i++ ) {

          // Если элемент массива - это тоже массив, нам нужно будет снова его перебрать
          if(somearr[i] instanceof Array) {
            
            // Запускаем рекурсивную функцию 
            recursion(somearr[i])
          }
  
          // В противном же случае,  если это НЕ массив , мы должны раскидать примитивные значения по отдельным массивам
          else {

            // Если строка
            if( typeof somearr[i] === 'string') {
              arrayForStrings.push(somearr[i])
            }

            // Если число
            else if(typeof somearr[i] === 'number') {
              arrayForNumbers.push(somearr[i])
            }

            // Если булевый тип данных
            else if(typeof somearr[i] === 'boolean') {
              arrayForBoolean.push(somearr[i])
            }

          }
        }
      }

      generatedArrayWithNestedArrays = [ arrayForStrings, arrayForNumbers, arrayForBoolean ]
      
      console.log("Наш массив с массивами", generatedArrayWithNestedArrays)



      return generatedArrayWithNestedArrays
    }

    setLoading(true)

    fetch("https://raw.githubusercontent.com/WilliamRu/TestAPI/master/db.json")
      .then( responseBody  => responseBody.json())
      .then( jsObj => {

        setLoading(false)

        // Полученные данные (объект) преобразовали (то есть получили массив массивов) и установили в стейт
        setData(recursiveFuncForCreateArrayWithNestedArrays(jsObj.testArr))

        console.log("Наш массив с массивами", dataFromFetch)

      })

  }, [] )


  // Очистка состояния
  const handleClickResetAll = ()=> {

    setOptions([])
    
  }

  

  // Функция, срабатывающая при выборе опций
  const handleChange = (e)=> {

    let copySelectedOptions = []

    let options = e.target.options;

    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        
        copySelectedOptions.push(options[i].value);
      }
    }

    // Избавляемся от дублирования значений 
    let  uniqueSelectedOptions = Array.from(new Set(copySelectedOptions));

    setOptions(uniqueSelectedOptions)

    let collection = collectionOfState.slice()

    // Если длина нашего массива (коллекция состояний) не больше 10
    if(collection.length < 10) {
      collection.push(selectedOptions)
    }

    else {
      collection.pop()

      collection.push(selectedOptions)
    }

    setCollectionOfState(collection)

  }
  

  // Отмена последнего действия
  const handleClickCancelLastAction = ()=> {

    // Если наша коллекция состояний collectionOfState имеет длину больше 1, то мы удаляем из неё последний элемент и в качестве выбранных опций (selectedOptions)
    // устанавливаем ПРЕДЫДУЩЕЕ состояние из коллекции collectionOfState

    if(collectionOfState.length > 1) {

      let copyCollectionOfState = collectionOfState.slice()

      // Удаляем последний элемент из коллекции
      copyCollectionOfState.pop()

      // Теперь перезаписываем коллекцию 
      setCollectionOfState(copyCollectionOfState)



      // Устанавливаем в качестве текущих выбранных опций - последний элемент коллекции состояний
      setOptions( copyCollectionOfState[ copyCollectionOfState.length - 1 ] )

    }

    else if( collectionOfState.length === 1 ) {
      setCollectionOfState([])

      setOptions([])
    }

  }


  return (
    <div className="App">
      
      <div className="container">
        <header className="header">

          <button onClick={handleClickResetAll}>Сбросить состояние до изначального</button>

          <button onClick={handleClickCancelLastAction}>Отмена последнего действия</button>





          {isLoading && <h2>Идёт загрузка...</h2>}

          {dataFromFetch.length > 0 && dataFromFetch.map( (arr, idx) => {
            return (
              <select key={idx} multiple onChange={handleChange}>

                  {arr.map( (option, idx) => {
                    return <option key={idx}>{ typeof option === 'boolean' ? String(option)  : option }</option>
                  } )}

              </select>
            )
          } )}

          <br/>

          <br/>


          { selectedOptions.length > 0 && <ListWithSelectedOptions selectedOptions={selectedOptions}/> }
        

        </header>
      </div>

    </div>
  );
}

export default App;



// const handleChange = (e)=> {

//   console.log("Коллекция состояний", collectionOfState)

//   let options = e.target.options;

//   for (let i = 0, l = options.length; i < l; i++) {
//     if (options[i].selected) {

      

//       selectedOptions.push(options[i].value);
//     }
//   }

//   // Избавляемся от дублирования значений 
//   let  uniqueSelectedOptions = Array.from(new Set(selectedOptions));

//   setOptions(uniqueSelectedOptions)

//   let collection = collectionOfState.slice()

//   // Если длина нашего массива (коллекция состояний) не больше 10
//   if(collection.length < 10) {
//     collection.push(selectedOptions)
//   }

//   else {
//     collection.pop()

//     collection.push(selectedOptions)
//   }

//   setCollectionOfState(collection)

// }
