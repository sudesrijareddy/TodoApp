import axios from 'axios';
import styles from './TodoList.module.css';
import React, { useEffect, useState } from 'react';
import {LuClipboardEdit} from 'react-icons/lu';
import {AiFillDelete} from 'react-icons/ai';
import {BsCircle,BsCheckCircle} from 'react-icons/bs';
import {FaClipboardList} from 'react-icons/fa';



const Todos = () => {
  
  const[todos,setTodos] = useState([]);
  const[todosFilter,setTodosFilter] = useState('all');
  const[newTask,setNewTask] =  useState("");
  const[errorMessage,setErrorMessage] = useState("");


  //adding new task to list

  const addTask = ()=>{
    if(newTask.trim()!==""){
      const newTodo = {
        id : Date.now(),
        title : newTask,
        completed : false
      }
      setTodos([newTodo,...todos]);
      setNewTask("");
      setErrorMessage("");
    } else{
      setErrorMessage("Enter the task in field!!");
    }
  }



  //handling new task input field change
  const handleInputChange = (e) => {
    setNewTask(e.target.value);
    setErrorMessage(''); // Clear the error message
  };

  // Filter the tasks based on the selected filter
  const filteredTodos = todosFilter === "completed"
  ? todos.filter((todo) => todo.completed === true)
  : todos;


  // toggling checked and unchecked changes
  const toggleCheckbox = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);  }; 

//Edit task title
const handleEdit = (id,title) => {
  const updatedTitle = prompt('Edit task title:', title);
    if (updatedTitle && updatedTitle.trim() !== '') {
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, title: updatedTitle } : todo
      );
      setTodos(updatedTodos);    }
};

//delete the task

const handleDelete = (id) =>{
  const updatedTodos = todos.filter((todo)=>
  todo.id!==id )
  setTodos(updatedTodos);
}
  //Fetching todos from Api when component mounts
  useEffect(()=>{
    axios.get("https://jsonplaceholder.typicode.com/users/1/todos")
    .then((response)=>{
      setTodos(response.data)
      console.log(response.data);
    })
    .catch((error)=>{
      console.log("Error in fetching Data :", error);
    })
  },[])
  
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}><FaClipboardList/> ToDo List</h1>
      <div className={styles.taskfield}>
        <input 
        placeholder='Enter new task' 
        type='text'
        value={newTask}
        onChange={handleInputChange}
        className={styles.inputfield}/>&nbsp;&nbsp;&nbsp;&nbsp;
        <button className={styles.taskbtn} onClick={addTask}>Add Task</button>
      </div>
      {errorMessage&&<p className={styles.errorpara}>{errorMessage}</p>}
      <div className={styles.filterbtns}>
        <button className={todosFilter==='all' ? styles.active:''} onClick={()=>setTodosFilter('all')}>All</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button className={todosFilter==='completed' ? styles.active:''} onClick={()=>setTodosFilter('completed')}>Completed</button>
      </div>
      <ul className={styles.todolist}>
        {filteredTodos.map((todo)=>(
          <li className={styles.listitems} key={todo.id}>
          <div className={styles.listtext}>
            <span className={todo.completed?styles.completed:""} onClick={()=>toggleCheckbox(todo.id)}>{todo.completed?<BsCheckCircle/>:<BsCircle/>}</span>
            <p className={`styles.para ${todo.completed?styles.completed:""}`} onClick={()=>toggleCheckbox(todo.id)}>{todo.title}</p>
          </div>
          <div className={styles.btns}>
          <button onClick={()=>handleEdit(todo.id,todo.title)}><LuClipboardEdit/></button>   
          <button onClick={()=>handleDelete(todo.id)}><AiFillDelete/></button>
          </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Todos;