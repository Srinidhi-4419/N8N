import { BrowserRouter,Routes,Route} from "react-router-dom"
import '@xyflow/react/dist/style.css';
import CreateWorkflow from "./pages/CreateWorkflow";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import WorkflowDetail from "./pages/WorkflowDetail";
import WorkflowExecutions from "./pages/WorkflowExecutions";

function App() {
 

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/create-workflow" element={<CreateWorkflow/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/create-workflow" element={<CreateWorkflow/>}/>
        <Route path="/workflow/:id" element={<WorkflowDetail/>}/>
        <Route path="/workflow/:id/executions" element={<WorkflowExecutions/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
