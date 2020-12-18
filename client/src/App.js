import React from "react";
import { Typography, Icon } from 'antd';
import Chatbot from './Chatbot/Chatbot';
const { Title } = Typography;

function App() {
  return (
    <div >
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
        <Title level={2} >CHAT BOT APP&nbsp;</Title>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center',alignItems: 'center',flexDirection:'column'}}>
       
        <Chatbot />


      </div>
    </div>
  )
}

export default App
