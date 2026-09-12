import {render, screen} from '@testing-library/react'
import App from './App'

test('First test case', ()=>{
  render(<App/>)
  const text = screen.getByText("Learn React");
  const title = screen.getByTitle('logo');
  expect(text).toBeInTheDocument();
  expect(title).toBeInTheDocument();
})
test('First test case', ()=>{
  render(<App/>)
  const text = screen.getByText("Learn React");
  const title = screen.getByTitle('logo');
  expect(text).toBeInTheDocument();
  expect(title).toBeInTheDocument();
})

test('First test case', ()=>{
  render(<App/>)
  const text = screen.getByText("Learn React");
  const title = screen.getByTitle('logo');
  expect(text).toBeInTheDocument();
  expect(title).toBeInTheDocument();
})
test('First test case', ()=>{
  render(<App/>)
  const text = screen.getByText("Learn React");
  const title = screen.getByTitle('logo');
  expect(text).toBeInTheDocument();
  expect(title).toBeInTheDocument();
})