import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBook from "./AddBook";

import "./App.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    {
      field: "author",
      headerName: "Author",
      sortable: true,
      filter: true,
    },
    {
      field: "isbn",
      headerName: "Isbn",
      sortable: true,
      filter: true,
    },
    {
      field: "price",
      headerName: "Price",
      sortable: true,
      filter: true,
    },
    {
      field: "title",
      headerName: "Title",
      sortable: true,
      filter: true,
    },
    {
      field: "year",
      headerName: "Year",
      sortable: true,
      filter: true,
    },
    {
      field: "id",
      headerName: "",
      width: 90,
      cellRenderer: (params) => (
        <IconButton
          onClick={() => deleteBook(params.value)}
          size="small"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch(
      "https://bookstore-befe6-default-rtdb.europe-west1.firebasedatabase.app/books/.json"
    )
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, "id", { value: keys[index] })
    );
    setBooks(valueKeys);
  };

  const addBook = (newBook) => {
    fetch(
      "https://bookstore-befe6-default-rtdb.europe-west1.firebasedatabase.app/books/.json",
      {
        method: "POST",
        body: JSON.stringify(newBook),
      }
    )
      .then((response) => fetchBooks())
      .catch((err) => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(
      `https://bookstore-befe6-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => fetchBooks())
      .catch((err) => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div className="ag-theme-material" style={{ height: 400, width: 700 }}>
        <AgGridReact rowData={books} columnDefs={columnDefs} />
      </div>
    </>
  );
}

export default App;
