import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ToastContainer } from 'react-toastify';
import WebFont from 'webfontloader';
import App from './App';
import storePersist from './store/store';
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

WebFont.load({
  google: {
    families: ['Arimo:400,700', 'sans-serif']
  }
});
const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      }
    },

    MuiSelect: {
      defaultProps: {
        variant: 'standard'
      }
    },
    MuiSlider: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'standard'
      }
    },
    MuiGrid: {
      styleOverrides: {
        item: {
          padding: '12px',
          paddingTop: 0
        }
      }
    }
  }
});

ReactDOM.render(
  <Provider store={storePersist.store}>
    <PersistGate persistor={storePersist.persistor}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
          <ToastContainer
            toastClassName="toster"
            bodyClassName="toster"
            position="bottom-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ThemeProvider>
      </StyledEngineProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log());
