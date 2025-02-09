import Layout from '@/layout/Layout';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import EMIDetails from './pages/EMIDetails';

const HomeRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='*' element={<ErrorPage />} /> */}
        {/* <Route path='/login' element={<LoginInPage />} />
        <Route path='/signUp' element={<SignUpPage />} /> */}
        {/* <Route path='/' element={<ProtectedRoute />}>
          <Route path='/' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='/books' element={<Books />} />
            <Route path='/books/addBook' element={<AddBook />} />
            <Route path='/members' element={<Members />} />
            <Route path='/members/addMember' element={<AddMember />} />
          </Route>
        </Route> */}
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/emi/:id' element={<EMIDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default HomeRouter;
