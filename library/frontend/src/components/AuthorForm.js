import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const AuthorForm = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState(0);

  const [changeYear, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    const bornInt = Number(born);
    changeYear({ variables: { name, bornInt } });

    setName("");
    setBorn("");
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log("Author not found");
    }
  }, [result.data]);

  return (
    <div>
      <h2>change birthyear</h2>

      <form onSubmit={submit}>
        <div>name
          <select value={name} onChange={(e) => setName(e.target.value)}>
            {props.authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          birthyear{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">change birthyear</button>
      </form>
    </div>
  );
};

export default AuthorForm;
