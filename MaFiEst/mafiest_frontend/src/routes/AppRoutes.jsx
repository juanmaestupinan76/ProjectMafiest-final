import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageGroups from '../pages/admin/ManageGroups';
import StudentDashboard from '../pages/student/Dashboard';
import ViewActivities from '../pages/student/ViewActivities';
import SubmitActivity from '../pages/student/SubmitActivity';
import ViewGrades from '../pages/student/ViewGrades';
import TeacherDashboard from '../pages/teacher/Dashboard';
import UploadActivities from '../pages/teacher/UploadActivities';
import GradeActivity from '../pages/teacher/GradeActivity';
import TrackStudents from '../pages/teacher/TrackStudents';
import IndependentDashboard from '../pages/independent/Dashboard';
import Recordings from '../pages/Recordings';
import ViewTracking from '../pages/student/ViewTracking';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Landing from '../pages/Landing';
import Contact from '../pages/Contact';
import Advisory from '../pages/Advisory';
import Profile from '../pages/Profile';
import RutaProtegida from './RutaProtegida';

const AppRoutes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <RutaProtegida path="/contact" component={Contact} />
                <RutaProtegida path="/advisory" component={Advisory} />
                <RutaProtegida path="/profile" component={Profile} />
                
                <RutaProtegida path="/admin/dashboard" component={AdminDashboard} />
                <RutaProtegida path="/admin/manage-users" component={ManageUsers} />
                <RutaProtegida path="/admin/manage-groups" component={ManageGroups} />
                
                <RutaProtegida path="/student/dashboard" component={StudentDashboard} />
                <RutaProtegida path="/student/activities" component={ViewActivities} />
                <RutaProtegida path="/student/submit-activity/:id" component={SubmitActivity} />
                <RutaProtegida path="/student/grades" component={ViewGrades} />
                <RutaProtegida path="/student/tracking" component={ViewTracking} />
                <RutaProtegida path="/recordings" component={Recordings} />
                
                <RutaProtegida path="/teacher/dashboard" component={TeacherDashboard} />
                <RutaProtegida path="/teacher/activities/upload" component={UploadActivities} />
                <RutaProtegida path="/teacher/activities/grade/:id" component={GradeActivity} />
                <RutaProtegida path="/teacher/track-students" component={TrackStudents} />
                
                <RutaProtegida path="/independent/dashboard" component={IndependentDashboard} />
                <RutaProtegida path="/recordings" component={Recordings} />
            </Switch>
        </Router>
    );
};

export default AppRoutes;