import React from 'react';
// import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingPage from "./Components/LoadingPage/LoadingPage";
import WelcomePage from "./Components/WelcomePage/WelcomePage";
import Register from "./Components/Register/Register";
import RegisterContinue from "./Components/RegisterContinue/RegisterContinue";
import Home from "./Components/Home/Home";
import Community from "./Components/Community/Community";
import RequireAuth from "./Components/RequireAuth";
import { UserProfile } from './Components/Profiles/UserProfile/UserProfile';
import LoginPage from './Components/login/Login';
import PreventRegContinue from './Components/preventRegContinue';
import ForgetPasswordPage from './Components/forget password/ForgetPassword';
import VerificationPage from './Components/forget password/VerificationPage';
import CreateNewPasswordPage from './Components/CreateNewPassword/CreateNewPasswordPage';
import Chats from './Components/Chats_/Chats';
import AboutUs from './Components/About us/AboutUs';
import ContactUs from './Components/contact us/ContactUs';
import VerifyRegister from './Components/VerifyRegister/VerifyRegister';
import { Training } from './Components/Career/Training/Training';
// import { Career } from './Components/Career/Career';
import { TrainingDetails } from './Components/Career/Training/TrainingDetails/TrainingDetails';
import { Chat } from './Components/Career/Training/TrainingDetails/Chat/ChatTraining';
import ApplyAsMentorForm from './Components/Apply_As_Mentor/ApplyAsMentorForm';
import AddTrackForm from './Components/Apply_As_Mentor/AddTrackForm';
import BookMarks from './Components/BookMarks/BookMarks';
import Carrer from './Components/Career/Carrer';
import RequestMentor from './Components/RequestMentor/RequestMentor';
import Schedules from './Components/Schedule/main-schedule';
import { SystemAdminProfile } from './Components/Profiles/SystemAdminProfile/SystemAdminProfile';
import PreventGoBack from './Components/PreventGoback';
import { Logout } from './Components/Logout/Logout';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/welcomePage" element={<WelcomePage />} />
      <Route  element={<PreventGoBack/>}>
        <Route path="/register" element={<Register  />} />
        <Route element={<PreventRegContinue/>}>
           <Route path="/registerContinue" element={<RegisterContinue  />} />  
           <Route path="/verifyRegister" element={< VerifyRegister/>} />   
        </Route>
     </Route>
        <Route path="/loginpage" element={<LoginPage/>} />
        <Route path='/forgetPassword' element={<ForgetPasswordPage/>}/>
        <Route path='/verification' element={<VerificationPage/>}/>
        <Route path='/createNewPass' element={<CreateNewPasswordPage/>}/>
         
       <Route element={<RequireAuth />}>
         <Route path="/home" element={<Home />} />
         <Route path="/community" element={<Community />} />
         <Route path="/chat" element={<Chats/>} />
         <Route path='/bookMarks' element={<BookMarks/>}/>
         <Route path='/requestMentor' element={<RequestMentor/>}/>
         <Route path="/aboutUs" element={<AboutUs/>} />
         <Route path="/contactUs" element={<ContactUs/>} />
         <Route path='/profile' element={<UserProfile/>}/>
         <Route path='/career' element={<Carrer/>}/>
         <Route path='/training' element={<Training/>}/>
         <Route path="/training-details/:trainingName" element={<TrainingDetails />} />
         <Route path='/ApplyAsMentor' element={<ApplyAsMentorForm/>}/>
         <Route path='/addTrack' element={<AddTrackForm/>}/>
         <Route path='/Schedule' element={<Schedules/>}/>
         <Route path='/profileSystemAdmin' element={<SystemAdminProfile/>}/>
         <Route path='/logout' element={<Logout/>}/>
      </Route>
      </Routes>
    </Router>
  );
}

export default App;
