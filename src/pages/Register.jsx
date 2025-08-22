import AuthPage from '../components/AuthPage';
import RegisterForm from '../components/RegisterForm';

export default function Register() {

    return (
        <AuthPage children={<RegisterForm />} />
    );
}
