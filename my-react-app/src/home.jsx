import { useState } from "react";

function Home() {
  const [count, setCount] = useState(10);

  return (
    <>
      <h1>Home {count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <p>Welcome to the home page!</p>
    </>
  );
}

export default Home;
