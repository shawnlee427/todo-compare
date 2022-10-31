const todoWriteElem = document.querySelector('.todo-write');
const todoListElem = document.querySelector('.todo-list');
const completeAllBtnElem = document.querySelector('.complete-all-btn');
const leftMissionsElem = document.querySelector('.left-missions')
const showAllBtnElem = document.querySelector('.show-all-btn');
const showActiveBtnElem = document.querySelector('.show-active-btn');
const showCompletedBtnElem = document.querySelector('.show-completed-btn');
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');
// Orders that connects elements from html and javascript

let id = 0;
const setId = (newId) => {id = newId};

let isAllCompleted = false; // Determine whether mission is complete or not
const setIsAllCompleted = (bool) => { isAllCompleted = bool};

let currentShowType = 'all'; // Place border on buttons (all/active/complete )
const setCurrentShowType = (newShowType) => currentShowType = newShowType

let todos = []; //Always leave this part blank. Wrong example found in todo.html
const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos = () => {
    return todos;
}
const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false); //false = completed에서 아닌것 출력
}
 
const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true ); //true = completed에서 해당되는거 출력
}
const setLeftMissions = () => {
    const leftTodos = getActiveTodos() //Active = Left Missions
    leftMissionsElem.innerHTML = `${leftTodos.length} missions left` 
//When you add something in the mission list, it creates an inner element. Depending on the data, the inner html is reflected
}
const completeAll = () => {
    completeAllBtnElem.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true }) )//Get all missions to be considered true for completed
    setTodos(newTodos)
}

const incompleteAll = () => {
    completeAllBtnElem.classList.remove('checked');
    const newTodos =  getAllTodos().map(todo => ({...todo, isCompleted: false }) );//Get all missions to be considered false for completed
    setTodos(newTodos)
}

// Determine wheter all missions have been completed or not * It's not for individual mission. 
const checkIsAllCompleted = () => {
    if(getAllTodos().length === getCompletedTodos().length ){
        setIsAllCompleted(true);
        completeAllBtnElem.classList.add('checked');
    }else {
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove('checked');
    }
}

const onClickCompleteAll = () => {
    if(!getAllTodos().length) return; // Even if you dont right anything in the mision box, create a null mission task
    if(isAllCompleted) incompleteAll(); // isAllCompleted = false, Display as not accomplished. 
    else completeAll(); // isAllCompleted = false, Display all missions done. 
    setIsAllCompleted(!isAllCompleted); 
    paintTodos(); // Render new missions
    setLeftMissions() // After rendering, reflect number
}

const appendTodos = (text) => { //추가 기능
    const newId = id + 1; // Mission add i++1
    setId(newId)
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })// Once made, make mission incomplete
    // const newTodos = [...getAllTodos(), {id: newId, isCompleted: false, content: text }]
    setTodos(newTodos)
    setLeftMissions()
    checkIsAllCompleted();
    paintTodos();
}

const deleteTodo = (todoId) => { //삭제 기능
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );
    setTodos(newTodos);
    setLeftMissions()
    paintTodos()
}

const completeTodo = (todoId) => { //완료 기능
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    setTodos(newTodos);
    paintTodos();
    setLeftMissions()
    checkIsAllCompleted();
}

const updateTodo = (text, todoId) => { // 수정 기능 //첫번째 클릭
    const currentTodos = getAllTodos();
    const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}

const onDbclickTodo = (e, todoId) => { //두번째 클릭 설명 // It shows UI after you double click 
    const todoElem = e.target;
    const writeText = e.target.innerText;
    const todoMissionElem = todoElem.parentNode;
    const writeElem = document.createElement('write');
    writeElem.value = writeText;
    writeElem.classList.add('edit-write');
    writeElem.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') {
            updateTodo(e.target.value, todoId);
            document.body.removeEventListener('click', onClickBody );
        }
    })

    const onClickBody = (e) => { //You have to click the body to activate it 
        if(e.target !== writeElem)  {
            todoMissionElem.removeChild(writeElem);
            document.body.removeEventListener('click', onClickBody );
        }
    }
    
    document.body.addEventListener('click', onClickBody)
    todoMissionElem.appendChild(writeElem);
}

const clearCompletedTodos = () => { // Delete all completed missions
    const newTodos = getActiveTodos()
    setTodos(newTodos)
    paintTodos();
}
// Match list elements from html and java
const paintTodo = (todo) => {
    const todoMissionElem = document.createElement('li'); //li = list
    todoMissionElem.classList.add('todo-mission');

    todoMissionElem.setAttribute('data-id', todo.id );

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id))

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id))
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () =>  deleteTodo(todo.id))
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted) {
        todoMissionElem.classList.add('checked');
        checkboxElem.innerText = '✔';
    }

    todoMissionElem.appendChild(checkboxElem); // appendChild = 실행 
    todoMissionElem.appendChild(todoElem);
    todoMissionElem.appendChild(delBtnElem);
    todoListElem.appendChild(todoMissionElem);
}
//Explains/Defines/Instructs the functions
const paintTodos = () => {
    todoListElem.innerHTML = null;
    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'active': 
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'completed': 
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
    preBtnElem.classList.remove('selected');

    currentBtnElem.classList.add('selected')
    setCurrentShowType(newShowType)
    paintTodos();
}
// add mission by pressing enter
const init = () => {
    todoWriteElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); todoWriteElem.value = '';
        }
    })
    completeAllBtnElem.addEventListener('click',  onClickCompleteAll);
    showAllBtnElem.addEventListener('click', onClickShowTodosType);
    showActiveBtnElem.addEventListener('click',onClickShowTodosType);
    showCompletedBtnElem.addEventListener('click',onClickShowTodosType);
    clearCompletedBtnElem.addEventListener('click', clearCompletedTodos);
    setLeftMissions()
}
// check all list and return 

init()