import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function MyLists() {
  const [UserInput, SetInputValue] = useState([])//for user input
  const [ToDoArr, SetToDo] = useState([]) //to do list
  const [DoneArr, SetToDone] = useState([]) // completed tasks

  useEffect(() => {
    // Fetch existing to-do items from the server
    axios.get('/api/todos')
      .then(response => {
        SetToDo(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const HandleUserInput = (event) => {
    SetInputValue(event.target.value)
  };

  const AddToDo = (event) => {
    event.preventDefault(); // Stops form submission
    if (UserInput.trim() === '') return; // Prevent adding empty items

    SetToDo([...ToDoArr, UserInput]); // Add user input to the to-do list
    SetInputValue(''); // Reset input value to empty string

    axios
      .post('/api/todos', { text: UserInput })
      .then((response) => {
        // Handle successful response
        console.log(response.data); // Optional: Log the response from the server
      })
      .catch((error) => {
        // error handling
        console.error(error);
        // Additional error handling
      });
  };

  const MoveTodone = (itemIndex) => {
    SetToDone([...DoneArr, ToDoArr[itemIndex]]) //adds to done list
    SetToDo(ToDoArr.filter((_, index) => index !== itemIndex)) //removes from to do list
  };

  const MoveBackToDo  = (itemIndex) => {
    SetToDo([...ToDoArr, DoneArr[itemIndex]]) // adds to to do list
    SetToDone(DoneArr.filter((_, index) => index !== itemIndex)) //removes from done list
  };

  const DeleteFromDone = (itemIndex) => {
    SetToDone(DoneArr.filter((_, index) => index !== itemIndex)) //removes from done list
  };
// returns a user submission form and two lists
  return (
    <div>
      <form onSubmit={AddToDo}>
        <input type="text" value={UserInput} onChange={HandleUserInput}></input>
        <button type="submit">Add to the to do list</button>
      </form>

      <div>
        <h1>to do list</h1>
        <ul>
        {ToDoArr.map((item, index) => (
            <li key={index}>
              {item} <button onClick={() => MoveTodone(index)}>Move to done list</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h1>Tasks done</h1>
        {DoneArr.map((item, index) => (
            <li key={index}>{item}
            <button onClick={() => MoveBackToDo(index)}>move back to the to do list</button>
            <button onClick={() => DeleteFromDone(index)}>Delete item</button>
            </li>
          ))}
      </div>

    </div>
    );

}
export default MyLists;