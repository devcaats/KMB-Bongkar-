import AuthLayout from "@/Components/AuthPages/AuthPageLayout";
import SignInForm from "@/Components/AuthPages/SignInForm";
import { Head } from "@inertiajs/react";

export default function Login() {
    return (
        <>
            <Head title="Login" />
            <AuthLayout>
                <SignInForm></SignInForm>
            </AuthLayout>
        </>
    );
}
