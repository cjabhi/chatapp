import { useEffect, useState , useRef } from "react";
import { Box, Button, Container, Input, VStack, HStack, useStatStyles } from "@chakra-ui/react";
import chakraTheme from '@chakra-ui/theme';
import Message from "./Component/Message";
import {getAuth,GoogleAuthProvider , signInWithPopup ,signOut, onAuthStateChanged} from "firebase/auth"
import {app} from "./Component/Firebase";
import {getFirestore , addDoc, collection, serverTimestamp , onSnapshot , query , orderBy} from "firebase/firestore"



const auth = getAuth(app);
const db = getFirestore(app);


const handlelogin = ()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth , provider)
}

const handlelogout = ()=>{
  signOut(auth);
}



function App() {
  const [user , setUser] = useState(false);
  const [message , setMessage] = useState("");
  const [messages , setMessages] = useState([]);
 
  const scroller = useRef(null);

  const handlesubmit = async (e) =>{
    e.preventDefault();
    try{
      await addDoc(collection(db , "Messages") , {
        text:message , 
        uid:user.uid,
        createdAt:serverTimestamp(),
      });
      setMessage("");
      scroller.current.scrollIntoView({behaviour:"smooth"});
    } catch(error){
          alert(error);
    }
  
  }



  useEffect(()=>{
    const q = query(collection(db,"Messages"),orderBy("createdAt" , "asc"))
    const unsubscribe = onAuthStateChanged(auth , (data) =>{
      setUser(data);
      // console.log(data);
    })
    const unsubmessage = onSnapshot(q,(snap)=>{
      setMessages(snap.docs.map((item)=>{
        const id = item.id;
        return {id , ...item.data()}
      }));
      console.log(snap.docs.map((item)=>{
        const id = item.id;
        return {id , ...item.data()}
      }));
    })
    return ()=>{
      unsubscribe();
      unsubmessage();
    } 

    

  },[]);
      


  return (
    <Box bg={"red.50"}>
      {user? (
        <Container bg={"white"} h={"100vh"}  >
        <VStack h={"full"} bg={"telegram.100"} paddingY={"4"} paddingX={"2"} >
          <Button onClick={handlelogout} w={"full"} colorScheme="red">
            Logout
          </Button>
          <VStack h={"full"} w={"full"} bg={"purple.100"} overflowY={"auto"} 
          sx={{
            '&::-webkit-scrollbar': {
              display : 'none'
            },
          }}
          >

              {
                messages.map((item)=>(
                  <Message key = {item.id}
                   text = {item.text}
                   uri = {item.uri} 
                   user={item.uid===user.uid ? "me" : "other"} />
                ))
              }
                <div ref={scroller}></div>
          </VStack>
              <form onSubmit={handlesubmit} style={{width:"100%" }}>
            <HStack>

                <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter a Message" />
                <Button colorScheme="purple" type="submit">
                  Send
                </Button>
            </HStack>
              </form>
        </VStack>
      </Container>
      ) : (
        <VStack h={"100vh"} justifyContent={"center"} >
          <Button onClick={handlelogin} colorScheme="green">Sign in with Google</Button>
        </VStack>
      )
}
    </Box>
  );
}

export default App;
