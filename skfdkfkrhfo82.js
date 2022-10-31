const todoListElem = document.querySelector(".todo-list");

const completeAllBtnElem = document.querySelector(".complete-all-btn");
const showAllBtnElem = document.querySelector(".show-all-btn"); // All버튼
const showActiveBtnElem = document.querySelector(".show-active-btn"); // Active 버튼
const showCompletedBtnElem = document.querySelector(".show-completed-btn"); // Completed 버튼
const clearCompletedBtnElem = document.querySelector(".clear-completed-btn"); // Completed Clear 버튼


let id = [];
const setId = (newId) => {id = newId};

let isAllCompleted = false;
const setIsAllCompleted = (bool) => { isAllCompleted = bool};

let currentShowType = "all";
const setCurrentShowType = (newShowType) => currentShowType = newShowType;

let todos = []; //여기 저장
const setTodos = (newTodos) => {
    todos = newTodos;
};

const getAllTodos = () => {
    return todos;
};

const todoInputElem = document.querySelector(".todo-input");


const getCompletedTodos = () =>{
    return todos.filter(todo => todo.isCompleted === true );
}

const completeAll = () => {
    completeAllBtnElem.classList.add("checked");
    const newTodos = getAllTodos().map(todo => ({ ...todo, isCompleted: true }))
    setTodos(newTodos)
}
const incompleteAll = () => {
    completeAllBtnElem.classList.remove("checked");
    const newTodos = getAllTodos().map(todo => ({ ...todo, isCompleted: false }));
    setTodos(newTodos)
}
const checkIsAllCompleted = () => {
    if (getAllTodos().length === getCompletedTodos().length) {
        setIsAllCompleted(true); //완료된 항목수가 전체항목수와 같으면 모두완료되었다는 뜻
        completeAllBtnElem.classList.add("checked");
    } else {
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove("checked");
    }
}

const leftItemsElem = document.querySelector(".left-items") // 완료되지 않은 리스트를 반환
const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false);
}

const setLeftItems = () => {
    const leftTodos = getActiveTodos()
    leftItemsElem.innerHTML = `${leftTodos.length} items left`
}

const onClickCompleteAll = () => {
    if(!getAllTodos().length) return;

    if(isAllCompleted) incompleteAll();
    else completeAll();
    setIsAllCompleted(!isAllCompleted);
    paintTodos();
    setLeftItems();
}



const appendTodos = (text) => {
    const newId = id++;
    const newTodos = getAllTodos().concat({ id: newId, isCompleted: false, content: text })
    setTodos(newTodos)
    setLeftItems()
    checkIsAllCompleted();
    paintTodos();
}

const deleteTodo = (todoId) => {
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );
    setTodos(newTodos);
    setLeftItems()
    paintTodos()
}

const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    setTodos(newTodos);
    paintTodos();
    setLeftItems()
    checkIsAllCompleted();
}


const updateTodo = (text, todoId) => {
    const currentTodos = getAllTodos();
    const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}

const clearCompletedTodos = () => {
    const newTodos = getActiveTodos()
    setTodos(newTodos)
    paintTodos();
}


const paintTodo = (todo) => {
    const todoItemElem = document.createElement("li");
    todoItemElem.classList.add("todo-item");

    todoItemElem.setAttribute("data-id", todo.id );

    const checkboxElem = document.createElement("div");
    checkboxElem.classList.add("checkbox");
    checkboxElem.addEventListener("click", () => completeTodo(todo.id))

    const todoElem = document.createElement("div");
    todoElem.classList.add("todo");
    todoElem.addEventListener("dblclick", (event) => onDbclickTodo(event, todo.id))
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement("button");
    delBtnElem.classList.add("delBtn");
    delBtnElem.addEventListener("click", () =>  deleteTodo(todo.id))
    delBtnElem.innerHTML = "X";

    if(todo.isCompleted) {
        todoItemElem.classList.add("checked");
        checkboxElem.innerText = "✔";
    }

    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);

    todoListElem.appendChild(todoItemElem);
}




const paintTodos = () => {
    todoListElem.innerHTML = null;

    switch (currentShowType) {
        case "all":
            const allTodos = getAllTodos();
            allTodos.forEach(todo => { paintTodo(todo);});
            break;
        case "active":
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => { paintTodo(todo);});
            break;
        case "completed":
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(todo => { paintTodo(todo);});
            break;
        default:
            break;
    }
}


const onClickShowTodosType = (e) => {
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;

    if ( currentShowType === newShowType ) return;

    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove("selected");

    currentBtnElem.classList.add("selected")
    setCurrentShowType(newShowType)
    paintTodos();
}

const init = () => {
    todoInputElem.addEventListener("keypress", (e) =>{
        if( e.key === "Enter" ){
            appendTodos(e.target.value); todoInputElem.value ="";
        }
    })
    completeAllBtnElem.addEventListener("click",  onClickCompleteAll);
    showAllBtnElem.addEventListener("click", onClickShowTodosType);
    showActiveBtnElem.addEventListener("click",onClickShowTodosType);
    showCompletedBtnElem.addEventListener ("click",onClickShowTodosType);
    clearCompletedBtnElem.addEventListener("click", clearCompletedTodos);
    setLeftItems()
}

init()

//어딘가 문제가 있는데 맞게 고친것 같으면 고장나고 분명 이게 틀린 버전이고 스파게티 코드인데 아무튼 작동은됨