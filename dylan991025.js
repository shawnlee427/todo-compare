const todoInputElem = document.querySelector(".todo-input");
const todoListElem = document.querySelector(".todo-list");
const completeAllBtnElem = document.querySelector(".complete-all-btn");
const leftItemsElem = document.querySelector(".left-items");
const showAllBtnElem = document.querySelector(".show-all-btn");
const showActiveBtnElem = document.querySelector(".show-active-btn");
const showCompletedBtnElem = document.querySelector(".show-completed-btn");
const clearCompletedBtnElem = document.querySelector(".clear-completed-btn");
const todoAddBtnElem = document.querySelector("#todo-btn-add");

let id = 0;
const setId = (newId) => {id = newId;};

let isAllCompleted = false;
const setIsAllCompleted = (bool) => { isAllCompleted = bool;};

let currentShowType = "all";
const setCurrentShowType = (newShowType) => currentShowType = newShowType;

let todos = [];
const setTodos = (newTodos) => {
    todos = newTodos;
};

const getAllTodos = () => {
    return todos;
};
const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true );
}
const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false);
}

const setLeftItems = () => {
    const leftTodos = getActiveTodos()
    leftItemsElem.innerHTML = `${leftTodos.length} items left`
}

const completeAll = () => {
    completeAllBtnElem.classList.add("checked");
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true }) )
    setTodos(newTodos)
}

const incompleteAll = () => {
    completeAllBtnElem.classList.remove("checked");
    const newTodos =  getAllTodos().map(todo => ({...todo, isCompleted: false }) );
    setTodos(newTodos)
}


const checkIsAllCompleted = () => {
    if(getAllTodos().length === getCompletedTodos().length ){
        setIsAllCompleted(true);
        completeAllBtnElem.classList.add("checked");
    }else {
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove("checked");
    }
}

const onClickCompleteAll = () => {
    if(!getAllTodos().length) return;

    if(isAllCompleted) incompleteAll();
    else completeAll();
    setIsAllCompleted(!isAllCompleted);
    paintTodos();
    setLeftItems()
}

const appendTodos = (text) => {
    const newId = id + 1;
    setId(newId)
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })
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

const onDbclickTodo = (e, todoId) => {
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement("input");
    inputElem.value = inputText;
    inputElem.classList.add("edit-input");
    inputElem.addEventListener("keypress", (e)=>{
        if(e.key === "Enter") {
            updateTodo(e.target.value, todoId);
            document.body.removeEventListener("click", onClickBody );
        }
    })

    const onClickBody = (e) => {
        if(e.target !== inputElem)  {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener("click", onClickBody );
        }
    }

    document.body.addEventListener("click", onClickBody)
    todoItemElem.appendChild(inputElem);
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
    todoAddBtnElem.addEventListener("click", () => {
        appendTodos(todoInputElem.value); todoInputElem.value = "";
    });
    todoInputElem.addEventListener("keypress", (e) =>{
        if( e.key === "Enter" ){
            appendTodos(e.target.value); todoInputElem.value ="";
        }

    });

    completeAllBtnElem.addEventListener("click",  onClickCompleteAll);
    showAllBtnElem.addEventListener("click", onClickShowTodosType);
    showActiveBtnElem.addEventListener("click",onClickShowTodosType);
    showCompletedBtnElem.addEventListener("click",onClickShowTodosType);
    clearCompletedBtnElem.addEventListener("click", clearCompletedTodos);
    setLeftItems()
}

init()