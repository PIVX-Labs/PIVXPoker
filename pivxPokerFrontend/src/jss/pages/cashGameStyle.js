import modalStyle from "../modalStyle";
const drawerWidth = 240;
const playerWidth = 200;
const playerHeight = 100;
const cardWidth = 60;
const cardHeight = 80;
const lgRate = 0.9;
const mdRate = 0.85;
const smRate = 0.8;
const xsRate = 0.5;

const lobbyStyle = (theme) => ({
  simpleButton:{
    padding:'3px',
    margin:'0px',   
  },
  userAvatar:{
    padding:"1px",
    backgroundColor:"#130d1e",
    border:"1px solid white",
    borderRadius:"80px",
    width:"55px",
    height:"55px"
  },
  eventPlayer:{
    fontSize:'2rem',
    fontWeight:"100",
    color:'white'
  },
  winEvent:{
    color:'gold'
  },
  progressBar:{
    width:'100%',
    zIndex:'5',
    height:'4px',
    bottom:'0',
    position:'absolute'
  },
  playerMenu:{
    "& .MuiMenu-paper":{   
      opacity:'0.8!important',
      border: '#6d7a7f',
      backgroundColor: '#130d1e!important'
   },
   "& .MuiMenu-list":{
      border: '#6d7a7f',
      backgroundColor: '#130d1e',
      borderStyle: 'none none solid none',
       borderWidth: '1px'
   },
  },
  root: {
    
   
    display: "flex",
    height: "100%",
    "& .chips-pad": {
      position: "absolute",
      overflow: "visible",
      display: "flex",
      flexDirection: "column",
      "& .chip-stacks":{
        display: 'flex',
        width: '60px',
        height: '40px',
        flexFlow: 'wrap',
        "& .chip-stack": {
          display: "flex",
          flexDirection: "column-reverse",          
        },
        "& .chip-stack:nth-child(1)": {
          marginBottom:'-15px'         
        },
        "& .chip-stack:nth-child(2)": {
          marginBottom:'-15px'         
        },
        "& .chip-stack:nth-child(3)": {
          marginBottom:'-15px'         
        },
      },
      
      "& .chips-amount": {
        textAlign:'center',
        marginTop: "1.4em",
        color: "gold",
      },
    },
  },
  balance: {
    color: "gold",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    border: 0,
    boxShadow: "7px -7px 10px rgb(0 0 0 / 40%);",
    overflow: "visible",
  },
  menu_bar:{
    position: "relative",
    height: "50px",
    background:"linear-gradient(90deg, #662D91, #2a1b42), #662D91 !important",
    padding:"0 20px 5px 50px",
    boxShadow: "2px 3px 1px rgba(0,0,0,0.4)",
    "& h4":{
      color:"#e6c25f",
      margin:'10px 0'
    },
    display: 'flex',
    flexDirection:"row-reverse"
  },
  title_bar:{
    height:'20px',
    flexDirection:"row-reverse",
    display:"flex",
    padding:"0 20px",
    "& span":{
      color:'gold',
      fontWeight:'1000',
      textDecoration:'underline',
      cursor:'pointer'
    }
  },
  balance_pad:{
    display: 'flex',
    flexDirection:"column",
    fontSize: '0.7rem',
    alignSelf: 'flex-end',
    marginRight:'15px'
  },
  table_pad: {
    position: "relative",
    height: "calc(100% - 150px)",
    "& .users-on-board": {
      zIndex: '1',
      "&.stand":{
        opacity:'0.5'
      },
      position: "absolute",
      width: playerWidth,
      height: playerHeight,
      overflow: "visible",
      "& .player-cards":{
        "& .choosen-card": {
          width: cardWidth,
          height: cardHeight,
        },
        right: "0px",
        top: 0,
        position: "absolute",
        width: cardWidth + 30,
        height: cardHeight,
        "& .cards": {
          position: "absolute",
        },
        "& .cards:nth-child(2)": {
          marginLeft: 30,
        },
      },
      "& .user-avatar": {
        position: "absolute",
        bottom: "0px",
      },
      "& .user-dealer": {
        position: "absolute",
        bottom: "0px",
        "& span":{
          fontSize:'0.8rem!important'
        }
        
      },
      "& .user-me": {
        position: "absolute",
        bottom: "0px",
        left:"20px",
        "& span":{
          fontSize:'0.8rem!important'
        }
        
      },
      "& .user-info": {
        position: "absolute",
        bottom: "5px",
        width: "calc(100% - 5px)",
        height: "45px",
        left: "5px",
        display: "flex",
        flexDirection: "column",
        border: "solid 0.5px rgba(255, 255, 255, 0.28)",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderRadius: "1rem",
        paddingRight: "1rem",
        
        
        paddingLeft: "55px",
      },
    },
    "& .users-on-board.right-hand": {   
      "& .chip-stacks":{
        flexDirection:'row-reverse'
      },   
      "& .user-avatar": {
        right:'0px'
      },
      "& .user-dealer": { 
        right:'0px'
      },
      "& .user-me": { 
        right:'20px'
      },
      "& .user-info": {     
        right: "5px",
        left:0,
        paddingLeft: "1rem",
        
        paddingRight: "55px",
        textAlign:'right'
      },
      "& .player-cards":{        
        left: "0px",      
      }
    },
  },
  control_pad: {
    paddingTop: "50px",
    position: "relative",
    width:"90%",
    paddingLeft:"5%",
    bottom: "50px",
    height: "50px",
    flexFlow: "row wrap",
    justifyContent: "space-between",
    display: "flex",
    alignItems: 'center'
  },
  slider: {
    '& *':{
      color:'goldenrod'
    },
    '& .MuiSlider-valueLabel *':{
      color:'white',
      backgroundColor:'goldenrod'
    },
    width: "500px",
    margin: "0 10px -10px 10px",
  },
  chatForm: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  background: {
    marginLeft: "20px",
    width: "calc(60% - 40px)",
    height: "calc(60% - 30px)",
    margin: "auto",
    position: 'relative',
    top: '26%',
    left: 'calc(30% - 100px)',
    zIndex: '0',
  },
  content: {
    position: "relative",
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    display: "flex",
    flexDirection: "column",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },

  table_9: {
    "& .users-on-board:nth-child(1)": {
      left: `calc(50% - ${playerWidth / 2}px)`,
      bottom: "20px",
      "& .chips-pad": {
        top: "-80px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(9)": {
      right: `calc(15% - ${playerWidth / 2}px)`,
      bottom: `calc(15% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-25px",
        left: "-50px",
      },
    },
    "& .users-on-board:nth-child(8)": {
      right: "0px",
      bottom: `calc(45% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-25px",
        left: "-40px",
      },
    },
    "& .users-on-board:nth-child(7)": {
      left: `calc(85% - ${playerWidth / 2}px)`,
      top: `calc(25% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-25px",
        left: "-50px",
      },
    },
    "& .users-on-board:nth-child(6)": {
      right: `calc(35% - ${playerWidth / 2}px)`,
      top: `0px`,
      "& .chips-pad": {
        bottom: "-70px",
        left: "0px",
      },
    },
    "& .users-on-board:nth-child(5)": {
      left: `calc(35% - ${playerWidth / 2}px)`,
      top: `0px`,
      "& .chips-pad": {
        bottom: "-70px",
        right: "0px",
      },
    },
    "& .users-on-board:nth-child(4)": {
      left: `calc(15% - ${playerWidth / 2}px)`,
      top: `calc(25% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-25px",
        right: "-50px",
      },
    },
    "& .users-on-board:nth-child(3)": {
      left: `0px`,
      bottom: `calc(45% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-25px",
        right: "-40px",
      },
    },
    "& .users-on-board:nth-child(2)": {
      left: `calc(15% - ${playerWidth / 2}px)`,
      bottom: `calc(15% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-25px",
        right: "-50px",
      },
    },
  },
  table_8: {
    "& .users-on-board:nth-child(1)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      bottom: "20px",
      "& .chips-pad": {
        top: "-80px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(8)": {
      right: `calc(20% - ${playerWidth / 2}px)`,
      bottom: `calc(20% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-50px",
        left: "-30px",
      },
    },
    "& .users-on-board:nth-child(7)": {
      right: "0px",
      top: `calc(50% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-50px",
        left: "-30px",
      },
    },
    "& .users-on-board:nth-child(6)": {
      right: `calc(20% - ${playerWidth / 2}px)`,
      top: `calc(10% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-80px",
        left: "-20px",
      },
    },
    "& .users-on-board:nth-child(5)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      top: `0px`,
      "& .chips-pad": {
        bottom: "-90px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(4)": {
      left: `calc(20% - ${playerWidth / 2}px)`,
      top: `calc(10% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-80px",
        right: "-20px",
      },
    },
    "& .users-on-board:nth-child(3)": {
      left: `0px`,
      top: `calc(50% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-50px",
        right: "-30px",
      },
    },
    "& .users-on-board:nth-child(2)": {
      left: `calc(20% - ${playerWidth / 2}px)`,
      bottom: `calc(20% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-50px",
        right: "-30px",
      },
    },
    "& .table-cards": {
      top: `calc(40% - ${(cardHeight * xsRate) / 2}px)!important`,     
    },
  },
  table_7: {
    "& .users-on-board:nth-child(1)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      bottom: "20px",
      "& .chips-pad": {
        top: "-80px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(7)": {
      right: `calc(20% - ${playerWidth / 2}px)`,
      bottom: `calc(20% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-55px",
        left: "-40px",
      },
    },
    "& .users-on-board:nth-child(6)": {
      right: "0px",
      top: `calc(40% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-70px",
        left: "-55px",
      },
    },
    "& .users-on-board:nth-child(5)": {
      right: `calc(30% - ${playerWidth / 2}px)`,
      top: `calc(10% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-70px",
        left: "-55px",
      },
    },
    "& .users-on-board:nth-child(4)": {
      left: `calc(30% - ${playerWidth / 2}px)`,
      top: `calc(10% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-70px",
        right: "-55px",
      },
    },
    "& .users-on-board:nth-child(3)": {
      left: `0px`,
      top: `calc(40% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-70px",
        right: "-55px",
      },
    },
    "& .users-on-board:nth-child(2)": {
      left: `calc(20% - ${playerWidth / 2}px)`,
      bottom: `calc(20% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-55px",
        right: "-40px",
      },
    },
  },
  table_6: {
    "& .users-on-board:nth-child(1)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      bottom: "20px",
      "& .chips-pad": {
        top: "-80px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(6)": {
      right: `0px`,
      bottom: `calc(30% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-20px",
        left: "-50px",
      },
    },
    "& .users-on-board:nth-child(5)": {
      right: `0px`,
      top: `calc(20% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-60px",
        left: "-50px",
      },
    },
    "& .users-on-board:nth-child(4)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      top: `0px`,
      "& .chips-pad": {
        bottom: "-90px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(3)": {
      left: `0px`,
      top: `calc(20% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-60px",
        right: "-50px",
      },
    },
    "& .users-on-board:nth-child(2)": {
      left: `0px`,
      bottom: `calc(30% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-20px",
        right: "-50px",
      },
    },
  },
  table_5: {
    "& .users-on-board:nth-child(1)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      bottom: "20px",
      "& .chips-pad": {
        top: "-80px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(5)": {
      right: `0px`,
      bottom: `calc(35% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-10px",
        left: "-60px",
      },
    },
    "& .users-on-board:nth-child(4)": {
      right: `0px`,
      top: `calc(20% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-30px",
        left: "-60px",
      },
    },   
    "& .users-on-board:nth-child(3)": {
      left: `0px`,
      top: `calc(20% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        bottom: "-30px",
        right: "-60px",
      },
    },
    "& .users-on-board:nth-child(2)": {
      left: `0px`,
      bottom: `calc(35% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "-10px",
        right: "-60px",
      },
    },
  },
  table_4: {
    "& .users-on-board:nth-child(1)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      bottom: "20px",
      "& .chips-pad": {
        top: "-80px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(4)": {
      right: `0px`,
      bottom: `calc(50% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "20px",
        left: "-60px",
      },
    },
    "& .users-on-board:nth-child(3)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      top: "0px",
      "& .chips-pad": {
        bottom: "-90px",
        left: "calc(50% - 30px)",
      },
    },   
    "& .users-on-board:nth-child(2)": {
      left: `0px`,
      bottom: `calc(50% - ${playerHeight / 2}px)`,
      "& .chips-pad": {
        top: "20px",
        right: "-60px",
      },
    },
   
  },
  table_3: {
    "& .users-on-board:nth-child(1)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      bottom: "20px",
      "& .chips-pad": {
        top: "-80px",
        left: "45%",
      },
    },
    "& .users-on-board:nth-child(3)": {
      right: `30px`,
      top: `0px`,
      "& .chips-pad": {
        bottom: "-80px",
        left: "-60px",
      },
    },
    "& .users-on-board:nth-child(2)": {
      left: `30px`,
      top: `0px`,
      "& .chips-pad": {
        bottom: "-80px",
        right: "-60px",
      },
    },   

   
  },
  table_2: {
    "& .users-on-board:nth-child(1)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      bottom: "20px",
      "& .chips-pad": {
        top: "-80px",
        left: "calc(50% - 30px)",
      },
    },
    "& .users-on-board:nth-child(2)": {
      left: `calc(55% - ${playerWidth / 2}px)`,
      top: "0px",
      "& .chips-pad": {
        bottom: "-90px",
        left:  "calc(50% - 30px)",
      },
    },
    
   
  },
  status_pad:{
    position: 'absolute',
    textAlign: 'center',
    top: '65%',
    left: 'calc(52% - 100px)',
    width:'200px',
    opacity: '0.5',
    fontSize:'1.2rem',
    zIndex: '1',
  },
  table_cards: {
    position: "absolute",
    zIndex: '1',
    left: `calc(50% - ${(cardWidth * 5) / 2}px)`,
    top: `calc(43% - ${cardHeight / 2}px)`,
    "& .card-size": {
      width: cardWidth,
      height: cardHeight,
    },
    "& .chips-pad": {
      marginTop: "10px",
      left: "calc(50% - 30px)",
      "& .chips-amount": {
        color: "white",
      },
    },
  },



  [theme.breakpoints.down('xl')]: {
    slider: {
      width: "400px",
    },
    table_9: {      
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${(playerWidth * lgRate) / 2}px)`,
        bottom: "20px",
      },
      "& .users-on-board:nth-child(9)": {
        right: `calc(15% - ${(playerWidth * lgRate) / 2}px)`,
        bottom: `calc(15% - ${(playerHeight * lgRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(8)": {
        right: "0px",
        bottom: `calc(45% - ${(playerHeight * lgRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(7)": {
        left: `calc(85% - ${(playerWidth * lgRate) / 2}px)`,
        top: `calc(25% - ${(playerHeight * lgRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(6)": {
        right: `calc(35% - ${playerWidth* lgRate / 2}px)`,
        top: `0px`,
      },
      "& .users-on-board:nth-child(5)": {
        left: `calc(35% - ${(playerWidth * lgRate) / 2}px)`,
        top: `0px`,
      },
      "& .users-on-board:nth-child(4)": {
        left: `calc(15% - ${(playerWidth * lgRate) / 2}px)`,
        top: `calc(25% - ${(playerHeight * lgRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(3)": {
        left: `0px`,
        bottom: `calc(45% - ${(playerHeight * lgRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(2)": {
        left: `calc(15% - ${(playerWidth * lgRate) / 2}px)`,
        bottom: `calc(15% - ${(playerHeight * lgRate) / 2}px)`,
      },
    },
    table_cards: {
      left: `calc(50% - ${((cardWidth * 5) * lgRate) / 2}px)`,
      top: `calc(43% - ${(cardHeight * lgRate) / 2}px)`,
      "& .card-size": {
        width: cardWidth * lgRate,
        height: cardHeight * lgRate,
      },
    },
    table_pad:{
      "& .users-on-board": {
        width: playerWidth * lgRate,
        height: playerHeight * lgRate,
        "& .player-cards":{
          "& .choosen-card": {
            width: cardWidth * lgRate,
            height: cardHeight * lgRate,
          },
          width: (cardWidth + 30) * lgRate,
          height: cardHeight * lgRate,
          "& .cards:nth-child(2)": {
            marginLeft: 30 * lgRate,
          },
        }
      },
    },
    table_9: {      
      "& .users-on-board:nth-child(1)": {
        left: `calc(58% - ${(playerWidth * mdRate) / 2}px)`,
      },
    }
  },
  [theme.breakpoints.down('lg')]: {
    userAvatar:{
      width:'45px',
      height:'45px'
    },
    slider: {
      width: "320px",
    },
    table_pad: {
      "& .users-on-board": {
        width: playerWidth * mdRate,
        height: playerHeight * mdRate,
        "& .player-cards":{
          "& .choosen-card": {
            width: cardWidth * mdRate,
            height: cardHeight * mdRate,
          },
          width: (cardWidth + 30) * mdRate,
          height: cardHeight * mdRate,          
          "& .cards:nth-child(2)": {
            marginLeft: 30 * mdRate,
          },
        },        
        "& .user-info": {
          bottom: "3px",
          height: "40px",
          left: "5px",                    
          paddingLeft: "45px",
          "& *":{
            fontSize:'0.9rem'
          }  
        },
      },
      "& .users-on-board.right-hand": {            
        "& .user-info": {              
          paddingRight: "45px",
        },      
      },
    },
    background: {
      marginLeft: "80px",
      width: "calc(48% - 40px)",
      height: "calc(58% - 30px)",
      top: '24%',
      left: 'calc(33% - 100px)',
    },
    table_9: {      
      "& .users-on-board:nth-child(1)": {
        left: `calc(60% - ${(playerWidth * mdRate) / 2}px)`,
        bottom: "20px",
      },
      "& .users-on-board:nth-child(9)": {
        right: `calc(15% - ${(playerWidth * mdRate) / 2}px)`,
        bottom: `calc(15% - ${(playerHeight * mdRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(8)": {
        right: "0px",
        bottom: `calc(45% - ${(playerHeight * mdRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(7)": {
        left: `calc(85% - ${(playerWidth * mdRate) / 2}px)`,
        top: `calc(25% - ${(playerHeight * mdRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(6)": {
        right: `calc(35%  - ${(playerWidth * mdRate) / 2}px)`,
        top: `0px`,
      },
      "& .users-on-board:nth-child(5)": {
        left: `calc(35% - ${(playerWidth * mdRate) / 2}px)`,
        top: `0px`,
      },
      "& .users-on-board:nth-child(4)": {
        left: `calc(15% - ${(playerWidth * mdRate) / 2}px)`,
        top: `calc(25% - ${(playerHeight * mdRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(3)": {
        left: `0px`,
        bottom: `calc(45% - ${(playerHeight * mdRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(2)": {
        left: `calc(15% - ${(playerWidth * mdRate) / 2}px)`,
        bottom: `calc(15% - ${(playerHeight * mdRate) / 2}px)`,
      },
    },
    table_cards: {
      left: `calc(50% - ${((cardWidth * 5) * mdRate) / 2}px)`,
      top: `calc(43% - ${(cardHeight * mdRate) / 2}px)`,
      "& .card-size": {
        width: cardWidth * mdRate,
        height: cardHeight * mdRate,
      },
    },
  },
  [theme.breakpoints.down('md')]: {
    userAvatar:{
      width:'40px',
      height:'40px'
    },
    control_pad: {
      "& button": {
        padding: "3px 5px",
        fontSize: "0.9rem",
      },
    },
    slider: {
      width: "220px",
    },  
    table_pad: {
      "& .users-on-board": {
        width: playerWidth * smRate,
        height: playerHeight * smRate,
        "& .player-cards":{
          "& .choosen-card": {
            width: cardWidth * 0.8,
            height: cardHeight * 0.8,
          },
          width: (cardWidth + 30) * 0.8,
          height: cardHeight * 0.8,          
          "& .cards:nth-child(2)": {
            marginLeft: 30 * 0.8,
          },
        },
        "& .user-dealer": {
          "& span":{
            fontSize:'0.8rem!important'
          }          
        },
        "& .user-me": {
          "& span":{
            fontSize:'0.8rem!important'
          }          
        },
        "& .user-info": {
          bottom: "3px",
          width: "calc(100% - 5px)",
          height: "35px",
          left: "5px",
                    
          paddingLeft: "40px",
          "& *":{
            fontSize:'0.8rem'
          }  
        },
      },
      "& .users-on-board.right-hand": {            
        "& .user-info": {              
          paddingRight: "40px",
        },      
      },
    },
    background: {
      marginLeft: "80px",
      width: "calc(48% - 40px)",
      height: "calc(58% - 30px)",
      top: '24%',
      left: 'calc(33% - 100px)',
    },
    table_9: {      
      "& .users-on-board:nth-child(1)": {
        left: `calc(60% - ${(playerWidth * smRate) / 2}px)`,
        bottom: "20px",
      },
      "& .users-on-board:nth-child(9)": {
        right: `calc(15% - ${(playerWidth * smRate) / 2}px)`,
        bottom: `calc(25% - ${(playerHeight * smRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(8)": {
        right: "0px",
        bottom: `calc(45% - ${(playerHeight * smRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(7)": {
        left: `calc(85% - ${(playerWidth * smRate) / 2}px)`,
        top: `calc(25% - ${(playerHeight * smRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(6)": {
        right: `calc(35%  - ${(playerWidth * smRate) / 2}px)`,
        top: `0px`,
      },
      "& .users-on-board:nth-child(5)": {
        left: `calc(35% - ${(playerWidth * smRate) / 2}px)`,
        top: `0px`,
      },
      "& .users-on-board:nth-child(4)": {
        left: `calc(15% - ${(playerWidth * smRate) / 2}px)`,
        top: `calc(25% - ${(playerHeight * smRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(3)": {
        left: `0px`,
        bottom: `calc(45% - ${(playerHeight * smRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(2)": {
        left: `calc(15% - ${(playerWidth * smRate) / 2}px)`,
        bottom: `calc(25% - ${(playerHeight * smRate) / 2}px)`,
      },
    },
    table_cards: {
      left: `calc(50% - ${((cardWidth * 5) * smRate) / 2}px)`,
      top: `calc(43% - ${(cardHeight * smRate) / 2}px)`,
      "& .card-size": {
        width: cardWidth * smRate,
        height: cardHeight * smRate,
      },
    },
    table_4: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${playerWidth* smRate / 2}px)`,
        bottom: "20px",

      },
      "& .users-on-board:nth-child(4)": {
        right: `0px`,
        bottom: `calc(40% - ${playerHeight* smRate / 2}px)`,

      },
      "& .users-on-board:nth-child(3)": {
        left: `calc(50% - ${playerWidth* smRate / 2}px)`,
        top: "0px",

      },   
      "& .users-on-board:nth-child(2)": {
        left: `0px`,
        bottom: `calc(40% - ${playerHeight* smRate / 2}px)`,

      },
      "& .table-cards": {
        top: `calc(40% - ${(cardHeight * smRate) / 2}px)!important`,     
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    userAvatar:{
      width:'35px',
      height:'35px'
    },
    control_pad: {
      "& button": {
        padding: "2px 3px",
        fontSize: "0.8rem",
      },
    },
    slider: {
      width: "100px",
    },
    table_pad: {
      "& .users-on-board": {
        width: playerWidth * xsRate,
        height: playerHeight * 0.7,
        "& .player-cards":{
          "& .choosen-card": {
            width: cardWidth * 0.8,
            height: cardHeight * 0.8,
          },
          width: (cardWidth + 30) * 0.8,
          height: cardHeight * 0.8,          
          "& .cards:nth-child(2)": {
            marginLeft: 30 * 0.8,
          },
        },
        "& .user-me": {
          "& span":{
            fontSize:'0.7rem!important'
          }          
        },
        "& .user-dealer": {
          "& span":{
            fontSize:'0.7rem!important'
          }          
        },
        "& .user-info": {
          bottom: "3px",
          width: "calc(100% - 5px)",
          height: "30px",
          left: "5px",
                    
          paddingLeft: "35px",
          "& *":{
            fontSize:'0.7rem'
          }  
        },
      },
      "& .users-on-board.right-hand": {            
        "& .user-info": {              
          paddingRight: "35px",
        },      
      },
    },
    background: {
      marginLeft: "96px",
      width: "calc(48% - 40px)",
      height: "calc(48% - 30px)",
      top: '19%',
      left: 'calc(33% - 100px)',
    },
    table_9: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(57% - ${(playerWidth * xsRate) / 2}px)`,
        bottom: "80px",
      },
      "& .users-on-board:nth-child(9)": {
        right: `calc(15% - ${(playerWidth * xsRate) / 2}px)`,
        bottom: `calc(25% - ${(playerHeight * xsRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(8)": {
        right: "0px",
        bottom: `calc(45% - ${(playerHeight * xsRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(7)": {
        left: `calc(85% - ${(playerWidth * xsRate) / 2}px)`,
        top: `calc(25% - ${(playerHeight * xsRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(6)": {
        right: `calc(30%  - ${(playerWidth * xsRate) / 2}px)`,
        top: `0px`,
      },
      "& .users-on-board:nth-child(5)": {
        left: `calc(30% - ${(playerWidth * xsRate) / 2}px)`,
        top: `0px`,
      },
      "& .users-on-board:nth-child(4)": {
        left: `calc(15% - ${(playerWidth * xsRate) / 2}px)`,
        top: `calc(25%  - ${(playerHeight * xsRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(3)": {
        left: `0px`,
        bottom: `calc(45% - ${(playerHeight * xsRate) / 2}px)`,
      },
      "& .users-on-board:nth-child(2)": {
        left: `calc(15% - ${(playerWidth * xsRate) / 2}px)`,
        bottom: `calc(25% - ${(playerHeight * xsRate) / 2}px)`,
      },
    },
    table_cards: {
      left: `calc(50% - ${((cardWidth * 5) * 0.65) / 2}px)`,
      top: `calc(40% - ${(cardHeight * 0.65) / 2}px)`,
      "& .card-size": {
        width: cardWidth * 0.65,
        height: cardHeight * 0.65,
      },
    },
    table_8: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${playerWidth * xsRate/ 2}px)`,
        bottom: "20px",       
      },
      "& .users-on-board:nth-child(8)": {
        right: `calc(20% - ${playerWidth * xsRate/ 2}px)`,
        bottom: `calc(20% - ${playerHeight * xsRate/ 2}px)`,     
      },
      "& .users-on-board:nth-child(7)": {
        right: "0px",
        top: `calc(50% - ${playerHeight * xsRate/ 2}px)`,       
      },
      "& .users-on-board:nth-child(6)": {
        right: `calc(20% - ${playerWidth * xsRate/ 2}px)`,
        top: `calc(15% - ${playerHeight * xsRate/ 2}px)`,   
      },
      "& .users-on-board:nth-child(5)": {
        left: `calc(50% - ${playerWidth * xsRate/ 2}px)`,
        top: `0px`,   
      },
      "& .users-on-board:nth-child(4)": {
        left: `calc(20% - ${playerWidth * xsRate/ 2}px)`,
        top: `calc(15% - ${playerHeight * xsRate/ 2}px)`,       
      },
      "& .users-on-board:nth-child(3)": {
        left: `0px`,
        top: `calc(50% - ${playerHeight * xsRate/ 2}px)`,

      },
      "& .users-on-board:nth-child(2)": {
        left: `calc(20% - ${playerWidth * xsRate/ 2}px)`,
        bottom: `calc(20% - ${playerHeight * xsRate/ 2}px)`,
       
      },
    },
    table_7: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${playerWidth * xsRate/ 2}px)`,
        bottom: "20px",       
      },
      "& .users-on-board:nth-child(7)": {
        right: `calc(20% - ${playerWidth * xsRate/ 2}px)`,
        bottom: `calc(25% - ${playerHeight * xsRate/ 2}px)`,     
      },
      "& .users-on-board:nth-child(6)": {
        right: "0px",
        top: `calc(40% - ${playerHeight * xsRate/ 2}px)`,       
      },
      "& .users-on-board:nth-child(5)": {
        right: `calc(20% - ${playerWidth * xsRate/ 2}px)`,
        top: `calc(5% - ${playerHeight * xsRate/ 2}px)`,   
      },
      
      "& .users-on-board:nth-child(4)": {
        left: `calc(20% - ${playerWidth * xsRate/ 2}px)`,
        top: `calc(5% - ${playerHeight * xsRate/ 2}px)`,       
      },
      "& .users-on-board:nth-child(3)": {
        left: `0px`,
        top: `calc(40% - ${playerHeight * xsRate/ 2}px)`,

      },
      "& .users-on-board:nth-child(2)": {
        left: `calc(20% - ${playerWidth * xsRate/ 2}px)`,
        bottom: `calc(25% - ${playerHeight * xsRate/ 2}px)`,       
      },
      "& .table-cards": {
        top: `calc(30% - ${(cardHeight * xsRate) / 2}px)!important`,     
      },
      "& .table-cards": {
        top: `calc(27% - ${(cardHeight * xsRate) / 2}px)!important`,     
      },
    },
    table_6: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${playerWidth* xsRate / 2}px)`,
        bottom: "20px",

      },
      "& .users-on-board:nth-child(6)": {
        right: `0px`,
        bottom: `calc(30% - ${playerHeight * xsRate/ 2}px)`,

      },
      "& .users-on-board:nth-child(5)": {
        right: `0px`,
        top: `calc(20% - ${playerHeight * xsRate/ 2}px)`,

      },
      "& .users-on-board:nth-child(4)": {
        left: `calc(50% - ${playerWidth * xsRate/ 2}px)`,
        top: `0px`,

      },
      "& .users-on-board:nth-child(3)": {
        left: `0px`,
        top: `calc(20% - ${playerHeight * xsRate/ 2}px)`,

      },
      "& .users-on-board:nth-child(2)": {
        left: `0px`,
        bottom: `calc(30% - ${playerHeight * xsRate/ 2}px)`,

      },
    },

    table_5: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${playerWidth *xsRate / 2}px)`,
        bottom: "20px",
      },
      "& .users-on-board:nth-child(5)": {
        right: `0px`,
        bottom: `calc(35% - ${playerHeight*xsRate / 2}px)`,
      },
      "& .users-on-board:nth-child(4)": {
        right: `0px`,
        top: `calc(20% - ${playerHeight *xsRate/ 2}px)`,
      },   
      "& .users-on-board:nth-child(3)": {
        left: `0px`,
        top: `calc(20% - ${playerHeight*xsRate / 2}px)`,
      },
      "& .users-on-board:nth-child(2)": {
        left: `0px`,
        bottom: `calc(35% - ${playerHeight*xsRate / 2}px)`,       
      },
      "& .table-cards": {
        top: `calc(36% - ${(cardHeight * xsRate) / 2}px)!important`,     
      },
    },
    table_4: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${playerWidth* xsRate / 2}px)`,
        bottom: "20px",
      
      },
      "& .users-on-board:nth-child(4)": {
        right: `0px`,
        bottom: `calc(40% - ${playerHeight* xsRate / 2}px)`,
        
      },
      "& .users-on-board:nth-child(3)": {
        left: `calc(50% - ${playerWidth* xsRate / 2}px)`,
        top: "0px",
       
      },   
      "& .users-on-board:nth-child(2)": {
        left: `0px`,
        bottom: `calc(40% - ${playerHeight* xsRate / 2}px)`,
        
      },
      "& .table-cards": {
        top: `calc(35% - ${(cardHeight * xsRate) / 2}px)!important`,     
      },
    },
    table_3: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${playerWidth* xsRate / 2}px)`,
        bottom: "20px",
       
      },
      "& .users-on-board:nth-child(3)": {
        right: `0px`,
        top: `70px`,
      
      },
      "& .users-on-board:nth-child(2)": {
        left: `0px`,
        top: `70px`,
       
      },   
     
    },
    table_2: {
      "& .users-on-board:nth-child(1)": {
        left: `calc(50% - ${playerWidth*xsRate / 2}px)`,
        bottom: "20px",
      },
      "& .users-on-board:nth-child(2)": {
        left:  `calc(50% - ${playerWidth*xsRate / 2}px)`,
        top: "0px",
      },
      
     
    },
  },
  ...modalStyle(theme),
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

export default lobbyStyle;
