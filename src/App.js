import React, { useEffect } from "react";
import "./App.css";
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from 'react-query';
import axios from 'axios'




function Todo({ todo, index, markTodo, removeTodo }) {
  const queryClient = useQueryClient()
  const mutation1 = useMutation(updatetodo,{
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['todofetch'])
    },
  })
  const mutationdelete = useMutation(deletetodo,{
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['todofetch'])
    },
  })
  
  return (
    <div
      className="todo"
      
    >
      <span style={{ textDecoration: todo.isdone === "True" ? "line-through" : "" }}>{todo.title}</span>
      <div>
        <Button variant="outline-success" onClick={() => {
          sessionStorage.setItem('todoid',todo.id)
          mutation1.mutate({
           
            isdone: 'True',
          })
        }}>✓</Button>{' '}

        {

        todo.isdone === "True"?"":
        <Button variant="outline-danger" onClick={() => {
          sessionStorage.setItem('todoid',todo.id)
          mutationdelete.mutate()
        }}>✕</Button>
        }
        </div>

    </div>
  );
}



function FormTodo({ addTodo }) {
  const queryClient = useQueryClient()
  const [value, setValue] = React.useState("");

 

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    console.log(value)
    addTodo(value);


    setValue("");
  };

  const mutation = useMutation(posttodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['todofetch'])
    },
  })

  return (
    <Form onSubmit={handleSubmit}> 
    <Form.Group>
      <Form.Label><b>Add Todo</b></Form.Label>
      <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)} placeholder="Add new todo" />
    </Form.Group>
    <Button variant="primary mb-3" type="submit" onClick={() => {

          mutation.mutate({
           
            title: value,
          })
        }}>
      Submit
    </Button>
  </Form>
  );
}

const gettodo = ()=>{
  return axios.get('/Demo/')
}

const posttodo = (data) =>{
  return axios.post('/Demo/',data)
}


const updatetodo = (data1) => {
  return axios.patch(`/Demo/${sessionStorage.getItem('todoid')}`,data1)
}

const deletetodo = () => {
  return axios.delete(`/Demo/${sessionStorage.getItem('todoid')}`)
}




function App() {
 
  var baseUrl = axios.defaults.baseURL = 'http://156.67.217.219:2109/items';
  axios.defaults.headers.common['Authorization'] = "Bearer N1CAcmOkUejmMoJpvGYgsm7y5zGUQVm2";
  axios.defaults.headers.get['Content-Type'] = 'application/json';
  const query = useQuery(['todofetch'],gettodo)

  var todos = query.data?.data?.data


  

 

  const addTodo = title => {
    console.log(title)
   

  };

  const markTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
 
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">Todo List</h1>
        <FormTodo addTodo={addTodo} />
        <div>
          {todos?.map((todo, index) => (
            <Card>
              <Card.Body>
                <Todo
                key={index}
                index={index}
                todo={todo}
                markTodo={markTodo}
                removeTodo={removeTodo}
                />
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;