import './App.css';
import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import { Box, Container, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { FixedSizeList } from 'react-window';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const URL = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const socket = io(URL);

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const items = ["Hello", "World"];

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', (message) => {
      setMessageList(prevState => {
        return [...prevState, message];
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    }
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      submitMessage();
    }
  }

  const submitMessage = () => {
    console.log(message);
    socket.emit('ping', message);
    setMessage('');
  }

  const renderRow = (props) => {
    const { index, style } = props;
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <Box sx={{
          bgcolor: '#1B9CFC',
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 1,
          paddingBottom: 1,
          margin: 1,
          borderRadius: 5,
        }}>
          {messageList[index]}
        </Box>
      </ListItem>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm"
        sx={{
          height: window.innerHeight
        }}>
        <Grid
          container
          direction={"column"}
          justifyContent={"flex-end"}
          sx={{
            height: '100%',
            paddingBottom: 1,
            paddingTop: 1
          }}
        >
          <Grid item>
            <FixedSizeList
              height={parseInt(window.innerHeight) * 0.85}
              width={'100%'}
              itemSize={46}
              itemCount={messageList.length}
              overscanCount={5}
            >
              {renderRow}
            </FixedSizeList>
          </Grid>



          <Grid
            item
            container
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              width: '100%'
            }}
          >
            <Grid
              container
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ width: '100%' }}
              item xs={9}>
              <TextField
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                value={message}
                fullWidth
                variant='outlined'
                type={'text'} />
            </Grid>

            <Grid item
              container
              justifyContent={"center"}
              alignItems={"center"}
              xs={3}
            >
              <Button 
              variant='contained' 
              onClick={submitMessage}
              sx={{
                width: '90%',
                height: '50px'
              }}>Send</Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
