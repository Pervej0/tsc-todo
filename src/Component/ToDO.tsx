import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Box, Button, Container, List, TextField } from "@mui/material";

interface Items {
  id: number;
  text: string;
}

type ActionType =
  | { type: "ADD"; text: string }
  | { type: "REMOVE"; id: number }
  | { type: "RELOAD"; values: Items | any };

const ToDO = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const reducer = (state: Items[], action: ActionType) => {
    switch (action.type) {
      case "ADD":
        localStorage.setItem(
          "todo",
          JSON.stringify([...state, { id: state.length, text: action.text }])
        );
        return [...state, { id: state.length, text: action.text }];
      case "REMOVE":
        return state.filter(({ id }) => id !== action.id);
      case "RELOAD":
        return action.values;
    }
  };
  const [items, dispatchItems] = useReducer(reducer, []);

  useEffect(() => {
    const allItems: any = localStorage.getItem("todo");
    if (allItems) {
      console.log(allItems);
      dispatchItems({ type: "RELOAD", values: JSON.parse(allItems) });
    }
  }, []);

  console.log(items);
  const handleOnClick = useCallback(() => {
    if (inputRef.current) {
      console.log(inputRef.current.value);
      dispatchItems({ type: "ADD", text: inputRef.current.value });
      inputRef.current.value = "";
    }
  }, []);
  const handleRemoveClick = (id: number) => {
    const remainItem = items.filter((item: any) => item.id !== id);
    dispatchItems({ type: "REMOVE", id });
    localStorage.setItem("todo", JSON.stringify(remainItem));
  };
  return (
    <div>
      <Box py={5} sx={{ bgcolor: "#d7d7d7", minHeight: "100vh" }}>
        <Container maxWidth="lg">
          <input
            style={{
              width: "50%",
              height: "55px",
              fontSize: "16px",
              padding: "0px 6px",
              background: "transparent",
              border: "1px solid #999",
            }}
            required
            ref={inputRef}
            type="text"
            placeholder="Enter something here.."
          />
          <Button
            sx={{
              border: "1px solid #999",
              py: 2,
              color: "#ffffff",
              bgcolor: "#2a7d2c",
              fontWeight: 600,
              borderLeft: 0,
            }}
            onClick={handleOnClick}
          >
            Add
          </Button>
          {items?.map((item: any) => (
            <ul key={item.id}>
              <Box
                sx={{
                  border: "1px solid #999",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <List sx={{ color: "#000000", fontWeight: 700 }}>
                  {item.text} &nbsp;
                </List>
                <Button
                  sx={{ bgcolor: "#b02d28", color: "#ffffff" }}
                  onClick={() => handleRemoveClick(item.id)}
                >
                  Remove
                </Button>
              </Box>
            </ul>
          ))}
        </Container>
      </Box>
    </div>
  );
};

export default ToDO;
